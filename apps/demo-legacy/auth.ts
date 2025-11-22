import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "my-provider", // signIn("my-provider") and will be part of the callback URL
      name: "My Provider", // optional, used on the default login page as the button text.
      type: "oidc", // or "oauth" for OAuth 2 providers
      issuer: "http://localhost:3000", // to infer the .well-known/openid-configuration URL
      clientId: "pzRiTEoLwNiUZKwErRehekKJdHSUySlC", // from the provider's dashboard
      clientSecret: "YJAbvqkDLRGFaOGssVEVJNvEbKHkDlEb", // from the provider's dashboard
    },
  ],
});
