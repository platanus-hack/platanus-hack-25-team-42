"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ReactTyped } from "react-typed";
import { FintualLogoWithText } from "../components/FintualLogos";
import { FintualistSVG } from "../components/FintualistSVG";
import { FintualBtn } from "../components/FintualBtn";

function NavbarLink(props: React.ComponentProps<typeof Link>) {
  return <Link className="text-sm font-medium text-[#757575]" {...props} />;
}

function NavbarLinks() {
  return (
    <div className="flex h-full items-center gap-8">
      <NavbarLink href="/">Inbox</NavbarLink>
      <NavbarLink href="/">Fondos</NavbarLink>
      <NavbarLink href="/">Jubilación</NavbarLink>
      <NavbarLink href="/">Acciones</NavbarLink>
      <NavbarLink href="/">Personas</NavbarLink>
      <Link href="/">
        <FintualistSVG />
      </Link>
      <button 
        onClick={() => signIn("my-provider")}
        className="flex h-[44px] flex-row items-center justify-center gap-4 rounded-[32px] border border-solid border-[#282828] px-[52px] py-7 text-sm hover:bg-gray-100 cursor-pointer transition-colors"
      >
        Entrar
      </button>
      <button
        onClick={() => signIn("my-provider")}
        className="flex h-[44px] flex-row items-center justify-center gap-4 rounded-[32px] border border-solid border-transparent bg-[#005ad6] text-white hover:bg-[#0047a3] px-[52px] py-7 text-sm cursor-pointer transition-colors"
      >
        Empieza Ahora
      </button>
    </div>
  );
}

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <header className="mx-auto box-content flex h-[130px] max-w-screen-xl flex-row items-center justify-between bg-white px-20">
          <FintualLogoWithText className="h-8" />
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">
              Hola, <span className="font-semibold text-[#282828]">{session.user?.name || session.user?.email}</span>
            </span>
            <button
              onClick={() => signOut()}
              className="px-6 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>
        <main className="bg-[#F9F9F9] min-h-[calc(100vh-130px)]">
          <section className="mx-auto max-w-screen-xl px-20 py-20">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-[#282828] mb-2">
                  ¡Bienvenido a Fintual! 🎉
                </h1>
                <p className="text-gray-600">
                  Has iniciado sesión correctamente
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  Información de la sesión:
                </h2>
                <pre className="text-xs overflow-auto bg-white p-4 rounded border border-gray-200">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Ahora puedes comenzar a invertir y hacer crecer tu patrimonio
                </p>
                <button
                  onClick={() => signOut()}
                  className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition duration-200"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <header className="mx-auto box-content flex h-[130px] max-w-screen-xl flex-row items-center justify-between bg-white px-20">
        <FintualLogoWithText className="h-8" />
        <div>
          <NavbarLinks />
          {/* Mobile se ignora */}
        </div>
      </header>
      <main>
        <section>
          <header className="mx-auto box-content min-h-[800px] max-w-screen-xl px-20 py-40 bg-[#F9F9F9]">
            <div className="pb-6">
              <h2 className="select-none whitespace-pre text-[65px] font-medium leading-[1.125] text-[#282828]">
                Una máquina{"\n"}para hacer crecer{"\n"}tu{" "}
                <ReactTyped {...typerArgs} />
              </h2>
            </div>
            <h1 className="box-content select-none whitespace-pre pb-6 font-medium text-[#282828]">
              Haz más cosas con lo que ganas.{"\n"}Inversiones sin mínimos y
              reguladas.
            </h1>
            <button
              onClick={() => signIn("my-provider")}
              className="flex h-[44px] flex-row items-center justify-center gap-4 rounded-[32px] border border-solid border-transparent bg-[#005ad6] text-white hover:bg-[#0047a3] px-[52px] py-7 text-sm cursor-pointer transition-colors"
            >
              Empieza Ahora
            </button>
          </header>
        </section>
      </main>
    </>
  );
}

const typerArgs = {
  strings: ["patrimonio", "sueldo", "inversión", "plata", "bienestar"],
  typeSpeed: 50,
  backSpeed: 5,
  backDelay: 800,
  startDelay: 200,
  loop: true,
};
