import { eq, and, inArray, desc } from "drizzle-orm";
import { userData } from "../schema";
import { db } from "..";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { userDataTypeList } from "../data_types";

export const getUserData = createServerFn()
  .inputValidator(
    z.object({
      userId: z.string(),
    })
  )
  .handler(async ({ data: { userId } }) => {
    const data = await db
      .select()
      .from(userData)
      .where(eq(userData.userId, userId));
    return data;
  });

export const getUserDataByTypeList = createServerFn()
  .inputValidator(
    z.object({
      userId: z.string(),
      types: z.array(z.string()),
    })
  )
  .handler(async ({ data: { userId, types } }) => {
    const data = (
      await db.select().from(userData).where(eq(userData.userId, userId))
    ).filter((data) => types.includes(data.type));
    return data;
  });

export const getLastValidatedUserDataByTypeList = createServerFn()
  .inputValidator(
    z.object({
      userId: z.string(),
      types: z.array(z.string()),
    })
  )
  .handler(async ({ data: { userId, types } }) => {
    console.log(userData.type);
    return await db
      .selectDistinctOn([userData.type])
      .from(userData)
      .where(
        and(
          eq(userData.userId, userId),
          eq(userData.isValidated, true),
          inArray(userData.type, types)
        )
      );
  });

export const createUserData = createServerFn()
  .inputValidator(
    z.object({
      id: z.string(),
      userId: z.string(),
      type: z.enum(userDataTypeList),
      value: z.string(),
      isValidated: z.boolean().optional(),
      createdAt: z.coerce.date().optional(),
    })
  )
  .handler(async ({ data }) => {
    return await db.insert(userData).values(data);
  });
