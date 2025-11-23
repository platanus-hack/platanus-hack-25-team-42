import { db } from "@/db";
import { oauthApplication, oauthConsent, user } from "@/db/schema";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { Avatar } from "@base-ui-components/react/avatar";

const getApp = createServerFn({
  method: "GET",
})
  .inputValidator(z.object({ clientId: z.string() }))
  .handler(async ({ context, data }) => {
    const session = await context.getSession();
    const userId = session?.user.id;
    if (!userId) throw new Error("User not authenticated");

    // Get app details
    const app = await db
      .select()
      .from(oauthApplication)
      .where(
        and(
          eq(oauthApplication.clientId, data.clientId),
          eq(oauthApplication.userId, userId)
        )
      )
      .limit(1);

    if (!app[0]) throw new Error("App not found");

    return {
      app: app[0],
    };
  });

const getAppUsers = createServerFn()
  .inputValidator(z.object({ clientId: z.string() }))
  .handler(async ({ context, data }) => {
    const session = await context.getSession();
    const userId = session?.user.id;
    if (!userId) throw new Error("User not authenticated");

    const users = await db
      .select({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
        },
        consent: {
          id: oauthConsent.id,
          scopes: oauthConsent.scopes,
          consentGiven: oauthConsent.consentGiven,
          createdAt: oauthConsent.createdAt,
          updatedAt: oauthConsent.updatedAt,
        },
      })
      .from(oauthConsent)
      .innerJoin(user, eq(oauthConsent.userId, user.id))
      .where(eq(oauthConsent.clientId, data.clientId));
    return users;
  });

export const Route = createFileRoute("/_with_header/_authed/dev/app/$clientId")(
  {
    component: RouteComponent,
    loader: async ({ params }) => {
      const [result, users] = await Promise.all([
        getApp({ data: { clientId: params.clientId } }),
        getAppUsers({ data: { clientId: params.clientId } }),
      ]);

      return {
        app: result.app,
        users,
      };
    },
  }
);

function RouteComponent() {
  const { app, users } = Route.useLoaderData();
  const navigate = useNavigate();

  let metadata: any = {};
  try {
    metadata = app.metadata ? JSON.parse(app.metadata) : {};
  } catch (e) {
    console.error("Failed to parse metadata", e);
  }
  const scopes = metadata.scopes || [];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate({ to: "/dev" })}
          className="mb-4 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver
        </button>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar.Root className="w-16 h-16 rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  {app.icon && (
                    <Avatar.Image
                      src={app.icon}
                      alt={app.name || "Icono de Aplicación"}
                      className="w-full h-full object-cover"
                      width="64"
                      height="64"
                    />
                  )}
                  <Avatar.Fallback className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-500">
                    {(app.name || "A").charAt(0).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {app.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-slate-500 font-mono">
                      ID: {app.id}
                    </span>
                    {app.disabled ? (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        Deshabilitada
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Activa
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full capitalize">
                      {app.type || "Aplicación Web"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p>
                  Creada{" "}
                  {app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  Actualizada{" "}
                  {app.updatedAt
                    ? new Date(app.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            {scopes.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {scopes.map((scope: string) => (
                  <span
                    key={scope}
                    className="px-2.5 py-1 bg-white text-slate-600 text-xs font-medium rounded-md border border-slate-200 shadow-sm"
                  >
                    {scope}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Configuración
                </h3>
                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                  <div className="divide-y divide-slate-200">
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-slate-500">
                        ID de Cliente
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <code className="text-sm text-slate-900 font-mono bg-white px-2 py-1 rounded border border-slate-200">
                          {app.clientId}
                        </code>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(app.clientId ?? "")
                          }
                          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                          title="Copiar al portapapeles"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-slate-500">
                        Secreto de Cliente
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <code className="text-sm text-slate-900 font-mono bg-white px-2 py-1 rounded border border-slate-200 break-all">
                          {app.clientSecret}
                        </code>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              app.clientSecret ?? ""
                            )
                          }
                          className="text-slate-400 hover:text-slate-600 transition-colors p-1 shrink-0"
                          title="Copiar al portapapeles"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-slate-500">
                        URIs de Redirección
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <code className="text-sm text-slate-900 font-mono bg-white px-2 py-1 rounded border border-slate-200 break-all">
                          {app.redirectURLs}
                        </code>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(
                              app.redirectURLs ?? ""
                            )
                          }
                          className="text-slate-400 hover:text-slate-600 transition-colors p-1 shrink-0"
                          title="Copiar al portapapeles"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Usuarios con Acceso
                  </h3>
                  <span className="text-sm text-slate-500">
                    {users.length} {users.length === 1 ? "usuario" : "usuarios"}
                  </span>
                </div>
                {users.length === 0 ? (
                  <div className="bg-slate-50 rounded-lg border border-slate-200 p-8 text-center">
                    <svg
                      className="w-12 h-12 mx-auto text-slate-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-slate-500 text-sm">
                      No hay usuarios con acceso a esta aplicación aún
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {users.map((userData) => {
                      const userInfo = userData.user;
                      const consent = userData.consent;
                      let consentScopes: string[] = [];
                      try {
                        consentScopes = consent.scopes
                          ? JSON.parse(consent.scopes)
                          : [];
                      } catch (e) {
                        console.error("Failed to parse scopes", e);
                      }

                      return (
                        <div
                          key={userInfo.id}
                          className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar.Root className="w-12 h-12 rounded-lg border border-slate-200 shadow-sm overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0">
                              {userInfo.image && (
                                <Avatar.Image
                                  src={userInfo.image}
                                  alt={userInfo.name || "Usuario"}
                                  className="w-full h-full object-cover"
                                  width="48"
                                  height="48"
                                />
                              )}
                              <Avatar.Fallback className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-500">
                                {(userInfo.name || "U").charAt(0).toUpperCase()}
                              </Avatar.Fallback>
                            </Avatar.Root>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-slate-900 truncate">
                                    {userInfo.name || "Usuario sin nombre"}
                                  </h4>
                                  <p className="text-xs text-slate-500 truncate mt-0.5">
                                    {userInfo.email}
                                  </p>
                                </div>
                                {consent.consentGiven ? (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full shrink-0">
                                    Activo
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full shrink-0">
                                    Pendiente
                                  </span>
                                )}
                              </div>
                              {consentScopes.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {consentScopes
                                    .slice(0, 3)
                                    .map((scope: string) => (
                                      <span
                                        key={scope}
                                        className="px-1.5 py-0.5 bg-slate-50 text-slate-600 text-xs font-medium rounded border border-slate-200"
                                      >
                                        {scope}
                                      </span>
                                    ))}
                                  {consentScopes.length > 3 && (
                                    <span className="px-1.5 py-0.5 text-slate-500 text-xs">
                                      +{consentScopes.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                              <div className="mt-2 text-xs text-slate-400">
                                Conectado{" "}
                                {consent.createdAt
                                  ? new Date(
                                      consent.createdAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
