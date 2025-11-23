import { db } from "@/db";
import { oauthApplication, appCredentialsTable } from "@/db/schema";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import z from "zod";

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

    // Get credentials for this app
    const credentials = await db
      .select()
      .from(appCredentialsTable)
      .where(eq(appCredentialsTable.appId, data.clientId));

    return {
      app: app[0],
      credentials,
    };
  });

export const Route = createFileRoute("/_with_header/_authed/dev/app/$clientId")(
  {
    component: RouteComponent,
    loader: async ({ params }) => {
      const result = await getApp({ data: { clientId: params.clientId } });
      return result;
    },
  }
);

function RouteComponent() {
  const { app, credentials } = Route.useLoaderData();

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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {app.icon ? (
                  <img
                    src={app.icon}
                    alt={app.name || "Icono de Aplicación"}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl font-bold text-slate-500 border border-slate-200">
                    {(app.name || "A").charAt(0).toUpperCase()}
                  </div>
                )}
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

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
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
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Credenciales
                </h3>
                {credentials.length === 0 ? (
                  <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200 border-dashed">
                    <p className="text-slate-500">
                      No se encontraron credenciales adicionales para esta
                      aplicación.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {credentials.map((cred) => (
                      <div
                        key={cred.id}
                        className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                            {cred.provider}
                          </span>
                          <span className="text-xs text-slate-400">
                            Agregada{" "}
                            {new Date(cred.createdAt!).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                              Nombre de Clave
                            </label>
                            <p className="text-sm text-slate-900 font-medium">
                              {cred.keyName}
                            </p>
                          </div>

                          <div>
                            <label className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                              Valor
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-xs text-slate-600 bg-slate-50 px-2 py-1.5 rounded border border-slate-200 flex-1 font-mono break-all">
                                {cred.keyValue}
                              </code>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(cred.keyValue);
                                }}
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div>
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 sticky top-24">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
                  Acciones Rápidas
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2">
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Editar Aplicación
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2">
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Regenerar Secreto
                  </button>
                  <div className="h-px bg-slate-100 my-2"></div>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Eliminar Aplicación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
