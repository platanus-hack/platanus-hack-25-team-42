import { db } from "@/db";
import { postsTable } from "@/db/schema";
import { authClient } from "@/integrations/auth/client";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";

const getPosts = createServerFn({
  method: "GET",
}).handler(async () => {
  // load posts from database
  const posts = await db.select().from(postsTable);
  return posts;
});

const createPost = createServerFn({
  method: "POST",
}).handler(async () => {
  // create post in database
  await db.insert(postsTable).values({
    title: "New Post",
    content: "New Post Content",
  });
});

export const Route = createFileRoute("/_with_header/")({
  component: App,

  loader: async () => {
    const posts = await getPosts();
    return {
      posts,
    };
  },
});

function App() {
  const { posts } = Route.useLoaderData();
  const router = useRouter();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      router.invalidate();
    },
  });

  const [formData, setFormData] = useState({
    client_name: "",
    client_uri: "",
    logo_uri: "",
    redirect_uris: "",
    scope: "profile email",
  });

  const registerNewApp = useMutation({
    mutationFn: async (data: typeof formData) => {
      const redirect_uris_array = data.redirect_uris
        .split(",")
        .map((uri) => uri.trim())
        .filter(Boolean);

      const { data: responseData, error } = await authClient.oauth2.register({
        client_name: data.client_name,
        client_uri: data.client_uri,
        logo_uri: data.logo_uri || undefined,
        redirect_uris: redirect_uris_array,
        scope: data.scope,
      });

      if (error) {
        throw new Error(error.message);
      }
      return responseData;
    },
    onSuccess: () => {
      // Reset form on success
      setFormData({
        client_name: "",
        client_uri: "",
        logo_uri: "",
        redirect_uris: "",
        scope: "profile email",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerNewApp.mutate(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* OAuth2 Client Registration Form */}
        <div className="max-w-2xl mt-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Register OAuth2 Client
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="client_name"
                className="block text-white mb-2 font-medium"
              >
                Client Name *
              </label>
              <input
                type="text"
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 focus:outline-none"
                placeholder="My Application"
              />
            </div>

            <div>
              <label
                htmlFor="client_uri"
                className="block text-white mb-2 font-medium"
              >
                Client URI *
              </label>
              <input
                type="url"
                id="client_uri"
                name="client_uri"
                value={formData.client_uri}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 focus:outline-none"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label
                htmlFor="logo_uri"
                className="block text-white mb-2 font-medium"
              >
                Logo URI
              </label>
              <input
                type="url"
                id="logo_uri"
                name="logo_uri"
                value={formData.logo_uri}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 focus:outline-none"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label
                htmlFor="redirect_uris"
                className="block text-white mb-2 font-medium"
              >
                Redirect URIs * (comma-separated)
              </label>
              <textarea
                id="redirect_uris"
                name="redirect_uris"
                value={formData.redirect_uris}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 focus:outline-none"
                placeholder="https://example.com/callback, https://example.com/auth"
              />
              <p className="text-slate-400 text-sm mt-1">
                Enter multiple URIs separated by commas
              </p>
            </div>

            <div>
              <label
                htmlFor="scope"
                className="block text-white mb-2 font-medium"
              >
                Scope *
              </label>
              <input
                type="text"
                id="scope"
                name="scope"
                value={formData.scope}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded bg-slate-800 text-white border border-slate-700 focus:border-blue-500 focus:outline-none"
                placeholder="profile email"
              />
            </div>

            <button
              type="submit"
              disabled={registerNewApp.isPending}
              className="w-full bg-blue-500 text-white px-4 py-3 rounded font-medium hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerNewApp.isPending ? "Registering..." : "Register Client"}
            </button>
          </form>

          {/* Status Messages */}
          {registerNewApp.isSuccess && (
            <div className="mt-4 p-4 bg-green-900/50 border border-green-700 rounded">
              <h3 className="text-green-400 font-bold mb-2">
                Client Registered Successfully!
              </h3>
              <div className="space-y-2 text-white">
                <p>
                  <span className="font-semibold">Client ID:</span>{" "}
                  <code className="bg-slate-800 px-2 py-1 rounded">
                    {registerNewApp.data.client_id}
                  </code>
                </p>
                <p>
                  <span className="font-semibold">Client Secret:</span>{" "}
                  <code className="bg-slate-800 px-2 py-1 rounded">
                    {registerNewApp.data.client_secret}
                  </code>
                </p>
                <p className="text-yellow-400 text-sm mt-2">
                  ⚠️ Save your client secret securely. It won't be shown again.
                </p>
              </div>
            </div>
          )}

          {registerNewApp.isError && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded">
              <h3 className="text-red-400 font-bold mb-2">
                Registration Failed
              </h3>
              <p className="text-white">{registerNewApp.error.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
