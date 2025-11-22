import { db } from "@/db";
import { oauthApplication } from "@/db/schema.auth";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import z from "zod";

const getApp = createServerFn({
  method: "GET",
})
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const session = await context.getSession();
    const userId = session?.user.id;
    if (!userId) throw new Error("User not authenticated");

    const app = await db
      .select()
      .from(oauthApplication)
      .where(
        and(
          eq(oauthApplication.id, data.id),
          eq(oauthApplication.userId, userId)
        )
      )
      .limit(1);

    return app[0];
  });

export const Route = createFileRoute("/_with_header/_authed/dev/app/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const app = await getApp({ data: { id: params.id } });
    return {
      app,
    };
  },
});

function RouteComponent() {
  const { app } = Route.useLoaderData();
  return <div>{app.name}</div>;
}
