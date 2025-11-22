import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/integrations/auth/client";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      return await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
    },
  });

  const loginWithOtpMutation = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      return await authClient.signIn.emailOtp({ email, otp });
    },
  });

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    sendOtpMutation.mutate(email);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    loginWithOtpMutation.mutate({ email, otp });
  };

  const goBack = () => {
    setOtp("");
    sendOtpMutation.reset();
    loginWithOtpMutation.reset();
  };

  // Derive step from mutation state
  const step = sendOtpMutation.isSuccess ? "otp" : "email";
  const error =
    step === "email" ? sendOtpMutation.error : loginWithOtpMutation.error;
  const isLoading =
    step === "email"
      ? sendOtpMutation.isPending
      : loginWithOtpMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === "email" ? "Sign in with OTP" : "Enter verification code"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === "email"
              ? "Enter your email to receive a one-time password"
              : "Check your console for the OTP code"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error instanceof Error ? error.message : "An error occurred"}
          </div>
        )}

        {step === "email" ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                disabled={isLoading}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit code"
                maxLength={6}
                disabled={isLoading}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={goBack}
                disabled={isLoading}
                className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify & Login"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
