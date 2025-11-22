import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface SidebarNavItemProps {
  to: string
  label: string
  icon?: LucideIcon
  description?: string
  isActive?: boolean
  className?: string
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
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
        isActive
          ? "bg-blue-50/50 text-blue-600 border border-blue-100/50"
          : "text-gray-600 hover:bg-gray-50/50",
        className
      )}
    >
      {Icon && (
        <div className={cn(
          "p-2 rounded-lg",
          isActive ? "bg-blue-100/50" : "bg-gray-100/50"
        )}>
          <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-600"} />
        </div>
      )}
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {description && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
      </div>
    </Link>
  )
}

