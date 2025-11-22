import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/.well-known/openid-configuration")({
  server: {
    handlers: {
      GET: async () => {
        const baseURL = "http://localhost:3000/api/auth";

        const config = {
          issuer: baseURL,
          authorization_endpoint: `${baseURL}/authorize`,
          token_endpoint: `${baseURL}/token`,
          userinfo_endpoint: `${baseURL}/userinfo`,
          jwks_uri: `${baseURL}/jwks`,
          end_session_endpoint: `${baseURL}/logout`,
          registration_endpoint: `${baseURL}/register`,
          scopes_supported: ["openid", "profile", "email"],
          response_types_supported: [
            "code",
            "id_token",
            "token id_token",
            "code id_token",
            "code token",
            "code token id_token",
          ],
          response_modes_supported: ["query", "fragment", "form_post"],
          grant_types_supported: [
            "authorization_code",
            "implicit",
            "refresh_token",
          ],
          subject_types_supported: ["public"],
          id_token_signing_alg_values_supported: ["RS256"],
          token_endpoint_auth_methods_supported: [
            "client_secret_post",
            "client_secret_basic",
          ],
          claims_supported: [
            "sub",
            "iss",
            "aud",
            "exp",
            "iat",
            "email",
            "email_verified",
            "name",
            "picture",
          ],
          code_challenge_methods_supported: ["S256"],
        };

        return new Response(JSON.stringify(config, null, 2), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
    },
  },
});
