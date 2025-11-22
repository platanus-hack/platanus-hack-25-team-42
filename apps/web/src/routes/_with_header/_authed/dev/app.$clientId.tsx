import { db } from "@/db";
import { oauthApplication, appCredentialsTable } from "@/db/schema";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import z from "zod";

const getApp = createServerFn({
  method: "GET",
})
  .inputValidator(z.object({ clientId: z.string() }))
  .handler(async ({ context, data }) => {
    const session = await context.getSession();
    const userId = session?.user.id;
    if (!userId) throw new Error("User not authenticated");

    // Get app details
    const app = await db
      .select()
      .from(oauthApplication)
      .where(
        and(
          eq(oauthApplication.clientId, data.clientId),
          eq(oauthApplication.userId, userId)
        )
      )
      .limit(1);

    if (!app[0]) throw new Error("App not found");

    // Get credentials for this app
    const credentials = await db
      .select()
      .from(appCredentialsTable)
      .where(eq(appCredentialsTable.appId, data.clientId));

    return {
      app: app[0],
      credentials,
    };
  });

export const Route = createFileRoute("/_with_header/_authed/dev/app/$clientId")(
  {
    component: RouteComponent,
    loader: async ({ params }) => {
      const result = await getApp({ data: { clientId: params.clientId } });
      return result;
    },
  }
);

function RouteComponent() {
  const { app, credentials } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="container mx-auto">
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="bg-slate-900/50 px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-3">
              {app.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide">
                  App ID
                </label>
                <p className="text-sm text-slate-300 font-mono">{app.id}</p>
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide">
                  Client ID
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-300 font-mono truncate">
                    {app.clientId}
                  </p>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(app.clientId ?? "")
                    }
                    className="text-slate-400 hover:text-white transition-colors p-1"
                    title="Copy to clipboard"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide">
                  Client Secret
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-300 font-mono truncate">
                    {app.clientSecret}
                  </p>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(app.clientSecret ?? "")
                    }
                    className="text-slate-400 hover:text-white transition-colors p-1"
                    title="Copy to clipboard"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide">
                  Redirect URLs
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-300 font-mono truncate">
                    {app.redirectURLs}
                  </p>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(app.redirectURLs ?? "")
                    }
                    className="text-slate-400 hover:text-white transition-colors p-1"
                    title="Copy to clipboard"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Credentials
            </h3>
            {credentials.length === 0 ? (
              <div className="bg-slate-900/50 rounded-lg p-8 text-center border border-slate-700">
                <p className="text-slate-400">
                  No credentials found for this app.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {credentials.map((cred) => (
                  <div
                    key={cred.id}
                    className="bg-slate-900/50 rounded-lg p-4 border border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-200 capitalize">
                        {cred.provider}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(cred.createdAt!).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-slate-400 uppercase tracking-wide">
                          Key Name
                        </label>
                        <p className="text-sm text-white font-medium">
                          {cred.keyName}
                        </p>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 uppercase tracking-wide">
                          Value
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-slate-300 bg-slate-950 px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
                            {cred.keyValue}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(cred.keyValue);
                            }}
                            className="text-slate-400 hover:text-white transition-colors p-1"
                            title="Copy to clipboard"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
