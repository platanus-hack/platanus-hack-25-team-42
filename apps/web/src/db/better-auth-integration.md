# Integrating Drizzle ORM with Better Auth

You already have Better Auth set up in your project. Here's how to integrate it with Drizzle ORM to store user sessions and data in your Supabase database.

## Update Better Auth Configuration

You can configure Better Auth to use Drizzle as its database adapter:

```typescript
// src/auth.ts
import { betterAuth } from "better-auth";
import { oidcProvider } from "better-auth/plugins/oidc-provider";
import { passkey } from "better-auth/plugins/passkey";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createDbConnection } from "./db";

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  database: drizzleAdapter(createDbConnection(process.env.DATABASE_URL!), {
    provider: "pg", // PostgreSQL
  }),
  plugins: [
    oidcProvider({
      loginPage: "/login",
      allowDynamicClientRegistration: false,
    }),
    passkey(),
  ],
});
```

## Better Auth Schema

Better Auth will automatically create its required tables. However, if you want to define them explicitly or add custom fields, you can reference Better Auth's schema:

```typescript
// src/db/schema.ts - Add Better Auth tables
import {
  integer,
  pgTable,
  varchar,
  timestamp,
  boolean,
  text,
} from "drizzle-orm/pg-core";

// Better Auth User table (Better Auth creates this automatically)
// You can extend it with custom fields
export const usersTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // Add your custom fields here
  // role: varchar("role", { length: 50 }),
  // organizationId: integer("organization_id"),
});

// Better Auth Session table (auto-created by Better Auth)
export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
});

// Your custom tables can reference Better Auth users
export const postsTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  content: text(),
  authorId: text("author_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

## Usage Example

```typescript
// src/routes/profile.tsx
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createDbConnection } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/auth";

const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      throw new Error("Not authenticated");
    }

    const db = createDbConnection(request.context.env.DATABASE_URL);
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, session.user.id))
      .limit(1);

    return user[0];
  }
);

export const Route = createFileRoute("/profile")({
  loader: () => getCurrentUser(),
});
```

## References

- [Better Auth Docs](https://www.better-auth.com/)
- [Better Auth Database Adapters](https://www.better-auth.com/docs/integrations/database)
- [Better Auth with Drizzle](https://www.better-auth.com/docs/integrations/drizzle)
