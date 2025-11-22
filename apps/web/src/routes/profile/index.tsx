import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import DataRow from "@/components/profile/data-row"
import SectionGroup from "@/components/profile/section-group"
import { User, Mail, Briefcase, CreditCard } from "lucide-react"

interface UserProfile {
  personal: { firstName: string; lastName: string; rut: string; nationality: string }
  contact: { email: string; phone: string; address: string }
  professional: { occupation: string; currentEmployer: string }
  financial: { bank: string; accountType: string; afp: string; healthSystem: string }
}

const MOCK_PROFILE: UserProfile = {
  personal: {
    firstName: "Carla",
    lastName: "Ñañez",
    rut: "98.765.432-K",
    nationality: "Chilena",
  },
  contact: {
    email: "carla@example.com",
    phone: "+56 9 1234 5678",
    address: "Santiago, Chile",
  },
  professional: {
    occupation: "Ingeniera de Software",
    currentEmployer: "Tech Company",
  },
  financial: {
    bank: "Banco Estado",
    accountType: "Cuenta Corriente",
    afp: "Habitat",
    healthSystem: "Isapre Azul",
  },
}

export const Route = createFileRoute("/profile/")({
  component: ProfileView,
});

function ProfileView() {
  const [profile, setProfile] = useState<UserProfile>(MOCK_PROFILE)

  const updateField = (category: keyof UserProfile, field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }))
  }

  return (
    <div className="mx-auto max-w-7xl w-full min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Datos</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona y actualiza tu información verificada</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Dato
        </Button>
      </div>

      <div className="flex-1 pr-2">
        <SectionGroup title="Información Personal" icon={User}>
          <DataRow
            label="Nombres"
            value={profile.personal.firstName}
            verified
            onSave={(v) => updateField("personal", "firstName", v)}
          />
          <DataRow
            label="Apellidos"
            value={profile.personal.lastName}
            verified
            onSave={(v) => updateField("personal", "lastName", v)}
          />
          <DataRow
            label="RUT / DNI"
            value={profile.personal.rut}
            verified
            onSave={(v) => updateField("personal", "rut", v)}
          />
          <DataRow
            label="Nacionalidad"
            value={profile.personal.nationality}
            verified
            onSave={(v) => updateField("personal", "nationality", v)}
          />
        </SectionGroup>

        <SectionGroup title="Datos de Contacto" icon={Mail}>
          <DataRow
            label="Email"
            value={profile.contact.email}
            verified
            onSave={(v) => updateField("contact", "email", v)}
          />
          <DataRow label="Teléfono" value={profile.contact.phone} onSave={(v) => updateField("contact", "phone", v)} />
          <DataRow
            label="Dirección"
            value={profile.contact.address}
            onSave={(v) => updateField("contact", "address", v)}
          />
        </SectionGroup>

        <SectionGroup title="Información Profesional" icon={Briefcase}>
          <DataRow
            label="Profesión"
            value={profile.professional.occupation}
            onSave={(v) => updateField("professional", "occupation", v)}
          />
          <DataRow
            label="Empleador Actual"
            value={profile.professional.currentEmployer}
            onSave={(v) => updateField("professional", "currentEmployer", v)}
          />
        </SectionGroup>

        <SectionGroup title="Datos Financieros" icon={CreditCard}>
          <DataRow label="Banco" value={profile.financial.bank} onSave={(v) => updateField("financial", "bank", v)} />
          <DataRow
            label="Tipo de Cuenta"
            value={profile.financial.accountType}
            onSave={(v) => updateField("financial", "accountType", v)}
          />
          <DataRow
            label="AFP"
            value={profile.financial.afp}
            verified
            onSave={(v) => updateField("financial", "afp", v)}
          />
          <DataRow
            label="Salud"
            value={profile.financial.healthSystem}
            verified
            onSave={(v) => updateField("financial", "healthSystem", v)}
          />
        </SectionGroup>
      </div>
    </div>
  )
}
