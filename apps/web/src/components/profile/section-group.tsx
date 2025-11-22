import type React from "react"
import { Card } from "@/components/ui/card"

interface SectionGroupProps {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}

export default function SectionGroup({ title, icon: Icon, children }: SectionGroupProps) {
  return (
    <div className="mb-6">
      <h3 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
        <Icon size={14} />
        {title}
      </h3>
      <Card className="bg-white/60 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">{children}</Card>
    </div>
  )
}
