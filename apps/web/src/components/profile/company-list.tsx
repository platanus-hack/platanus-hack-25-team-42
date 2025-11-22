import { ChevronRight } from "lucide-react"

interface Company {
  id: string
  name: string
  logo: string
}

interface CompanyListProps {
  companies: Company[]
  selectedId: string
  onSelect: (id: string) => void
}

export default function CompanyList({ companies, selectedId, onSelect }: CompanyListProps) {
  return (
    <div className="space-y-1">
      {companies.map((company) => (
        <button
          key={company.id}
          onClick={() => onSelect(company.id)}
          className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left group ${
            selectedId === company.id ? "bg-white/90 shadow-sm ring-1 ring-gray-100/30" : "hover:bg-white/50"
          }`}
        >
          <img
            src={company.logo || "/placeholder.svg"}
            alt={company.name}
            className="w-10 h-10 rounded-md object-cover border border-gray-100/50"
          />
          <div className="flex-1 min-w-0">
            <h4
              className={`font-semibold text-xs truncate ${
                selectedId === company.id ? "text-gray-900" : "text-gray-600"
              }`}
            >
              {company.name}
            </h4>
            <p className="text-xs text-gray-400 truncate">Ver detalles</p>
          </div>
          {selectedId === company.id && <ChevronRight size={14} className="text-blue-600" />}
        </button>
      ))}
    </div>
  )
}
