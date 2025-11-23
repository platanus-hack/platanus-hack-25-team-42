import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Shield, X } from "lucide-react";
import { db } from "@/db";
import { oauthConsent, oauthApplication } from "@/db/schema.auth";
import { eq } from "drizzle-orm";
import z from "zod";

// Scope mapping to Spanish labels
const scopeMapping: Record<string, string> = {
  rut: "RUT",
  email: "Correo electrónico",
  phone: "Teléfono",
  first_name: "Nombre",
  last_name: "Apellido",
  date_of_birth: "Fecha de nacimiento",
  nationality: "Nacionalidad",
  marital_status: "Estado civil",
  address: "Dirección",
  gender: "Género",
  profession: "Profesión",
  income: "Ingresos",
  job_position: "Cargo",
};

interface ConsentedApp {
  consentId: string;
  appId: string;
  appName: string | null;
  appIcon: string | null;
  scopes: string[];
  consentGiven: boolean | null;
  createdAt: Date | null;
}

// Server function to get consented applications
const getConsentedApplications = createServerFn({
  method: "GET",
}).handler(async ({ context }) => {
  const session = await context.getSession();
  if (!session) throw new Error("Usuario no autenticado");

  const consents = await db
    .select({
      consentId: oauthConsent.id,
      appId: oauthApplication.id,
      appName: oauthApplication.name,
      appIcon: oauthApplication.icon,
      appClientId: oauthApplication.clientId,
      metadata: oauthApplication.metadata,
      consentGiven: oauthConsent.consentGiven,
      createdAt: oauthConsent.createdAt,
    })
    .from(oauthConsent)
    .innerJoin(
      oauthApplication,
      eq(oauthConsent.clientId, oauthApplication.clientId)
    )
    .where(eq(oauthConsent.userId, session.user.id));

  // Parse scopes and format data
  const formattedConsents: ConsentedApp[] = consents.map((c) => {
    const metadata = c.metadata
      ? (JSON.parse(c.metadata as string) as { scopes?: string[] })
      : null;
    return {
      consentId: c.consentId,
      appId: c.appId,
      appName: c.appName,
      appIcon: c.appIcon,
      scopes: metadata?.scopes || [],
      consentGiven: c.consentGiven,
      createdAt: c.createdAt,
    };
  });

  return formattedConsents;
});

// Server function to revoke consent
const revokeConsent = createServerFn({ method: "POST" })
  .inputValidator(z.object({ consentId: z.string() }))
  .handler(async ({ context, data }) => {
    const session = await context.getSession();
    if (!session) throw new Error("Usuario no autenticado");

    await db
      .update(oauthConsent)
      .set({ consentGiven: false })
      .where(eq(oauthConsent.id, data.consentId));

    return { success: true };
  });

export const Route = createFileRoute(
  "/_with_header/_authed/profile/connected-apps"
)({
  component: ConnectedAppsView,
  loader: async () => {
    const apps = await getConsentedApplications();
    return { apps };
  },
});

function ConnectedAppsView() {
  const { apps } = Route.useLoaderData();
  const router = useRouter();
  const [confirmingRevoke, setConfirmingRevoke] = useState<ConsentedApp | null>(
    null
  );

  const revokeConsentMutation = useMutation({
    mutationFn: async (consentId: string) => {
      return await revokeConsent({ data: { consentId } });
    },
    onSuccess: () => {
      router.invalidate();
      setConfirmingRevoke(null);
    },
  });

  const allowedApps = apps.filter((app) => app.consentGiven === true);
  const revokedApps = apps.filter((app) => app.consentGiven === false);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Aplicaciones Conectadas
          </h1>
          <p className="text-slate-500 mt-1">
            Gestiona los permisos de las aplicaciones que tienen acceso a tus
            datos
          </p>
        </div>

        {/* Allowed Applications */}
        <div className="mb-8">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Aplicaciones Permitidas
          </h2>
          {allowedApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allowedApps.map((app) => (
                <div
                  key={app.consentId}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {app.appIcon ? (
                          <img
                            src={app.appIcon}
                            alt={app.appName || "App"}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-bold text-slate-500">
                            {(app.appName || "A").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {app.appName || "Aplicación sin nombre"}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            Acceso permitido
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Permisos otorgados
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {app.scopes.length > 0 ? (
                            app.scopes.map((scope: string) => (
                              <span
                                key={scope}
                                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200"
                              >
                                {scopeMapping[scope] || scope}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">
                              Sin permisos específicos
                            </span>
                          )}
                        </div>
                      </div>

                      {app.createdAt && (
                        <div className="text-xs text-slate-400 pt-2 border-t border-slate-50">
                          Conectada el{" "}
                          {new Date(app.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      )}

                      <button
                        onClick={() => setConfirmingRevoke(app)}
                        className="w-full mt-3 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors text-sm border border-red-200"
                      >
                        Revocar Acceso
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-lg font-medium text-slate-900">
                No hay aplicaciones permitidas
              </p>
              <p className="text-sm text-slate-500">
                Cuando otorgues permisos a aplicaciones, aparecerán aquí
              </p>
            </div>
          )}
        </div>

        {/* Revoked Applications */}
        {revokedApps.length > 0 && (
          <div className="mb-8">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
              <XCircle className="w-5 h-5 text-red-600" />
              Aplicaciones Rechazadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {revokedApps.map((app) => (
                <div
                  key={app.consentId}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden opacity-60"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {app.appIcon ? (
                          <img
                            src={app.appIcon}
                            alt={app.appName || "App"}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-bold text-slate-500">
                            {(app.appName || "A").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {app.appName || "Aplicación sin nombre"}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium mt-0.5">
                            <XCircle className="w-3 h-3" />
                            Acceso revocado
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Permisos que tenía
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {app.scopes.length > 0 ? (
                            app.scopes.map((scope: string) => (
                              <span
                                key={scope}
                                className="px-2 py-0.5 bg-slate-100 text-slate-400 text-xs rounded border border-slate-200 line-through"
                              >
                                {scopeMapping[scope] || scope}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">
                              Sin permisos específicos
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {confirmingRevoke && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl border border-slate-200 shadow-lg max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {confirmingRevoke.appIcon ? (
                      <img
                        src={confirmingRevoke.appIcon}
                        alt={confirmingRevoke.appName || "App"}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-xl font-bold text-red-600">
                        !
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        ¿Revocar acceso?
                      </h3>
                      <p className="text-sm text-slate-500">
                        {confirmingRevoke.appName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setConfirmingRevoke(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-slate-600 mb-4">
                  Esta acción revocará los siguientes permisos:
                </p>

                <div className="bg-slate-50 rounded-lg p-3 mb-6 max-h-48 overflow-y-auto">
                  {confirmingRevoke.scopes.length > 0 ? (
                    <div className="space-y-2">
                      {confirmingRevoke.scopes.map((scope) => (
                        <div
                          key={scope}
                          className="flex items-center gap-2 text-sm text-slate-700"
                        >
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span>{scopeMapping[scope] || scope}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">
                      Sin permisos específicos
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setConfirmingRevoke(null)}
                    disabled={revokeConsentMutation.isPending}
                    className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() =>
                      revokeConsentMutation.mutate(confirmingRevoke.consentId)
                    }
                    disabled={revokeConsentMutation.isPending}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {revokeConsentMutation.isPending
                      ? "Revocando..."
                      : "Revocar Acceso"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
