import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";

export function createDbConnection(databaseUrl: string) {
  const pool = new Pool({ connectionString: databaseUrl });
  return drizzle({ client: pool, schema });
}

export type DbClient = ReturnType<typeof createDbConnection>;

export const db = createDbConnection(process.env.DATABASE_URL!);
