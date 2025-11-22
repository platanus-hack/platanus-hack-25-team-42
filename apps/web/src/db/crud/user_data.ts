import { eq } from "drizzle-orm";
import { userData } from "../schema";
import { db } from "..";

type NewUserData = typeof userData.$inferInsert;

export const getUserData = async (userId: string) => {
    const data = await db.select().from(userData).where(eq(userData.userId, userId));
    return data;
};

export const getUserDataByTypeList = async (userId: string, types: string[]) => {
    const data = (await db.select().from(userData).where(eq(userData.userId, userId))).filter((data) => types.includes(data.type));
    return data;
};

export const createUserData = async (data: NewUserData) => {
    return await db.insert(userData).values(data);
};
