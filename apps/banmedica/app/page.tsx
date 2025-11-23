"use client";

import { useState } from "react";
import Link from "next/link";
import { BanmedicaButton } from "../components/BanmedicaButton";

function NavbarLink(props: React.ComponentProps<typeof Link>) {
  return <Link className="text-sm font-medium text-gray-700 hover:text-banmedica-red" {...props} />;
}

function NavbarLinks() {
  return (
    <div className="flex h-full items-center gap-8">
      <NavbarLink href="/">Inicio</NavbarLink>
      <NavbarLink href="/">Planes</NavbarLink>
      <NavbarLink href="/">Sucursales</NavbarLink>
      <NavbarLink href="/">Beneficios</NavbarLink>
      <NavbarLink href="/">Contacto</NavbarLink>
      <BanmedicaButton>Iniciar Sesión</BanmedicaButton>
      <BanmedicaButton primary>Hazte Cliente</BanmedicaButton>
    </div>
  );
}

function ContactForm() {
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Formulario enviado con éxito");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="">
        <p className="text-gray-800 text-base">
          Si aún no eres parte de Banmédica, ingresa tus datos y nos comunicaremos contigo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <input
            type="text"
            placeholder="NOMBRE COMPLETO"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-banmedica-red text-sm"
            required
          />
        </div>
        
        <div>
          <input
            type="text"
            placeholder="RUT"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-banmedica-red text-sm"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-banmedica-red appearance-none bg-white text-sm"
              required
            >
              <option value="" disabled>REGIÓN</option>
              <option value="metropolitana">Metropolitana</option>
              <option value="valparaiso">Valparaíso</option>
              <option value="biobio">Biobío</option>
            </select>
          </div>
          
          <div>
            <select
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-banmedica-red appearance-none bg-white text-sm"
              required
            >
              <option value="" disabled>COMUNA</option>
              <option value="santiago">Santiago</option>
              <option value="providencia">Providencia</option>
              <option value="lascondes">Las Condes</option>
            </select>
          </div>
        </div>
        
        <div>
          <input
            type="email"
            placeholder="INGRESA TU E-MAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-banmedica-red text-sm"
            required
          />
        </div>
        
        <div>
          <input
            type="tel"
            placeholder="INGRESA TU CELULAR (EJ: 961152466)"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-banmedica-red text-sm"
            required
          />
        </div>
        
        <div>
          <textarea
            placeholder="SI NECESITAS AGREGAR OTRO TIPO DE INFORMACIÓN"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-banmedica-red resize-none h-20 text-sm"
          />
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-[#E30613] text-white py-3 px-4 rounded-md hover:bg-[#c00510] transition-colors font-medium"
          >
            Cámbiate a Isapre Banmédica
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <header className="mx-auto box-content flex h-[80px] max-w-screen-xl flex-row items-center justify-between bg-white px-20 shadow-border-b">
        <img src="https://www.tuplanbanmedica.cl/wp-content/uploads/2019/08/logo-banmedica.png" alt="Logo Banmédica" className="h-10" />
        <div className="hidden md:block">
          <NavbarLinks />
        </div>
        <div className="md:hidden">
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>
      
      <main>
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/70 to-gray-900/50 z-10"></div>
          <div 
            className="h-[600px] bg-cover bg-center"
            style={{ backgroundImage: "url('https://www.banmedica.cl/wp-content/uploads/2023/03/familia-banmedica-1.jpg')" }}
          ></div>
          
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Elige Banmédica
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-lg">
                  La mejor cobertura de salud para ti y tu familia con los mejores beneficios.
                </p>
                <div className="flex flex-wrap gap-4">
                  <BanmedicaButton primary>
                    Conoce Nuestros Planes
                  </BanmedicaButton>
                  <BanmedicaButton>
                    Sucursales
                  </BanmedicaButton>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-6 md:px-20">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <img src="https://www.tuplanbanmedica.cl/wp-content/uploads/2019/08/logo-banmedica.png" alt="Logo Banmédica" className="h-10" />

              <p className="text-gray-400 max-w-xs">
                Isapre Banmédica, cuidando la salud de los chilenos desde 1990.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Planes</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-white">Individuales</Link></li>
                  <li><Link href="/" className="text-gray-400 hover:text-white">Familiares</Link></li>
                  <li><Link href="/" className="text-gray-400 hover:text-white">Empresas</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Servicios</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-white">Sucursales</Link></li>
                  <li><Link href="/" className="text-gray-400 hover:text-white">Reembolsos</Link></li>
                  <li><Link href="/" className="text-gray-400 hover:text-white">Beneficios</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">600 600 3600</li>
                  <li className="text-gray-400">contacto@banmedica.cl</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Isapre Banmédica. Todos los derechos reservados.
            </p>
            
            <div className="flex space-x-4">
              <Link href="/" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <Link href="/" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <Link href="/" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
