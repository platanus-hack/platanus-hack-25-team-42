import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card } from './card'

interface SidebarLayoutProps {
  sidebar: React.ReactNode
  children: React.ReactNode
  sidebarClassName?: string
  contentClassName?: string
  className?: string
}

export function SidebarLayout({
  sidebar,
  children,
  sidebarClassName,
  contentClassName,
  className,
}: SidebarLayoutProps) {
  return (
    <div className={cn("flex h-full min-h-screen", className)}>
      <aside className={cn("hidden md:flex w-80 shrink-0 p-6", sidebarClassName)}>
        <div className="w-full sticky top-6 h-[calc(100vh-3rem)]">
          <Card className="h-full flex flex-col bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100/30">
            {sidebar}
          </Card>
        </div>
      </aside>

      <main className={cn("flex-1 min-w-0 overflow-hidden p-4 md:p-6", contentClassName)}>
        {children}
      </main>
    </div>
  )
}

