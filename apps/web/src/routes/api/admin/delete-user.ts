import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { db } from "@/db";
import { user } from "@/db/schema.auth";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/admin/delete-user")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json();
          const { userId } = body as { userId: string };

          if (!userId) {
            return json({ error: "userId is required" }, { status: 400 });
          }

          await db.delete(user).where(eq(user.id, userId));

          return json({ success: true });
        } catch (error) {
          console.error("Error deleting user:", error);
          return json({ error: "Internal Server Error" }, { status: 500 });
        }
      },
    },
  },
});
