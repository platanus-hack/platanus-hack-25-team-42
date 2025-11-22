import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_with_header/_authed/dev")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-4">
      <div>
        <Link to="/dev" className="text-blue-500">
          Apps
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
