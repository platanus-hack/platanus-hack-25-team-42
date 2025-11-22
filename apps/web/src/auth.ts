import { betterAuth } from "better-auth";
import { oidcProvider } from "better-auth/plugins/oidc-provider";
import { passkey } from "better-auth/plugins/passkey";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  plugins: [
    oidcProvider({
      loginPage: "/login",
      allowDynamicClientRegistration: true,
    }),
    passkey(),
  ],
});
