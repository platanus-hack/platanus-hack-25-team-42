import * as React from 'react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
  children: React.ReactNode
}

export function Sidebar({ className, children }: SidebarProps) {
  return (
    <div className={cn("h-full flex flex-col justify-between p-6 overflow-y-auto", className)}>
      {children}
    </div>
  )
}

