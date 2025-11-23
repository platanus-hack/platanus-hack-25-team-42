import { db } from "@/db";
import { oauthApplication } from "@/db/schema.auth";
import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { Avatar } from "@base-ui-components/react/avatar";

const getApps = createServerFn({
  method: "GET",
}).handler(async ({ context }) => {
  const session = await context.getSession();
  const userId = session?.user.id;
  if (!userId) throw new Error("User not authenticated");

  const apps = await db
    .select()
    .from(oauthApplication)
    .where(eq(oauthApplication.userId, userId));

  return apps;
});

export const Route = createFileRoute("/_with_header/_authed/dev/")({
  component: RouteComponent,
  loader: async () => {
    const apps = await getApps();
    return {
      apps,
    };
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { apps } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Aplicaciones</h2>
            <p className="text-slate-500 mt-1">
              Administre sus aplicaciones OAuth
            </p>
          </div>
          <button
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            onClick={() => {
              navigate({ to: "./apps/new" });
            }}
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
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Crear Nueva Aplicación
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => {
            let metadata: any = {};
            try {
              metadata = app.metadata ? JSON.parse(app.metadata) : {};
            } catch (e) {
              console.error("Failed to parse metadata", e);
            }
            const scopes = metadata.scopes || [];

            return (
              <Link
                key={app.clientId}
                to="/dev/app/$clientId"
                params={{ clientId: app.clientId! }}
                className="group block bg-white p-6 rounded-xl border border-slate-200 hover:border-yellow-700 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar.Root className="w-12 h-12 rounded-lg border border-slate-100 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0">
                      {app.icon && (
                        <Avatar.Image
                          src={app.icon}
                          alt={app.name || "Icono de Aplicación"}
                          className="w-full h-full object-cover"
                          width="48"
                          height="48"
                        />
                      )}
                      <Avatar.Fallback className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-500">
                        {(app.name || "A").charAt(0).toUpperCase()}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-yellow-700 transition-colors">
                        {app.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-mono">
                        {app.clientId?.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                  {app.disabled && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      Deshabilitada
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {scopes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {scopes.slice(0, 3).map((scope: string) => (
                        <span
                          key={scope}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200"
                        >
                          {scope}
                        </span>
                      ))}
                      {scopes.length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-xs rounded border border-slate-100">
                          +{scopes.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-50">
                    <span>
                      Creada{" "}
                      {app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <span className="capitalize">
                      {app.type || "Aplicación Web"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
          {apps.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-slate-900 font-medium mb-1">
                Aún no hay aplicaciones
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Comience creando su primera aplicación OAuth
              </p>
              <button
                className="text-yellow-700 font-medium text-sm hover:text-yellow-800 hover:underline"
                onClick={() => navigate({ to: "./apps/new" })}
              >
                Crear aplicación &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
