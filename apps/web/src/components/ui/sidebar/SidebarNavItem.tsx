import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  to: string;
  label: string;
  icon?: LucideIcon;
  description?: string;
  isActive?: boolean;
  className?: string;
}

export function SidebarNavItem({
  to,
  label,
  icon: Icon,
  description,
  isActive = false,
  className,
}: SidebarNavItemProps) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
        className
      )}
      activeProps={{
        className: "bg-blue-50/50 text-blue-600 border border-blue-100/50",
      }}
      inactiveProps={{
        className: "text-gray-600 hover:bg-gray-50/50",
      }}
    >
      {Icon && (
        <div
          className={cn(
            "p-2 rounded-lg",
            isActive ? "bg-blue-100/50" : "bg-gray-100/50"
          )}
        >
          <Icon
            size={20}
            className={isActive ? "text-blue-600" : "text-gray-600"}
          />
        </div>
      )}
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
    </Link>
  );
}
