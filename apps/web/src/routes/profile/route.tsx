import { createFileRoute, Outlet, useRouterState, redirect } from "@tanstack/react-router";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
import ProfileSidebar from "@/components/profile/sidebar";

export const Route = createFileRoute("/profile")({
  component: ProfileLayout,
  beforeLoad: ({ location }) => {
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

  let activeView = "datos";
  if (pathname.includes("/documentos")) {
    activeView = "documentos";
  } else if (pathname.includes("/permisos")) {
    activeView = "permisos";
  } else if (pathname.includes("/datos") || pathname === "/profile" || pathname === "/profile/") {
    activeView = "datos";
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <SidebarLayout sidebar={<ProfileSidebar activeView={activeView} />}>
        <Outlet />
      </SidebarLayout>
    </div>
  );
}
