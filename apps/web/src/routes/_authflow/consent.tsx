import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/integrations/auth/client";
import { useState } from "react";
import z from "zod";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { oauthApplication } from "@/db/schema.auth";
import { eq } from "drizzle-orm";
import { getUserData } from "@/db/crud/user_data";
import { MissingDataModal } from "@/components/auth/MissingDataModal";
import { scopeTranslations } from "@/utils/translations";
import { Avatar } from "@base-ui-components/react/avatar";

const getConsentData = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({
      clientId: z.string(),
    })
  )
  .handler(async ({ context, data }) => {
    const session = await context.getSession();
    if (!session) throw new Error("User not authenticated");

    const app = await db
      .select()
      .from(oauthApplication)
      .where(eq(oauthApplication.clientId, data.clientId));

    console.log(data.clientId, app);
    if (!app[0]) throw new Error("App not found");

    const metadata = JSON.parse(app[0].metadata || "{}") as {
      scopes: string[];
    };

    const requiredScopes = metadata.scopes;
    const currentData = await getUserData({
      data: { userId: session.user.id },
    });
    const currentDataByType = currentData.filter((data) =>
      requiredScopes.includes(data.type)
    );

    return {
      requiredScopes,
      currentData: currentDataByType,
      userId: session.user.id,
      userEmail: session.user.email,
      appName: app[0].name,
      appIcon: app[0].icon,
      redirectUrl: app[0].redirectURLs,
    };
  });

export const Route = createFileRoute("/_authflow/consent")({
  validateSearch: z.object({
    client_id: z.string(),
    consent_code: z.string().optional(),
    scope: z.string().optional(),
  }),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps: { search } }) => {
    const consentData = await getConsentData({
      data: { clientId: search.client_id },
    });
    return {
      ...consentData,
    };
  },
  component: ConsentPage,
});

function ConsentPage() {
  const [error, setError] = useState<string | null>(null);
  const {
    currentData,
    requiredScopes,
    userId,
    userEmail,
    appName,
    appIcon,
    redirectUrl,
  } = Route.useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if all required scopes have corresponding data
  const hasAllRequiredData = requiredScopes.every((scope: string) =>
    currentData.some((data: { type: string }) => data.type === scope)
  );

  const consentMutation = useMutation({
    mutationFn: async (accept: boolean) => {
      const res = await authClient.oauth2.consent({
        accept,
      });
      return res;
    },
    onSuccess: (data) => {
      if (data.data?.redirectURI) {
        window.location.href = data.data.redirectURI;
      } else if (redirectUrl) {
        // Fallback to the app's redirect URL if the server doesn't return one
        // This might happen if the consent flow doesn't immediately redirect
        window.location.href = redirectUrl;
      } else {
        setError(
          "No se pudo redirigir a la aplicación. Por favor intente nuevamente."
        );
      }
    },
    onError: (err) => {
      console.error("Consent error:", err);
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center">
            <Avatar.Root className="w-16 h-16 rounded-lg border border-gray-200 shadow-md overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              {appIcon && (
                <Avatar.Image
                  src={appIcon}
                  alt={appName || "Application"}
                  className="w-full h-full object-cover"
                  width="64"
                  height="64"
                />
              )}
              <Avatar.Fallback className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500">
                {(appName || "A").charAt(0).toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Accede a {appName || "MyApp"}
          </h2>
          <p className="text-sm text-gray-600">
            {appName || "MyApp"} quiere acceder a su información
          </p>
        </div>

        {isModalOpen && (
          <MissingDataModal
            scopes={requiredScopes.filter(
              (scope: string) =>
                !currentData.some(
                  (data: { type: string }) => data.type === scope
                )
            )}
            userId={userId}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        <div className="py-4">
          <div className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-md">
            <div className="flex items-center justify-center space-x-4">
              <Avatar.Root className="h-10 w-10 rounded-full border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Avatar.Fallback className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">
                  {userEmail.charAt(0).toUpperCase()}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{userEmail}</p>
                <p className="text-gray-500">Cuenta Personal</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="text-left">
                {currentData.length > 0 && (
                  <>
                    <h3 className="text-sm font-medium text-gray-900">
                      La siguiente información será compartida:
                    </h3>
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                      {currentData.map(
                        (data: { id: string; type: string; value: string }) => (
                          <li key={data.id} className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {scopeTranslations[data.type] || data.type}:{" "}
                            {data.value}
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}

                {requiredScopes.filter(
                  (scope: string) =>
                    !currentData.some(
                      (data: { type: string }) => data.type === scope
                    )
                ).length > 0 && (
                  <>
                    <h3 className="mt-4 text-sm font-medium text-red-600">
                      La siguiente información es requerida:
                    </h3>
                    <ul className="mt-2 text-sm text-red-500 list-disc list-inside">
                      {requiredScopes
                        .filter(
                          (scope: string) =>
                            !currentData.some(
                              (data: { type: string }) => data.type === scope
                            )
                        )
                        .map((scope: string) => (
                          <li key={scope} className="flex items-center gap-2">
                            <span>⚠️</span>
                            {scopeTranslations[scope] || scope}
                          </li>
                        ))}
                    </ul>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Agregar información faltante
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-gray-500 text-center">
            Al hacer clic en Permitir, permite que esta aplicación y Google usen
            su información de acuerdo con sus respectivos términos de servicio y
            políticas de privacidad.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
          <button
            onClick={() => consentMutation.mutate(false)}
            disabled={consentMutation.isPending}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Denegar
          </button>
          <button
            onClick={() => consentMutation.mutate(true)}
            disabled={consentMutation.isPending || !hasAllRequiredData}
            title={
              !hasAllRequiredData
                ? "Please add all required information before proceeding"
                : ""
            }
            className="w-full sm:w-auto px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {consentMutation.isPending ? "Procesando..." : "Permitir"}
          </button>
        </div>
      </div>
    </div>
  );
}
