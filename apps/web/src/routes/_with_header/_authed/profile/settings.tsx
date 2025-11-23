import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/integrations/auth/client";
import { useState } from "react";
import { db } from "@/db";
import { passkey, user } from "@/db/schema.auth";
import { eq } from "drizzle-orm";
import { Plus, Key, Clock, Shield } from "lucide-react";
import z from "zod";

// Server function to get user's passkeys
const getPasskeys = createServerFn({
  method: "GET",
}).handler(async ({ context }) => {
  const session = await context.getSession();
  if (!session) throw new Error("User not authenticated");

  const passkeys = await db
    .select()
    .from(passkey)
    .where(eq(passkey.userId, session.user.id));

  return passkeys;
});

// Server function to get user's data retention preference
const getDataRetention = createServerFn({
  method: "GET",
}).handler(async ({ context }) => {
  const session = await context.getSession();
  if (!session) throw new Error("User not authenticated");

  // For now, return a default value. In production, this would come from a user_preferences table
  return { days: 90 };
});

// Server function to update data retention preference
const updateDataRetention = createServerFn({ method: "POST" })
  .inputValidator(z.object({ days: z.number() }))
  .handler(async ({ context, data }) => {
    const session = await context.getSession();
    if (!session) throw new Error("User not authenticated");

    // In production, this would update a user_preferences table
    console.log(
      `Updating data retention for user ${session.user.id} to ${data.days} days`
    );
    return { success: true, days: data.days };
  });

export const Route = createFileRoute("/_with_header/_authed/profile/settings")({
  component: SettingsPage,
  loader: async () => {
    const [passkeys, retention] = await Promise.all([
      getPasskeys(),
      getDataRetention(),
    ]);
    return { passkeys, retention };
  },
});

function SettingsPage() {
  const { passkeys, retention } = Route.useLoaderData();
  const router = useRouter();
  const [isCreatingPasskey, setIsCreatingPasskey] = useState(false);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [selectedRetention, setSelectedRetention] = useState(retention.days);

  const addPasskeyMutation = useMutation({
    mutationFn: async () => {
      setIsCreatingPasskey(true);
      setPasskeyError(null);

      const result = await authClient.passkey.addPasskey({
        name: `Passkey - ${new Date().toLocaleDateString("es-ES")}`,
      });

      if (result.error) {
        throw new Error(result.error.message || "Error al crear passkey");
      }

      return result;
    },
    onSuccess: () => {
      router.invalidate();
      setIsCreatingPasskey(false);
    },
    onError: (error: Error) => {
      setPasskeyError(error.message);
      setIsCreatingPasskey(false);
    },
  });

  const updateRetentionMutation = useMutation({
    mutationFn: async (days: number) => {
      return await updateDataRetention({ data: { days } });
    },
    onSuccess: () => {
      router.invalidate();
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
          <p className="text-slate-500 mt-1">
            Administra tus preferencias de seguridad y privacidad
          </p>
        </div>

        {/* Passkeys Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-100">
                    <Key className="w-5 h-5 text-yellow-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Passkeys
                    </h2>
                    <p className="text-sm text-slate-500">
                      Autenticación sin contraseña
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => addPasskeyMutation.mutate()}
                  disabled={isCreatingPasskey}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingPasskey ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creando...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Agregar Passkey</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {passkeyError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {passkeyError}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Tipo de Dispositivo</th>
                    <th className="px-6 py-4">Respaldado</th>
                    <th className="px-6 py-4">Creado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {passkeys.length > 0 ? (
                    passkeys.map((pk) => (
                      <tr
                        key={pk.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-yellow-700" />
                            <span className="font-medium text-slate-900">
                              {pk.name || "Sin nombre"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                            {pk.deviceType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {pk.backedUp ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Sí
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-slate-600 text-sm">
                              {pk.createdAt
                                ? new Date(pk.createdAt).toLocaleDateString(
                                    "es-ES",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </span>
                            {pk.createdAt && (
                              <span className="text-xs text-slate-400">
                                {new Date(pk.createdAt).toLocaleTimeString(
                                  "es-ES",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Key className="w-12 h-12 text-slate-300 mb-3" />
                          <p className="text-lg font-medium text-slate-900">
                            No hay passkeys configuradas
                          </p>
                          <p className="text-sm text-slate-500">
                            Agrega tu primera passkey para autenticación segura
                            sin contraseña
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Data Retention Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Retención de Datos
                  </h2>
                  <p className="text-sm text-slate-500">
                    Configura cuánto tiempo se almacenan tus datos
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-slate-600 mb-6 leading-relaxed">
                Por tu seguridad y privacidad, tus datos personales almacenados
                en nuestro sistema serán eliminados automáticamente después del
                período de retención configurado. Esto garantiza que tu
                información no permanezca en nuestros sistemas más tiempo del
                necesario.
              </p>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="retention-period"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Período de retención
                  </label>
                  <select
                    id="retention-period"
                    value={selectedRetention}
                    onChange={(e) =>
                      setSelectedRetention(Number(e.target.value))
                    }
                    className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-700 focus:border-transparent"
                  >
                    <option value={30}>30 días</option>
                    <option value={60}>60 días</option>
                    <option value={90}>90 días</option>
                    <option value={180}>180 días (6 meses)</option>
                    <option value={365}>1 año</option>
                    <option value={730}>2 años</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateRetentionMutation.mutate(selectedRetention)
                    }
                    disabled={
                      updateRetentionMutation.isPending ||
                      selectedRetention === retention.days
                    }
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateRetentionMutation.isPending
                      ? "Guardando..."
                      : "Guardar"}
                  </button>
                  {selectedRetention !== retention.days && (
                    <span className="text-sm text-amber-600">
                      Tienes cambios sin guardar
                    </span>
                  )}
                </div>

                {updateRetentionMutation.isSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                    Preferencia de retención actualizada correctamente
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
