import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { user, account } from "@/db/schema.auth";
import { eq } from "drizzle-orm";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/integrations/auth/client";

// Server function to get users with their accounts
const getUsers = createServerFn({
  method: "GET",
}).handler(async () => {
  const users = await db.select().from(user);

  // Fetch accounts for each user to know their providers
  const usersWithAccounts = await Promise.all(
    users.map(async (u) => {
      const accounts = await db
        .select()
        .from(account)
        .where(eq(account.userId, u.id));
      return {
        ...u,
        accounts,
      };
    })
  );

  return usersWithAccounts;
});

export const Route = createFileRoute("/_with_header/staff/users")({
  component: AdminUsersPage,
  loader: async () => {
    const users = await getUsers();
    return { users };
  },
});

function AdminUsersPage() {
  const { users } = Route.useLoaderData();
  const router = useRouter();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const deleteUserMutation = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const response = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      return response.json();
    },
    onSuccess: () => {
      router.invalidate();
    },
  });

  const handleDelete = (userId: string) => {
    if (
      confirm(
        "¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer."
      )
    ) {
      deleteUserMutation.mutate({ userId } as any);
    }
  };

  if (isSessionPending) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-700 mx-auto mb-4"></div>
          <p>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p className="mb-4">Debe iniciar sesión para ver esta página.</p>
          <a href="/login" className="text-yellow-600 hover:underline">
            Ir a Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Gestión de Usuarios
            </h1>
            <p className="text-slate-500 mt-1">
              Administre usuarios del sistema y permisos
            </p>
          </div>
          <div className="text-sm font-medium bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-slate-600">
            Total de Usuarios: {users.length}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Métodos de Autenticación</th>
                  <th className="px-6 py-4">Se Unió</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-yellow-50 to-yellow-100 flex items-center justify-center text-sm font-bold text-yellow-700 border border-yellow-100">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {user.name}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {user.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-600">{user.email}</span>
                        {user.emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-0.5 font-medium">
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
                            Verificado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600 mt-0.5 font-medium">
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
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            No Verificado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {user.accounts.length > 0 ? (
                          user.accounts.map((acc) => (
                            <span
                              key={acc.id}
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize"
                            >
                              {acc.providerId}
                            </span>
                          ))
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            Correo/Contraseña
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-600 text-sm">
                          {new Date(user.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(user.createdAt).toLocaleTimeString(
                            undefined,
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deleteUserMutation.isPending}
                        className="group text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar Usuario"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-slate-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-12 h-12 text-slate-300 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <p className="text-lg font-medium text-slate-900">
                          No se encontraron usuarios
                        </p>
                        <p className="text-sm text-slate-500">
                          No hay usuarios registrados en el sistema.
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
    </div>
  );
}
