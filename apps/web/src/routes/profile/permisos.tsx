import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react"
import { Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import CompanyList from "@/components/profile/company-list"
import PermissionDetails from "@/components/profile/permission-details"

interface Company {
  id: string
  name: string
  logo: string
  description: string
  accessLevel: "Total" | "Parcial" | "Limitado"
  permissions: { category: string; items: { key: string; label: string; allowed: boolean }[] }[]
}

const MOCK_COMPANIES: Company[] = [
  {
    id: "1",
    name: "TechCorp",
    logo: "https://picsum.photos/id/10/100/100",
    description: "Acceso a datos personales y laborales para procesamiento de nómina",
    accessLevel: "Total",
    permissions: [
      {
        category: "Datos Personales",
        items: [
          { key: "name", label: "Nombre Completo", allowed: true },
          { key: "email", label: "Email", allowed: true },
          { key: "phone", label: "Teléfono", allowed: false },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "FinanceApp",
    logo: "https://picsum.photos/id/20/100/100",
    description: "Acceso limitado a datos financieros",
    accessLevel: "Parcial",
    permissions: [
      {
        category: "Datos Financieros",
        items: [
          { key: "bank", label: "Banco", allowed: true },
          { key: "account", label: "Número de Cuenta", allowed: false },
        ],
      },
    ],
  },
]

export const Route = createFileRoute("/profile/permisos")({
  component: PermissionsView,
});

function PermissionsView() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(MOCK_COMPANIES[0].id)
  const [searchTerm, setSearchTerm] = useState("")

  const selectedCompany = MOCK_COMPANIES.find((c) => c.id === selectedCompanyId) || MOCK_COMPANIES[0]
  const filteredCompanies = MOCK_COMPANIES.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Accesos de Empresas</h1>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <Card className="w-full max-w-xs flex flex-col bg-white/60 backdrop-blur-sm h-fit" noPadding>
          <div className="p-3 border-b border-gray-100/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <Input
                placeholder="Buscar empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="p-2">
            <CompanyList companies={filteredCompanies} selectedId={selectedCompanyId} onSelect={setSelectedCompanyId} />
          </div>
        </Card>

        <Card className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm min-h-[500px]" noPadding>
          <PermissionDetails company={selectedCompany} />
        </Card>
      </div>
    </div>
  )
}
