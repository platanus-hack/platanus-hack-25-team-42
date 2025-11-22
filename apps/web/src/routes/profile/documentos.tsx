import { createFileRoute } from "@tanstack/react-router";
import { FileText, Check } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Document {
  id: string
  name: string
  category: string
  lastUpdated: string
  status: "verified"
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "1",
    name: "Cédula de Identidad",
    category: "Identificación",
    lastUpdated: "2024-01-15",
    status: "verified",
  },
  {
    id: "2",
    name: "Certificado de Estudios",
    category: "Educación",
    lastUpdated: "2024-01-10",
    status: "verified",
  },
  {
    id: "3",
    name: "Contrato de Trabajo",
    category: "Laboral",
    lastUpdated: "2024-01-05",
    status: "verified",
  },
  {
    id: "4",
    name: "Comprobante de Domicilio",
    category: "Residencia",
    lastUpdated: "2024-01-01",
    status: "verified",
  },
]

export const Route = createFileRoute("/profile/documentos")({
  component: FileManager,
});

function FileManager() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Documentos</h1>
        <div className="px-3 py-1 bg-white/60 rounded-full text-xs font-medium text-gray-500 border border-gray-100/50">
          {MOCK_DOCUMENTS.length} Verificados
        </div>
      </div>

      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MOCK_DOCUMENTS.map((doc) => (
            <Card key={doc.id} className="group relative hover:shadow-md transition-all cursor-pointer bg-white/60 backdrop-blur-sm">
              <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100/60 border border-gray-100/50 flex items-center justify-center text-gray-500 group-hover:text-blue-600">
                    <FileText size={20} />
                  </div>
                  <div className="text-green-500 bg-green-50 rounded-full p-1">
                    <Check size={12} strokeWidth={4} />
                  </div>
                </div>

                <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">{doc.name}</h3>
                <p className="text-xs text-gray-400 mb-auto">{doc.category}</p>

                <div className="mt-auto pt-3 border-t border-gray-100/50 text-xs text-gray-400 font-medium">
                  Actualizado: {new Date(doc.lastUpdated).toLocaleDateString("es-ES")}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
