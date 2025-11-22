import { integer, pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { oauthApplication } from "./schema.auth";

export const postsTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  content: varchar({ length: 5000 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const appCredentialsTable = pgTable("app_credentials", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  appId: text("app_id")
    .notNull()
    .references(() => oauthApplication.id, { onDelete: "cascade" }),
  provider: varchar({ length: 50 }).notNull(),
  keyName: varchar({ length: 255 }).notNull(),
  keyValue: text("key_value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export * from "./schema.auth";
