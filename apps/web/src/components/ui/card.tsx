import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({ className, noPadding, ...props }: React.ComponentProps<'div'> & { noPadding?: boolean }) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col rounded-xl border border-gray-100/30 shadow-sm',
        !noPadding && 'gap-6 py-6',
        className,
      )}
      {...props}
    />
  )
}

export { Card }
