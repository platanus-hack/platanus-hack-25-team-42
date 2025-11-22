import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import postgres from "postgres";

export function createDbConnection(databaseUrl: string) {
  const client = postgres(databaseUrl);
  return drizzle({ client, schema });
}

export type DbClient = ReturnType<typeof createDbConnection>;

export const db = createDbConnection(process.env.DATABASE_URL!);
