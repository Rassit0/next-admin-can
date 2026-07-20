import {
  AddModal,
  getActivePassesByPlayerByDisciplineOptions,
  getDisciplinesOptions,
  getPlayerPasses,
  TablePlayerPasses,
} from "@/modules/players-passes";
import { getPlayerById, getPlayers, TablePlayers } from "@/modules/players";
import {
  ErrorPage,
  HeaderPage,
  PaginationSection,
  SectionFilters,
  TabsTypeFilter,
  TabsTypeFilterQueryProps,
} from "@/ui";
import {
  Alert01Icon,
  Basketball01Icon,
  LicenseIcon,
  SaveIcon,
  UserAdd01Icon,
  UserGroupIcon,
  VolleyballIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { notFound, redirect } from "next/navigation";
import { Badge, Chip } from "@heroui/react";
import { TGender } from "@/modules/persons";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    disciplineId?: string;
  }>;
  params: Promise<{ playerId: string }>;
}
export default async function PassesPage({ searchParams, params }: Props) {
  const [{ search, page, per_page, disciplineId }, { playerId }] =
    await Promise.all([searchParams, params]);
  const [playerPassesResponse, playerResponse, disciplineOptionsResponse] =
    await Promise.all([
      getPlayerPasses({
        search,
        page,
        per_page,
        playerId,
        disciplineId: disciplineId === "all" ? undefined : disciplineId,
      }),
      getPlayerById({ id: playerId }),
      getDisciplinesOptions(),
    ]);

  if (playerPassesResponse.error && playerPassesResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (playerPassesResponse.error) {
    return <ErrorPage message={playerPassesResponse.message} />;
  }
  if (playerResponse.error && playerResponse.statusCode === 401) {
    redirect("/login");
  }
  if (playerResponse.error) {
    return <ErrorPage message={playerResponse.message} />;
  }
  if (
    disciplineOptionsResponse.error &&
    disciplineOptionsResponse.statusCode === 401
  ) {
    redirect("/login");
  }
  if (disciplineOptionsResponse.error) {
    return <ErrorPage message={disciplineOptionsResponse.message} />;
  }

  const genderMap: Record<TGender, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
  };

  const genderClassMap: Record<TGender, string> = {
    MALE: "bg-blue-400 text-blue-50",
    FEMALE: "bg-pink-400 text-pink-50",
  };
  return (
    <>
      {/* <!-- Hero Stats / Filters Section --> */}
      <div className="space-y-8">
        <HeaderPage
          title={
            <Badge.Anchor className="flex items-center gap-2">
              <HugeiconsIcon
                icon={LicenseIcon}
                className="hidden sm:block text-accent"
                size={32}
              />
              <div className="flex flex-col lg:flex-row gap-1">
                <p className="text-3xl font-black font-headline text-default-foreground">
                  Kardex -{" "}
                  <span className="text-accent">
                    {playerResponse.data.person.name}{" "}
                    {playerResponse.data.person.lastName}{" "}
                    {playerResponse.data.person.secondLastName}
                  </span>
                </p>
                <Chip
                  size="sm"
                  variant="soft"
                  className={`h-6 max-w-fit ${genderClassMap[playerResponse.data.person.gender]}`}
                >
                  {genderMap[playerResponse.data.person.gender]}
                </Chip>
              </div>
            </Badge.Anchor>
          }
          description="Historial de pases del jugador."
          // action={
          //   <AddModal
          //     player={playerResponse.data}
          //     // activePassesOptions={activePassesOptionsResponse.data.data}
          //     disciplineOptions={disciplineOptionsResponse.data.data}
          //   />
          // }
          urlBase="/admin"
          breadcrumb={[
            { label: "Jugadores", href: "players" },
            {
              label: "Kardex",
            },
          ]}
        />
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
        <TabsTypeFilterQueryProps
          queryProp="disciplineId"
          queryPropValueDefault="all"
          props={[
            { value: "all", title: "Todos" },
            ...disciplineOptionsResponse.data.data.map((discipline) => ({
              value: discipline.id,
              title: discipline.name,
            })),
          ]}
        />
        {/* <!-- Main Member Table --> */}
        <TablePlayerPasses playerPasses={playerPassesResponse.data.data} />
        {/* <!-- Pagination --> */}
        <PaginationSection
          totalPages={playerPassesResponse.data?.meta.totalPages}
          itemsPerPage={playerPassesResponse.data?.meta.itemsPerPage}
          totalItems={playerPassesResponse.data?.meta.totalItems}
        />
      </div>
    </>
  );
}
