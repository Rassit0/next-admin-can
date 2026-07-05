import { AddModal, getPlayers, TablePlayers } from "@/modules/players";
import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import {
  Alert01Icon,
  Basketball01Icon,
  SaveIcon,
  UserAdd01Icon,
  UserGroupIcon,
  VolleyballIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    sortField?: string;
    orderBy?: string;
  }>;
}
export default async function PlayersPage({ searchParams }: Props) {
  const { search, page, per_page, sortField, orderBy } = await searchParams;
  const playersResponse = await getPlayers({
    search,
    page,
    per_page,
    sortField,
    orderBy,
  });

  if (playersResponse.error && playersResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (playersResponse.error) {
    return <ErrorPage message={playersResponse.message} />;
  }
  return (
    <>
      {/* <!-- Hero Stats / Filters Section --> */}
      <div className="space-y-8">
        <HeaderPage
          title="Directorio de Jugadores"
          description="Bienvenido de nuevo. Resumen de hoy."
          action={<AddModal />}
        />
        {/* <!-- Filters Bento --> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={Basketball01Icon} className="text-accent" />
            </div>
            <div>
              <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
                Básquet
              </p>
              <p className="text-xl font-black font-headline text-default-foreground">
                142
              </p>
            </div>
          </div>
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={VolleyballIcon} className="text-accent" />
            </div>
            <div>
              <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
                Vóley
              </p>
              <p className="text-xl font-black font-headline text-default-foreground">
                89
              </p>
            </div>
          </div>
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={Alert01Icon} className="text-warning" />
            </div>
            <div>
              <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
                Pendientes
              </p>
              <p className="text-xl font-black font-headline text-default-foreground">
                24
              </p>
            </div>
          </div>
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={UserGroupIcon} className="text-sky-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
                Total Miembros
              </p>
              <p className="text-xl font-black font-headline text-default-foreground">
                231
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Table Container --> */}
      <div className="flex flex-col space-y-3">
        {/* <!-- Table Controls --> */}
        {/* <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/10">
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-primary-container/10 text-primary font-bold text-xs rounded-full">
              Todos
            </button>
            <button className="px-4 py-1.5 text-slate-500 font-bold text-xs rounded-full hover:bg-slate-100">
              Básquet
            </button>
            <button className="px-4 py-1.5 text-slate-500 font-bold text-xs rounded-full hover:bg-slate-100">
              Vóley
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-xs font-bold text-slate-500 border border-outline-variant/20 px-3 py-1.5 rounded-lg hover:bg-slate-50">
              <span className="material-symbols-outlined text-sm">
                filter_list
              </span>
              Más Filtros
            </button>
            <button className="flex items-center gap-2 text-xs font-bold text-slate-500 border border-outline-variant/20 px-3 py-1.5 rounded-lg hover:bg-slate-50">
              <span className="material-symbols-outlined text-sm">
                download
              </span>
              Exportar
            </button>
          </div>
        </div> */}
        <SectionFilters />
        {/* <!-- Main Member Table --> */}
        <TablePlayers players={playersResponse.data.data} />
        {/* <!-- Pagination --> */}
        <PaginationSection
          totalPages={playersResponse.data?.meta.totalPages}
          itemsPerPage={playersResponse.data?.meta.itemsPerPage}
          totalItems={playersResponse.data?.meta.totalItems}
        />
      </div>
    </>
  );
}
