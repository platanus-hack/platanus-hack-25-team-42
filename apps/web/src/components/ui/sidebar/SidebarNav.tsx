import * as React from 'react'
import { cn } from '@/lib/utils'

interface SidebarNavProps {
  className?: string
  children: React.ReactNode
}

export function SidebarNav({ className, children }: SidebarNavProps) {
  return (
    <nav className={cn("space-y-2", className)}>
      {children}
    </nav>
  )
}

