import { User, LogOut, Sparkles, AppWindow } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarProfile,
  SidebarNav,
  SidebarNavItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

export default function ProfileSidebar() {
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
          <SidebarNavItem
            to="/profile/"
            label="Mis Datos"
            icon={User}
            description="Información general"
          />
          <SidebarNavItem
            to="/profile/connected-apps"
            label="Aplicaciones Conectadas"
            icon={AppWindow}
            description="Aplicaciones que has conectado"
          />
        </SidebarNav>
      </div>

      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-500 hover:text-red-500 hover:bg-red-50/50"
        >
          <LogOut size={18} />
          <span className="text-sm font-semibold">Cerrar Sesión</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
