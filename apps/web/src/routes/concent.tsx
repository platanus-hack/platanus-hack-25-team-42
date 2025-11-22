import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/integrations/auth/client";
import { useState } from "react";

export const Route = createFileRoute("/concent")({
  component: ConsentPage,
});

function ConsentPage() {
  const [error, setError] = useState<string | null>(null);

  const consentMutation = useMutation({
    mutationFn: async (accept: boolean) => {
      const res = await authClient.oauth2.consent({
        accept,
      });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "An error occurred");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in with MyApp
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            MyApp wants to access your account
          </p>
        </div>

        <div className="py-4">
          <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-md">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              U
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">user@example.com</p>
              <p className="text-gray-500">Personal Account</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-gray-500 text-center">
            By clicking Allow, you allow this app and Google to use your
            information in accordance with their respective terms of service and
            privacy policies.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
          <button
            onClick={() => consentMutation.mutate(false)}
            disabled={consentMutation.isPending}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Deny
          </button>
          <button
            onClick={() => consentMutation.mutate(true)}
            disabled={consentMutation.isPending}
            className="w-full sm:w-auto px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {consentMutation.isPending ? "Processing..." : "Allow"}
          </button>
        </div>
      </div>
    </div>
  );
}
