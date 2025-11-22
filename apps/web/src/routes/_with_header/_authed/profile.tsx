import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
import ProfileSidebar from "@/components/profile/sidebar";

export const Route = createFileRoute("/_with_header/_authed/profile")({
  component: ProfileLayout,
});

function ProfileLayout() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <SidebarLayout sidebar={<ProfileSidebar />}>
        <Outlet />
      </SidebarLayout>
    </div>
  );
}
