import { eq } from "drizzle-orm";
import { oauthApplication } from "../schema.auth";
import { db } from "..";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getOAuthApplicationByClientId = createServerFn()
  .inputValidator(
    z.object({
      clientId: z.string(),
    })
  )
  .handler(async ({ data: { clientId } }) => {
    const result = await db
      .select({
        id: oauthApplication.id,
        name: oauthApplication.name,
        icon: oauthApplication.icon,
        clientId: oauthApplication.clientId,
      })
      .from(oauthApplication)
      .where(eq(oauthApplication.clientId, clientId))
      .limit(1);
    
    return result[0] || null;
  });
