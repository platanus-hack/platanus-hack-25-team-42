import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { User, AppWindow, Settings } from "lucide-react";

export const Route = createFileRoute("/_with_header/_authed/profile")({
  component: ProfileLayout,
});

function ProfileLayout() {
  return (
    <>
      <nav className="bg-slate-50 px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link
            to="/profile"
            activeOptions={{ exact: true }}
            className="px-4 py-2 rounded-lg transition-all flex items-center gap-2 border border-transparent"
            activeProps={{
              className: "bg-white text-yellow-700 shadow-sm border-yellow-200",
            }}
            inactiveProps={{
              className: "text-gray-600 hover:bg-white/60 hover:text-gray-900",
            }}
          >
            <User className="w-4 h-4" />
            <span className="font-medium">Mis Datos</span>
          </Link>
          <Link
            to="/profile/connected-apps"
            className="px-4 py-2 rounded-lg transition-all flex items-center gap-2 border border-transparent"
            activeProps={{
              className: "bg-white text-yellow-700 shadow-sm border-yellow-200",
            }}
            inactiveProps={{
              className: "text-gray-600 hover:bg-white/60 hover:text-gray-900",
            }}
          >
            <AppWindow className="w-4 h-4" />
            <span className="font-medium">Aplicaciones Conectadas</span>
          </Link>
          <Link
            to="/profile/settings"
            className="px-4 py-2 rounded-lg transition-all flex items-center gap-2 border border-transparent"
            activeProps={{
              className: "bg-white text-yellow-700 shadow-sm border-yellow-200",
            }}
            inactiveProps={{
              className: "text-gray-600 hover:bg-white/60 hover:text-gray-900",
            }}
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium">Configuración</span>
          </Link>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
