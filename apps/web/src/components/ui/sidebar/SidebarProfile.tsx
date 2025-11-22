import * as React from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '../avatar'
import type { LucideIcon } from 'lucide-react'

interface SidebarProfileProps {
  name: string
  id?: string
  image?: string
  fallback?: string
  badge?: {
    icon: LucideIcon | React.ElementType
    className?: string
  }
  className?: string
}

export function SidebarProfile({
  name,
  id,
  image,
  fallback,
  badge,
  className,
}: SidebarProfileProps) {
  const BadgeIcon = badge?.icon

  return (
    <div className={cn("flex flex-col items-center text-center border-b border-gray-200/50 pb-6", className)}>
      <div className="relative mb-4">
        <Avatar className="w-20 h-20 border-2 border-white/50 shadow-lg">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{fallback || name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        {BadgeIcon && (
          <div className={cn(
            "absolute -right-2 -bottom-2 bg-gradient-to-tr from-blue-600 to-cyan-400 p-1.5 rounded-full border-2 border-white/50 shadow-md",
            badge.className
          )}>
            <BadgeIcon size={14} className="text-white fill-white" />
          </div>
        )}
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{name}</h2>
        {id && (
          <p className="text-xs text-gray-500 mt-1">ID: {id}</p>
        )}
      </div>
    </div>
  )
}

