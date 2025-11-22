import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authflow")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <Outlet />
    </div>
  );
}
