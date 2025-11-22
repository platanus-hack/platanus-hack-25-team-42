import { User, FileText, Shield, LogOut, Sparkles } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"

interface SidebarProps {
  activeView: string
}

export default function Sidebar({ activeView }: SidebarProps) {
  const navItems = [
    { id: "datos", label: "Mis Datos", icon: User, description: "Información general", path: "/profile/datos" },
    { id: "documentos", label: "Documentos", icon: FileText, description: "Archivos validados", path: "/profile/documentos" },
    { id: "permisos", label: "Permisos", icon: Shield, description: "Accesos de terceros", path: "/profile/permisos" },
  ]

  return (
    <div className="h-full flex flex-col justify-between p-6 overflow-y-auto">
      <div className="space-y-8">
        {/* User Profile Header */}
        <div className="flex flex-col items-center text-center border-b border-gray-100/50 pb-6">
          <div className="relative mb-4">
            <Avatar className="w-20 h-20 border-2 border-white shadow-lg">
              <AvatarImage src="https://picsum.photos/id/64/100/100" alt="User" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="absolute -right-2 -bottom-2 bg-gradient-to-tr from-blue-600 to-cyan-400 p-1.5 rounded-full border-2 border-white shadow-md">
              <Sparkles size={14} className="text-white fill-white" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Carla Ñañez</h2>
            <p className="text-xs text-gray-500 mt-1">ID: 98.765.432</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeView === item.id
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                  isActive ? "bg-blue-50/80 text-blue-600 border border-blue-100/50" : "text-gray-600 hover:bg-gray-50/50"
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? "bg-blue-100/60" : "bg-gray-100/50"}`}>
                  <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-600"} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Logout */}
      <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-red-500 hover:bg-red-50">
        <LogOut size={18} />
        <span className="text-sm font-semibold">Cerrar Sesión</span>
      </Button>
    </div>
  )
}
