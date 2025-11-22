import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { appCredentialsTable, oauthApplication } from "@/db/schema";
import { authClient } from "@/integrations/auth/client";
import { eq } from "drizzle-orm";

// Server function to get all credentials with their app info
const getCredentials = createServerFn({
  method: "GET",
}).handler(async () => {
  const credentials = await db
    .select({
      id: appCredentialsTable.id,
      appId: appCredentialsTable.appId,
      provider: appCredentialsTable.provider,
      keyName: appCredentialsTable.keyName,
      keyValue: appCredentialsTable.keyValue,
      createdAt: appCredentialsTable.createdAt,
      appName: oauthApplication.name,
      appClientId: oauthApplication.clientId,
      appClientSecret: oauthApplication.clientSecret,
      appRedirectUrls: oauthApplication.redirectURLs,
    })
    .from(appCredentialsTable)
    .leftJoin(oauthApplication, eq(appCredentialsTable.appId, oauthApplication.id));

  return credentials;
});

export const Route = createFileRoute("/_with_header/staff/credentials")({
  component: AdminCredentialsPage,
  loader: async () => {
    const credentials = await getCredentials();
    return { credentials };
  },
});

function AdminCredentialsPage() {
  const { credentials } = Route.useLoaderData();
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  if (isSessionPending) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">You must be logged in to view this page.</p>
          <a href="/login" className="text-blue-400 hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  // Group credentials by app
  const credentialsByApp = credentials.reduce((acc, cred) => {
    const appKey = cred.appId || "unknown";
    if (!acc[appKey]) {
      acc[appKey] = {
        appId: appKey,
        appName: cred.appName || "Unknown App",
        appClientId: cred.appClientId || "N/A",
        appClientSecret: cred.appClientSecret || "N/A",
        appRedirectUrls: cred.appRedirectUrls || "N/A",
        credentials: [],
      };
    }
    acc[appKey].credentials.push(cred);
    return acc;
  }, {} as Record<string, { 
    appId: string;
    appName: string; 
    appClientId: string; 
    appClientSecret: string;
    appRedirectUrls: string;
    credentials: typeof credentials 
  }>);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Application Credentials</h1>
          <div className="text-sm text-slate-400">
            Total Apps: {Object.keys(credentialsByApp).length}
          </div>
        </div>

        {Object.keys(credentialsByApp).length === 0 ? (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
            <p className="text-slate-400">No credentials found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(credentialsByApp).map(([appId, appData]) => (
              <div key={appId} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="bg-slate-900/50 px-6 py-4 border-b border-slate-700">
                  <h2 className="text-xl font-semibold text-white mb-3">{appData.appName}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wide">App ID</label>
                      <p className="text-sm text-slate-300 font-mono">{appData.appId}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wide">Client ID</label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-300 font-mono truncate">{appData.appClientId}</p>
                        {appData.appClientId !== "N/A" && (
                          <button
                            onClick={() => navigator.clipboard.writeText(appData.appClientId)}
                            className="text-slate-400 hover:text-white transition-colors p-1"
                            title="Copy to clipboard"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wide">Client Secret</label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-300 font-mono truncate">{appData.appClientSecret}</p>
                        {appData.appClientSecret !== "N/A" && (
                          <button
                            onClick={() => navigator.clipboard.writeText(appData.appClientSecret)}
                            className="text-slate-400 hover:text-white transition-colors p-1"
                            title="Copy to clipboard"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wide">Redirect URLs</label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-300 font-mono truncate">{appData.appRedirectUrls}</p>
                        {appData.appRedirectUrls !== "N/A" && (
                          <button
                            onClick={() => navigator.clipboard.writeText(appData.appRedirectUrls)}
                            className="text-slate-400 hover:text-white transition-colors p-1"
                            title="Copy to clipboard"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Credentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {appData.credentials.map((cred) => (
                      <div key={cred.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
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
                            <label className="text-xs text-slate-400 uppercase tracking-wide">Key Name</label>
                            <p className="text-sm text-white font-medium">{cred.keyName}</p>
                          </div>
                          
                          <div>
                            <label className="text-xs text-slate-400 uppercase tracking-wide">Value</label>
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
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
