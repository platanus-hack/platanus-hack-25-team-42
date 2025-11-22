// src/server.ts
import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { auth } from "./auth";

type RequestContext = {
  getSession: () => ReturnType<typeof auth.api.getSession>;
};

declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: RequestContext;
    };
  }
}

export default createServerEntry({
  fetch(request) {
    let sessionPromise: ReturnType<typeof auth.api.getSession> | null = null;
    return handler.fetch(request, {
      context: {
        getSession: () => {
          if (sessionPromise !== null) return sessionPromise;
          sessionPromise = auth.api.getSession({ headers: request.headers });
          return sessionPromise;
        },
      },
    });
  },
});
