import * as React from 'react'
import { cn } from '@/lib/utils'

interface SidebarFooterProps {
  className?: string
  children: React.ReactNode
}

export function SidebarFooter({ className, children }: SidebarFooterProps) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

