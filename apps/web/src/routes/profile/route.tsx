import { createFileRoute, Outlet, useRouterState, redirect } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/profile/sidebar";

export const Route = createFileRoute("/profile")({
  component: ProfileLayout,
  beforeLoad: ({ location }) => {
    // Redirect /profile to /profile/datos if no subroute is specified
    if (location.pathname === "/profile" || location.pathname === "/profile/") {
      throw redirect({
        to: "/profile/datos",
        replace: true,
      });
    }
  },
});

function ProfileLayout() {
  const router = useRouterState();
  const pathname = router.location.pathname;

  // Extract active view from pathname
  let activeView = "datos";
  if (pathname.includes("/documentos")) {
    activeView = "documentos";
  } else if (pathname.includes("/permisos")) {
    activeView = "permisos";
  } else if (pathname.includes("/datos") || pathname === "/profile" || pathname === "/profile/") {
    activeView = "datos";
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-6 bg-linear-to-br from-blue-50 via-white to-pink-50">
      <div className="mx-auto max-w-7xl h-full grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="hidden md:block md:col-span-3">
          <div className="sticky top-6">
            <Card className="h-[calc(100vh-3rem)] flex flex-col bg-white/80 backdrop-blur-sm shadow-lg border-gray-100/50">
              <Sidebar activeView={activeView} />
            </Card>
          </div>
        </div>

        <div className="col-span-1 md:col-span-9 h-full flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
