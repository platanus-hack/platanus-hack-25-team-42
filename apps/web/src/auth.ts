import { betterAuth } from "better-auth";
import { oidcProvider } from "better-auth/plugins/oidc-provider";
import { passkey } from "better-auth/plugins/passkey";
import { emailOTP } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  plugins: [
    oidcProvider({
      loginPage: "/login",
      consentPage: "/consent",
      allowDynamicClientRegistration: true,
      getAdditionalUserInfoClaim: (_user, _scopes, _client) => {
        // TODO: complete
        const claims: Record<string, any> = {};
        claims["iss"] = "http://localhost:3000/api/auth";

        claims["info"] = {
          rut: "1234567-8",
        };

        return claims;
      },
      metadata: {
        issuer: "http://localhost:3000/api/auth",
      },
    }),
    passkey(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Log OTP to console in development
        console.log(`[OTP] Email: ${email}, Code: ${otp}, Type: ${type}`);
      },
      sendVerificationOnSignUp: true, // Auto-register new users
    }),
  ],
});
