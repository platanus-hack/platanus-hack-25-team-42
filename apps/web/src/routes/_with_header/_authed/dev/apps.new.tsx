import { createFileRoute, Link } from "@tanstack/react-router";
import { Checkbox } from "@base-ui-components/react/checkbox";
import { CheckboxGroup } from "@base-ui-components/react/checkbox-group";
import { ArrowLeft, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { authClient } from "@/integrations/auth/client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
export const Route = createFileRoute("/_with_header/_authed/dev/apps/new")({
  component: RouteComponent,
});

const keys = [
  "rut",
  "email",
  "phone",
  "first_name",
  "last_name",
  "date_of_birth",
  "nationality",
  "marital_status",
  "address",
  "gender",
  "profession",
  "income",
  "job_position",
] as const;

const mapping: Record<(typeof keys)[number], string> = {
  rut: "RUT",
  email: "Correo electrónico",
  phone: "Teléfono",
  first_name: "Nombre",
  last_name: "Apellido",
  date_of_birth: "Fecha de nacimiento",
  nationality: "Nacionalidad",
  marital_status: "Estado civil",
  address: "Dirección",
  gender: "Género",
  profession: "Profesión",
  income: "Ingresos",
  job_position: "Cargo",
};

function RouteComponent() {
  const [appName, setAppName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [fields, setFields] = useState<string[]>([]);

  const navigate = Route.useNavigate();

  const createAppMutation = useMutation({
    mutationFn: async () => {
      const { data: responseData, error } = await authClient.oauth2.register({
        client_name: appName,
        client_uri: websiteUrl,
        redirect_uris: [redirectUrl],
        logo_uri: logoUrl,
        scope: fields.join(" "),
        metadata: {
          scopes: fields,
        },
      });

      if (error) throw new Error(error.message);
      return responseData;
    },
    onSuccess: ({ client_id }) => {
      navigate({ to: "/dev/app/$clientId", params: { clientId: client_id } });
    },
  });

  return (
    <div className="mx-auto mt-12 max-w-2xl rounded-lg p-6">
      <div className="mb-8">
        <div className="mb-4">
          <Link to="/dev" className="flex items-center gap-2">
            <ArrowLeft className="size-4" />
            <div>Volver</div>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">
          Crear Nueva Aplicación
        </h1>
        <p className="mt-2 text-slate-500">
          Configura los detalles de tu nueva aplicación OAuth.
        </p>
      </div>

      <Card className="p-6 bg-white">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            createAppMutation.mutate();
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Nombre de la Aplicación
            </label>
            <Input
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              type="text"
              placeholder="Mi Aplicación Genial"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              URL del Sitio Web
            </label>
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              type="text"
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              URL de Redirección
            </label>
            <Input
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              type="text"
              placeholder="https://example.com/callback"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              URL del Logo (Opcional)
            </label>
            <Input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              type="text"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              Información requerida
            </label>
            <CheckboxGroup
              value={fields}
              onValueChange={(val) => setFields(val as string[])}
              className="grid grid-cols-2 gap-1 rounded-xl p-1"
            >
              {keys.map((key) => (
                <Checkbox.Root
                  key={key}
                  value={key}
                  className="group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 transition hover:bg-slate-50"
                >
                  <div className="flex size-5 items-center justify-center rounded border border-slate-300 group-data-[state=checked]:border-yellow-700 group-data-[state=checked]:bg-yellow-700">
                    <Checkbox.Indicator className="text-black">
                      <Check className="size-3.5" />
                    </Checkbox.Indicator>
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {mapping[key]}
                  </span>
                </Checkbox.Root>
              ))}
            </CheckboxGroup>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              to="/dev"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={createAppMutation.isPending}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createAppMutation.isPending ? "Creando..." : "Crear Aplicación"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
