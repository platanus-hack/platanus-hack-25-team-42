import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { createServerFn } from "@tanstack/react-start";
import { QueryClient, queryOptions } from "@tanstack/react-query";
import appCss from "../styles.css?url";

const fetchAuth = createServerFn({ method: "GET" }).handler(
  async ({ context }) => context.getSession()
);

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => {
    const baseUrl =
      process.env.VITE_BASE_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "https://goboard.app");
    const ogImageUrl = `${baseUrl}/open_graph.png`;

    const title = "Goboard";
    const description =
      "Una plataforma de onboarding de datos reutilizables, donde el usuario completa una vez sus datos básicos (correo, tel., dirección, estado civil, documentos, etc.). Goboard es una Capa de Abstracción y Seguridad que permite a las aplicaciones legacy implementar un Inicio de Sesión Único (SSO) a través del estándar OAuth 2.0.";

    return {
      title,
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: description,
        },
        {
          property: "og:image",
          content: ogImageUrl,
        },
        {
          property: "og:image:width",
          content: "1200",
        },
        {
          property: "og:image:height",
          content: "630",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:site_name",
          content: "Goboard",
        },
        {
          property: "og:url",
          content: baseUrl,
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: title,
        },
        {
          name: "twitter:description",
          content: description,
        },
        {
          name: "twitter:image",
          content: ogImageUrl,
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon-96x96.png",
          sizes: "96x96",
        },
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg",
        },
        {
          rel: "shortcut icon",
          href: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "manifest",
          href: "/manifest.json",
        },
      ],
    };
  },
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;
    const sessionQuery = queryOptions({
      queryKey: ["session"],
      queryFn: fetchAuth,
    });
    const session = await queryClient.ensureQueryData(sessionQuery);
    return { session };
  },
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-slate-900 min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
