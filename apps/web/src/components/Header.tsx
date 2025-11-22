import { Link, useRouterState } from "@tanstack/react-router";
import { authClient } from "@/integrations/auth/client";

export function Header() {
  const { data: session } = authClient.useSession();
  const router = useRouterState();
  const pathname = router.location.pathname;

  if (pathname.startsWith("/login") || pathname.startsWith("/profile")) {
    return null;
  }

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
          >
            Platanus Auth
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              activeProps={{ className: "text-white" }}
            >
              Home
            </Link>
            {session && (
              <>
                <Link
                  to="/admin/users"
                  className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  activeProps={{ className: "text-white" }}
                >
                  User
                </Link>
                <Link
                  to="/admin/users"
                  className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  activeProps={{ className: "text-white" }}
                >
                  User
                </Link>

                <Link
                  to="/admin/credentials"
                  className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  activeProps={{ className: "text-white" }}
                >
                  Credentials
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-8 h-8 rounded-full border border-slate-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                    {session.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden sm:block text-right">
                  <p className="text-white text-sm font-medium leading-none">
                    {session.user.name}
                  </p>
                  <p className="text-slate-400 text-xs leading-none mt-1">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => authClient.signOut()}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
              search={{ redirect: pathname }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
