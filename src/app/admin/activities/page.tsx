import {
  ActivityType,
  ButtonAdd,
  getActivities,
  TableActivities,
  TypeFilter,
} from "@/modules/activities";
import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { Card } from "@heroui/react";
import {
  Calendar03Icon,
  Payment01Icon,
  UserAdd02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    type?: ActivityType;
  }>;
}

export default async function ActivitiesPage({ searchParams }: Props) {
  const { search, page, per_page, type } = await searchParams;
  const result = await getActivities({
    search,
    page,
    per_page,
    type,
  });

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (result.error && result.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (result.error) {
    return <ErrorPage message={result.message} />;
  }
  return (
    <>
      {/* <!-- Breadcrumbs & Header --> */}
      <HeaderPage
        title="Actividades"
        description="Gestione las actividades del club."
        action={<ButtonAdd />}
      />
      {/* <!-- Summaries Cards --> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* <!-- Activities Today --> */}
        <Card className="p-5 flex flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center">
            <HugeiconsIcon icon={Calendar03Icon} className="text-accent" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">
              Actividades Hoy
            </p>
            <p className="text-2xl font-black font-headline">12</p>
          </div>
        </Card>
        {/* <!-- Active Registrations --> */}
        <Card className="p-5 flex flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-default flex items-center justify-center">
            <HugeiconsIcon
              icon={UserAdd02Icon}
              className="text-default-foreground"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">
              Inscripciones Activas
            </p>
            <p className="text-2xl font-black font-headline">342</p>
          </div>
        </Card>
        {/* <!-- Pending Payments --> */}
        <Card className="p-5 flex flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-warning-soft text-tertiary flex items-center justify-center">
            <HugeiconsIcon icon={Payment01Icon} className="text-warning" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">
              Pagos Pendientes
            </p>
            <p className="text-2xl font-black font-headline text-surface-foreground">
              $1.2M
            </p>
          </div>
        </Card>
      </div>

      {/* <!-- Search and Filter Bar (Tonal Architecture) --> */}
      {/* <SectionFilters>
        <TypeFilter />
      </SectionFilters> */}

      <TableActivities activities={result.data.data} />
      <PaginationSection
        totalPages={result.data.meta.totalPages}
        itemsPerPage={result.data.meta.itemsPerPage}
        totalItems={result.data.meta.totalItems}
      />
      {/* <!-- Contextual Info --> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/40 shadow-xl overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="font-headline font-bold text-xl text-primary mb-2">
                Resumen Operativo
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-white/50 rounded-xl">
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">
                    Inscritos Totales
                  </p>
                  <p className="text-2xl font-black font-headline text-on-surface">
                    2,482
                  </p>
                </div>
                <div className="p-4 bg-white/50 rounded-xl">
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">
                    Recaudación Proyectada
                  </p>
                  <p className="text-2xl font-black font-headline text-on-surface">
                    $14.2M
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 aspect-video bg-slate-100 rounded-xl relative overflow-hidden group">
              <img
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUMCN3yXkSLTkToOJX3-gsKmi8_fCl7CM_p0Rqbh65KNpGmtvv8swtkf1-Y7UwEILs4vavJZ2n5Znq5OdcY1Pq5XS3SsulJpEGDqcUBRGPmxGuKqcwuGN18bZVVcDc7EFxCqGGlP7AEdCjL4PX2SoesmU7X-8TfxRRbo3xW9eosnrqR6hhr1Zhr3j9PsY8PwAB10yhrCSYFb57R5fdj9NKOLmZAj31Hp6oeGXq7iU7ge78v1P2dSH6bBoMyNVN_T-u-X1XS9t3OgLx"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-[10px] font-bold uppercase">
                  Sede Principal
                </p>
                <p className="text-sm font-headline font-bold">
                  Estadio Nacional
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#002f46] text-white p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
          <div>
            <span className="inline-block px-2 py-1 bg-primary-container text-white text-[10px] font-black rounded mb-4">
              ALERTA
            </span>
            <h3 className="text-xl font-bold font-headline leading-tight">
              Actividades por expirar inscripción
            </h3>
          </div>
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 cursor-pointer transition-all">
              <div className="text-xs font-medium">Clínica de Porteros</div>
              <div className="text-[10px] font-black text-primary-fixed">
                2h restantes
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 cursor-pointer transition-all">
              <div className="text-xs font-medium">Copa Verano 2024</div>
              <div className="text-[10px] font-black text-primary-fixed">
                12h restantes
              </div>
            </div>
          </div>
          <button className="mt-6 w-full py-2 bg-white text-[#002f46] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary-fixed transition-colors">
            Revisar todas
          </button>
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary rounded-full blur-3xl opacity-30"></div>
        </div>
      </div>
    </>
  );
}
