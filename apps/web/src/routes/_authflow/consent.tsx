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
    };
  });

export const Route = createFileRoute("/_authflow/consent")({
  validateSearch: z.object({
    client_id: z.string(),
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
  const { currentData, requiredScopes } = Route.useLoaderData();

  const consentMutation = useMutation({
    mutationFn: async (accept: boolean) => {
      const res = await authClient.oauth2.consent({
        accept,
      });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          {JSON.stringify(requiredScopes)} {JSON.stringify(currentData)}
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Iniciar sesión con MyApp
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            MyApp quiere acceder a su cuenta
          </p>
        </div>

        <div className="py-4">
          <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-md">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              U
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">user@example.com</p>
              <p className="text-gray-500">Cuenta Personal</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
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
            disabled={consentMutation.isPending}
            className="w-full sm:w-auto px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {consentMutation.isPending ? "Procesando..." : "Permitir"}
          </button>
        </div>
      </div>
    </div>
  );
}
