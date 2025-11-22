import { betterAuth } from "better-auth";
import { oidcProvider } from "better-auth/plugins/oidc-provider";
import { passkey } from "better-auth/plugins/passkey";
import { emailOTP } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
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
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[OTP] Email: ${email}, Code: ${otp}, Type: ${type}`);
      },
    }),
  ],
});
