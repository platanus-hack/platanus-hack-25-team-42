import { Link, useLocation } from "@tanstack/react-router";
import { authClient } from "@/integrations/auth/client";
import { Avatar } from "@base-ui-components/react/avatar";

export function Header() {
  const { data: session, isPending } = authClient.useSession();
  const location = useLocation();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-8">
      <div className="container mx-auto h-16 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-xl font-bold bg-linear-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent hover:text-yellow-700 transition-colors"
          >
            GoBoard
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
              activeProps={{ className: "text-slate-900" }}
            >
              Inicio
            </Link>
            {!isPending && session && (
              <>
                <Link
                  to="/staff/users"
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                  activeProps={{ className: "text-slate-900" }}
                >
                  Usuarios (Solo Staff!)
                </Link>
                <Link
                  to="/dev"
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                  activeProps={{ className: "text-slate-900" }}
                >
                  Panel de Desarrollador (Clientes)
                </Link>
                <Link
                  to="/profile"
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                  activeProps={{ className: "text-slate-900" }}
                >
                  Panel de Perfil (Usuarios)
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isPending ? (
            <div className="flex items-center gap-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div className="hidden sm:block">
                  <div className="h-4 w-24 bg-slate-200 rounded mb-1" />
                  <div className="h-3 w-32 bg-slate-200 rounded" />
                </div>
              </div>
            </div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar.Root className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden bg-yellow-700 flex items-center justify-center shrink-0">
                  {session.user.image && (
                    <Avatar.Image
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-full h-full object-cover"
                      width="32"
                      height="32"
                    />
                  )}
                  <Avatar.Fallback className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                    {session.user.name.charAt(0).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div className="hidden sm:block text-right">
                  <p className="text-slate-900 text-sm font-medium leading-none">
                    {session.user.name}
                  </p>
                  <p className="text-slate-500 text-xs leading-none mt-1">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => authClient.signOut()}
                className="px-3 py-1.5 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
              search={{ redirect: location.pathname }}
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
