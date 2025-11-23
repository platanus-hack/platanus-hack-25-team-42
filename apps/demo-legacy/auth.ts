import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "my-provider", // signIn("my-provider") and will be part of the callback URL
      name: "My Provider", // optional, used on the default login page as the button text.
      type: "oidc", // or "oauth" for OAuth 2 providers
      issuer: process.env.BETTER_AUTH_URL! + "/api/auth",
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    },
  ],
  callbacks: {
    async jwt({ token, profile }) {
      const enrichedToken = token as typeof token & {
        info?: Record<string, unknown>;
      };

      if (profile && typeof profile === "object" && "info" in profile) {
        enrichedToken.info = (profile as Record<string, unknown>).info as
          | Record<string, unknown>
          | undefined;
      }

      return enrichedToken;
    },
    async session({ session, token }) {
      const enrichedToken = token as typeof token & {
        info?: Record<string, unknown>;
      };

      return {
        ...session,
        info: enrichedToken.info,
      };
    },
  },
});

declare module "next-auth" {
  interface Session {
    info?: Record<string, unknown>;
  }
}
