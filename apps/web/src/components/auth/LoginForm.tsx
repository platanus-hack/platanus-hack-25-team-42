import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authClient } from "@/integrations/auth/client";
import { SocialLoginButton } from "./SocialLoginButton";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { getOAuthApplicationByClientId } from "@/db/crud/oauth_application";

export function LoginForm() {
  const data = useSearch({ from: "/_authflow/login" });
  const navigate = useNavigate();
  
  // Get client_id from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const clientId = searchParams.get('client_id');
  
  // Fetch OAuth application info
  const { data: oauthApp } = useQuery({
    queryKey: ['oauth-app', clientId],
    queryFn: () => clientId ? getOAuthApplicationByClientId({ data: { clientId } }) : null,
    enabled: !!clientId,
  });

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
  });

  const loginWithOtpMutation = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const result = await authClient.signIn.emailOtp({ email, otp });
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      navigate({ to: data.redirect || '/' });
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

  const handlePasskeyLogin = async () => {
    const result = await authClient.signIn.passkey();
    if (result.data && !result.error) {
      navigate({ to: data.redirect || '/' });
    }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-md w-full space-y-8">
        {/* OAuth Application Info */}
        {oauthApp && (
          <div className="flex flex-col items-center space-y-3 border border-gray-200/50 p-4 rounded-lg bg-white">
            {oauthApp.icon && (
              <img 
                src={oauthApp.icon} 
                alt={oauthApp.name || 'Application'} 
                className="w-16 h-16 rounded-lg shadow-md object-cover"
              />
            )}
            <div className="text-center">
              <p className="text-sm text-gray-600">Sign in to</p>
              <h3 className="text-xl font-bold text-gray-900">{oauthApp.name}</h3>
            </div>
          </div>
        )}
        

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error instanceof Error ? error.message : "An error occurred"}
          </div>
        )}

        {step === "email" ? (
          <>
            {/* Social Login Options */}
            <div className="mt-8 space-y-3">
              <SocialLoginButton
                provider="google"
                label="Continue with Google"
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                }
              />

              <SocialLoginButton
                provider="passkey"
                label="Sign in with Passkey"
                onClick={handlePasskeyLogin}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                }
              />
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>

            <form className="mt-6 space-y-6" onSubmit={handleSendOTP}>
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
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white"
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
          </>
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
