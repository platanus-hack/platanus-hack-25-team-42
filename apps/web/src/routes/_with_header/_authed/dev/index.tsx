import { db } from "@/db";
import { oauthApplication } from "@/db/schema.auth";
import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

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
    <>
      <div className="flex justify-between gap-2">
        <h2 className="text-2xl font-bold">Apps</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => {
            navigate({ to: "./apps/new" });
          }}
        >
          Create new app
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app) => (
          <div key={app.clientId} className="bg-white p-4 rounded-md">
            <Link to="/dev/app/$id" params={{ id: app.id }}>
              {app.name}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
