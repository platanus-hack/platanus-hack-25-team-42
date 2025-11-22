import { createFileRoute, Link } from "@tanstack/react-router";
import { Form } from "@base-ui-components/react/form";
import { Field } from "@base-ui-components/react/field";
import { Fieldset } from "@base-ui-components/react/fieldset";
import { Checkbox } from "@base-ui-components/react/checkbox";
import { CheckboxGroup } from "@base-ui-components/react/checkbox-group";
import { Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { authClient } from "@/integrations/auth/client";

export const Route = createFileRoute("/_with_header/_authed/dev/apps/new")({
  component: RouteComponent,
});

const keys = ["email", "name"] as const;

const mapping: Record<(typeof keys)[number], string> = {
  email: "Email",
  name: "Name",
};

function RouteComponent() {
  const [appName, setAppName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [fields, setFields] = useState<string[]>([]);

  const navigate = Route.useNavigate();

  const createAppMutation = useMutation({
    mutationFn: async () => {
      const { data: responseData, error } = await authClient.oauth2.register({
        client_name: appName,
        client_uri: websiteUrl,
        redirect_uris: [redirectUrl],
        scope: fields.join(" "),
      });

      if (error) throw new Error(error.message);
      return responseData;
    },
    onSuccess: ({ client_id }) => {
      navigate({ to: "/dev/app/$id", params: { id: client_id } });
    },
  });

  return (
    <section className="mx-auto mt-8 max-w-xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <Form
        className="space-y-5"
        onFormSubmit={() => {
          createAppMutation.mutate();
        }}
      >
        <Field.Root name="name" className="space-y-2">
          <Field.Label className="text-sm font-medium text-slate-700">
            App Name
          </Field.Label>
          <Field.Control
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-200 transition focus:border-indigo-500 focus:ring"
          />
        </Field.Root>
        <Field.Root className="space-y-2">
          <Field.Label className="text-sm font-medium text-slate-700">
            Website URL
          </Field.Label>
          <Field.Control
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-200 transition focus:border-indigo-500 focus:ring"
          />
        </Field.Root>
        <Field.Root className="space-y-2">
          <Field.Label className="text-sm font-medium text-slate-700">
            Redirect URL
          </Field.Label>
          <Field.Control
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-200 transition focus:border-indigo-500 focus:ring"
          />
        </Field.Root>
        <Field.Root className="space-y-3">
          <Fieldset.Root
            render={
              <CheckboxGroup
                value={fields}
                defaultValue={[]}
                onValueChange={setFields}
              />
            }
            className="rounded-xl border border-slate-200 p-4"
          >
            <Fieldset.Legend className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Fields
            </Fieldset.Legend>
            <div className="mt-3 flex flex-col gap-2">
              {keys.map((key) => (
                <Field.Item
                  key={key}
                  className="flex items-center gap-3 rounded-lg border border-transparent px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-200"
                >
                  <Checkbox.Root
                    value={key}
                    className="grid size-5 place-items-center rounded border border-slate-300"
                  >
                    <Checkbox.Indicator className="text-indigo-600">
                      <Check className="size-3" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  {mapping[key]}
                </Field.Item>
              ))}
            </div>
          </Fieldset.Root>
        </Field.Root>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/dev"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create app
          </button>
        </div>
      </Form>
    </section>
  );
}
