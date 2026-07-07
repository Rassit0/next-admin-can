import { EditModal, getClubById, IClub } from "@/modules/clubs";
import {
  AddModal,
  FiltersBar,
  MetricsPanel,
  GridCards,
  getClubsOptions,
  SelectClubOptions,
  getDisciplinesOptions,
  SelectDisciplineOptions,
} from "@/modules/teams";
import { getTeams } from "@/modules/teams";
import { TableTeams } from "@/modules/teams/components/table/Table";
import { ServiceResponse } from "@/types/api";
import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { Card, Separator, Surface } from "@heroui/react";
import { FootballIcon, Structure04FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
  }>;
  params: Promise<{ disciplineId: string; clubId: string }>;
}

export default async function TeamsPage({ searchParams, params }: Props) {
  const { search, page, per_page } = await searchParams;
  const { disciplineId, clubId } = await params;

  const [
    teamsResponse,
    clubsOptionsResponse,
    disciplinesOptionsResponse,
    clubResponse,
  ] = await Promise.all([
    getTeams({
      search,
      page,
      per_page,
      clubId,
    }),
    getClubsOptions(disciplineId),
    getDisciplinesOptions(),
    getClubById({ id: clubId }),
  ]);

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (teamsResponse.error && teamsResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (teamsResponse.error) {
    return (
      <ErrorPage
        message={teamsResponse.message}
        path={{ href: "/clubs", label: "Volver a la lista de clubes" }}
      />
    );
  }

  if (clubResponse?.error && clubResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (clubResponse?.error) {
    return (
      <ErrorPage
        message={clubResponse.message}
        path={{ href: "/clubs", label: "Volver a la lista de clubes" }}
      />
    );
  }

  if (clubsOptionsResponse.error && clubsOptionsResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (clubsOptionsResponse.error) {
    return (
      <ErrorPage
        message={clubsOptionsResponse.message}
        path={{ href: "/teams", label: "Volver a la lista de equipos" }}
      />
    );
  }

  if (
    disciplinesOptionsResponse.error &&
    disciplinesOptionsResponse.statusCode === 401
  ) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (disciplinesOptionsResponse.error) {
    return (
      <ErrorPage
        message={disciplinesOptionsResponse.message}
        path={{ href: "/teams", label: "Volver a la lista de equipos" }}
      />
    );
  }

  return (
    <>
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Structure04FreeIcons} />
            <Card.Title className="text-xl font-bold">
              Seleccione una Disciplina
            </Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <SelectDisciplineOptions
            disciplineOptions={disciplinesOptionsResponse.data.data}
            urlBase={`/admin/teams`}
            disciplineId={disciplineId}
          />
        </Card.Content>
      </Card>
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={FootballIcon} />
            <Card.Title className="text-xl font-bold">
              Seleccione un Club
            </Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <SelectClubOptions
            clubOptions={clubsOptionsResponse.data.data}
            urlBase={`/admin/teams/${disciplineId}`}
            clubId={clubId}
          />
        </Card.Content>
      </Card>
      {/* <!-- Breadcrumbs & Header --> */}
      <div>
        <HeaderPage
          title={`Equipos de "${clubResponse.data.name}"`}
          description={`Gestión integral de los equipos.`}
          action={clubId ? <AddModal clubId={clubId} /> : null}
          urlBase={`/admin/teams/${clubId}`}
        />
        {/* <!-- Metrics Panel: Asymmetric Bento Grid --> */}
        {/* <MetricsPanel /> */}

        {/* <Separator className="md:hidden my-4" /> */}

        <Surface className="rounded-xl p-2">
          <div className="flex flex-col gap-2">
            {/* <!-- Search and Filter Bar (Tonal Architecture) --> */}
            <SectionFilters />
            {/* <!-- Grid --> */}
            <TableTeams
              teams={teamsResponse.data.data}
              urlBase={`/admin/teams/${disciplineId}/${clubId}`}
            />
            <PaginationSection
              totalPages={teamsResponse.data.meta.totalPages}
              itemsPerPage={teamsResponse.data.meta.itemsPerPage}
              totalItems={teamsResponse.data.meta.totalItems}
            />
          </div>
        </Surface>
      </div>
    </>
  );
}
