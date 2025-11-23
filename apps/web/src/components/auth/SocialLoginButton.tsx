import { authClient } from "@/integrations/auth/client";

interface SocialLoginButtonProps {
  provider: "google" | "github" | "microsoft" | "facebook" | "apple" | "passkey";
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export function SocialLoginButton({
  provider,
  label,
  icon,
  disabled,
  onClick,
}: SocialLoginButtonProps) {
  const handleLogin = async () => {
    if (disabled) return;
    
    if (onClick) {
      onClick();
      return;
    }
    
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}
