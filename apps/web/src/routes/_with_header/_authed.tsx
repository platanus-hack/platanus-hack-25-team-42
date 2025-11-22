import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_with_header/_authed")({
  beforeLoad: async ({ context, location }) => {
    const { session } = context;
    if (!session)
      throw redirect({ to: "/login", search: { redirect: location.pathname } });
    return {
      session,
    };
  },
});
