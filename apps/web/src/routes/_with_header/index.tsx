import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_with_header/")({
  component: App,
});

function App() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-100/50 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-20 text-center max-w-5xl z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8 relative inline-block">
          <div className="absolute -top-12 -left-12 animate-float-slow hidden lg:block">
            <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-slate-100 flex items-center justify-center transform -rotate-12">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                JD
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-16 animate-float-medium hidden lg:block">
            <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-slate-100 flex items-center justify-center transform rotate-6">
              <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-base">
                AS
              </div>
            </div>
          </div>
          <div className="absolute top-0 -right-24 animate-float-fast hidden lg:block">
            <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-slate-100 flex items-center justify-center transform rotate-12">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm">
                MK
              </div>
            </div>
          </div>
          Tus usuarios, listos
          <svg
            className="absolute -top-8 -right-8 w-16 h-16 text-blue-500/20 hidden md:block"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed text-pretty">
          Empieza a vender con software a tus clientes sin preocuparte de la
          obtención de datos y su gestión
        </p>
        <div>
          <Link
            to="/login"
            className="inline-block px-8 py-4 bg-slate-900 text-white rounded-lg font-medium text-lg hover:bg-slate-800 transition-all transform hover:-translate-y-1"
          >
            Empieza
          </Link>
        </div>
      </div>
    </div>
  );
}
