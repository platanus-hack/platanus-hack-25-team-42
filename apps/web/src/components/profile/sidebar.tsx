import { User, FileText, Shield, LogOut, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar, SidebarProfile, SidebarNav, SidebarNavItem, SidebarFooter } from "@/components/ui/sidebar"

interface SidebarProps {
  activeView: string
}

export default function ProfileSidebar({ activeView }: SidebarProps) {
  const navItems = [
    { id: "datos", label: "Mis Datos", icon: User, description: "Información general", path: "/profile/datos" },
    { id: "documentos", label: "Documentos", icon: FileText, description: "Archivos validados", path: "/profile/documentos" },
    { id: "permisos", label: "Permisos", icon: Shield, description: "Accesos de terceros", path: "/profile/permisos" },
  ]

  return (
    <Sidebar>
      <div className="space-y-8">
        <SidebarProfile
          name="Carla Ñañez"
          id="98.765.432"
          image="https://picsum.photos/id/64/100/100"
          fallback="CN"
          badge={{
            icon: Sparkles,
          }}
        />

        <SidebarNav>
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.id}
              to={item.path}
              label={item.label}
              icon={item.icon}
              description={item.description}
              isActive={activeView === item.id}
            />
          ))}
        </SidebarNav>
      </div>

      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-red-500 hover:bg-red-50/50">
          <LogOut size={18} />
          <span className="text-sm font-semibold">Cerrar Sesión</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
