import { ShieldCheck, Database } from "lucide-react"

interface PermissionDetailsProps {
  company: {
    name: string
    logo: string
    description: string
    accessLevel: "Total" | "Parcial" | "Limitado"
    permissions: { category: string; items: { key: string; label: string; allowed: boolean }[] }[]
  }
}

export default function PermissionDetails({ company }: PermissionDetailsProps) {
  const getAccessLevelStyles = (level: string) => {
    switch (level) {
      case "Total":
        return "bg-green-50 text-green-700 border-green-100"
      case "Parcial":
        return "bg-amber-50 text-amber-700 border-amber-100"
      default:
        return "bg-red-50 text-red-700 border-red-100"
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100/50 bg-white/40">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-1 bg-white/80 rounded-lg shadow-sm border border-gray-100/50">
              <img
                src={company.logo || "/placeholder.svg"}
                alt={company.name}
                className="w-12 h-12 rounded-md object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{company.name}</h2>
              <p className="text-xs text-gray-500 max-w-md">{company.description}</p>
            </div>
          </div>
          <div
            className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getAccessLevelStyles(
              company.accessLevel,
            )}`}
          >
            Acceso {company.accessLevel}
          </div>
        </div>
      </div>

      {/* Permissions List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {company.permissions.map((group, idx) => {
          const allowedItems = group.items.filter((i) => i.allowed)

          if (allowedItems.length === 0) return null

          return (
            <div key={idx}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pl-1 flex items-center gap-2">
                <Database size={12} />
                {group.category}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {allowedItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-gray-100/30 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-700"></div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                    <ShieldCheck size={14} className="text-green-500 opacity-50" />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
