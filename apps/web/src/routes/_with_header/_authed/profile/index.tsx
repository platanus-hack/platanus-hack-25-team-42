import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import {
  User,
  Mail,
  Briefcase,
  CreditCard,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { db } from "@/db";
import { userData } from "@/db/schema.auth";
import { eq } from "drizzle-orm";
import z from "zod";

// Server function to get user data
const getUserProfileData = createServerFn({
  method: "GET",
}).handler(async ({ context }) => {
  const session = await context.getSession();
  if (!session) throw new Error("Usuario no autenticado");

  const data = await db
    .select()
    .from(userData)
    .where(eq(userData.userId, session.user.id));

  return data;
});

// Server function to delete user data
const deleteUserProfileData = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ context, data }) => {
    const session = await context.getSession();
    if (!session) throw new Error("Usuario no autenticado");

    await db.delete(userData).where(eq(userData.id, data.id));
    return { success: true };
  });

export const Route = createFileRoute("/_with_header/_authed/profile/")({
  component: ProfileView,
  loader: async () => {
    const data = await getUserProfileData();
    return { userData: data };
  },
});

// Map data types to Spanish labels
const dataTypeLabels: Record<string, string> = {
  rut: "RUT / DNI",
  email: "Email",
  phone: "Teléfono",
  first_name: "Nombres",
  last_name: "Apellidos",
  date_of_birth: "Fecha de Nacimiento",
  nationality: "Nacionalidad",
  marital_status: "Estado Civil",
  address: "Dirección",
  gender: "Género",
  profession: "Profesión",
  income: "Ingresos",
  job_position: "Cargo",
};

// Group data by category
const categoryMapping: Record<
  string,
  { title: string; icon: any; types: string[] }
> = {
  personal: {
    title: "Información Personal",
    icon: User,
    types: [
      "first_name",
      "last_name",
      "rut",
      "nationality",
      "date_of_birth",
      "gender",
      "marital_status",
    ],
  },
  contact: {
    title: "Datos de Contacto",
    icon: Mail,
    types: ["email", "phone", "address"],
  },
  professional: {
    title: "Información Profesional",
    icon: Briefcase,
    types: ["profession", "job_position"],
  },
  financial: {
    title: "Datos Financieros",
    icon: CreditCard,
    types: ["income"],
  },
};

function ProfileView() {
  const { userData: userDataList } = Route.useLoaderData();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteDataMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteUserProfileData({ data: { id } });
    },
    onSuccess: () => {
      router.invalidate();
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string, label: string) => {
    if (
      confirm(
        `¿Está seguro de que desea eliminar "${label}"? Esta acción no se puede deshacer.`
      )
    ) {
      setDeletingId(id);
      deleteDataMutation.mutate(id);
    }
  };

  // Group data by category
  const groupedData: Record<string, typeof userDataList> = {};
  Object.keys(categoryMapping).forEach((cat) => {
    groupedData[cat] = userDataList.filter((d) =>
      categoryMapping[cat].types.includes(d.type)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Mis Datos</h1>
          <p className="text-slate-500 mt-1">
            Gestiona y visualiza tu información verificada
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(categoryMapping).map(([categoryKey, category]) => {
            const categoryData = groupedData[categoryKey];
            const Icon = category.icon;

            return (
              <div key={categoryKey} className="mb-6">
                <h3 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">
                  <Icon size={14} />
                  {category.title}
                </h3>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  {categoryData.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {categoryData.map((data) => (
                        <div
                          key={data.id}
                          className="flex items-center justify-between py-4 px-5 hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                              {dataTypeLabels[data.type] || data.type}
                            </p>
                            <p className="text-sm font-semibold text-slate-800">
                              {data.value || (
                                <span className="text-slate-400 italic">
                                  Sin información
                                </span>
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 pl-4">
                            {data.isValidated && (
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50/80 border border-green-100/50 rounded-full">
                                <CheckCircle2
                                  size={12}
                                  className="text-green-500 fill-green-500/10"
                                  strokeWidth={3}
                                />
                                <span className="text-xs font-bold text-green-700 uppercase">
                                  Validado
                                </span>
                              </div>
                            )}

                            <button
                              onClick={() =>
                                handleDelete(
                                  data.id,
                                  dataTypeLabels[data.type] || data.type
                                )
                              }
                              disabled={
                                deleteDataMutation.isPending &&
                                deletingId === data.id
                              }
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Eliminar"
                            >
                              {deleteDataMutation.isPending &&
                              deletingId === data.id ? (
                                <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 size={16} strokeWidth={2.5} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-500">
                      <p className="text-sm">
                        No hay información en esta categoría
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
