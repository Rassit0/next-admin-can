import { Suspense } from "react";
import { ParticlesBackground, Crest } from "@/ui";
import { LoginForm } from "@/modules/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh w-full bg-background overflow-hidden">
      {/* Zona Izquierda - Branding y Motivación (Solo Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 xl:p-16 bg-linear-to-br from-background to-surface-secondary">
        <ParticlesBackground />

        {/* Decoración abstracta superior sutil */}
        <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-accent/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-success/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo / Header de la plataforma */}
        <div className="relative z-10 flex items-center gap-4">
          <Crest className="w-12 h-14 drop-shadow-md" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
            Gestión<span className="text-accent">360</span>
          </h1>
        </div>

        {/* Contenido Central motivacional */}
        <div className="relative z-10 max-w-lg mt-auto mb-auto">
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-foreground mb-6">
            Lleva la gestión de tu club al{" "}
            <span className="text-accent">siguiente nivel.</span>
          </h2>
          <p className="text-lg text-muted/90 leading-relaxed">
            Una plataforma integral diseñada para potenciar el rendimiento,
            optimizar la administración y conectar a toda tu comunidad deportiva
            en un solo lugar.
          </p>
        </div>

        {/* Footer izquierdo */}
        <div className="relative z-10 text-sm text-muted font-medium">
          &copy; {new Date().getFullYear()} Gestión360 SaaS. Todos los derechos
          reservados.
        </div>
      </div>

      {/* Zona Derecha - Formulario de Acceso */}
      <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto">
        {/* En móvil mostramos las partículas de fondo también en la derecha */}
        <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none">
          <ParticlesBackground />
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" />
          <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        </div>

        {/* Branding versión Móvil */}
        <div className="lg:hidden relative z-10 flex flex-col items-center gap-3 mb-8 mt-4">
          <Crest className="w-14 h-16 drop-shadow-xl" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
            Gestión<span className="text-accent">360</span>
          </h1>
          <p className="text-sm text-muted font-medium text-center max-w-70">
            Gestión deportiva de alto rendimiento
          </p>
        </div>

        <div className="relative z-10 w-full max-w-100">
          <Suspense
            fallback={
              <div className="h-96 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer móvil */}
        <div className="lg:hidden relative z-10 text-xs text-muted font-medium mt-10 mb-2">
          &copy; {new Date().getFullYear()} Gestión360
        </div>
      </div>
    </div>
  );
}
