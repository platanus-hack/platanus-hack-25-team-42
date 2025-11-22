import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";
import { oidcClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [oidcClient(), passkeyClient()],
});
