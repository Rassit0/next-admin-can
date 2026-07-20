import { getClubById } from "@/modules/clubs";
import {
  getTeamSeasons,
  GridCards,
  StatusTeamSeason,
  TabsNavigation,
} from "@/modules/team-membership-offerings";
import { getTeamById } from "@/modules/teams";
import {
  ButtonAdd,
  ErrorPage,
  HeaderPage,
  PaginationSection,
  SectionFilters,
  TabsTypeFilter,
} from "@/ui";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    status?: StatusTeamSeason;
  }>;
  params: Promise<{ disciplineId: string; clubId: string; teamId: string }>;
}

export default async function BidManagementPage({
  searchParams,
  params,
}: Props) {
  const [{ search, page, per_page, status }, { disciplineId, clubId, teamId }] =
    await Promise.all([searchParams, params]);

  const [teamSeasonsResponse, teamResponse, clubResponse] = await Promise.all([
    getTeamSeasons({ search, page, per_page, teamId, status }),
    getTeamById({ id: teamId }),
    getClubById({ id: clubId }),
  ]);

  if (teamResponse.error && teamResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (teamResponse.error) {
    return (
      <ErrorPage
        message={teamResponse.message}
        path={{
          href: `/clubs`,
          label: "Volver a la lista de clubes",
        }}
      />
    );
  }

  if (teamSeasonsResponse.error && teamSeasonsResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (teamSeasonsResponse.error) {
    return (
      <ErrorPage
        message={teamSeasonsResponse.message}
        path={{
          href: `/clubs/${teamResponse.data.club.id}/manage`,
          label: "Volver a la lista de equipos",
        }}
      />
    );
  }

  if (clubResponse.error && clubResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (clubResponse.error) {
    return (
      <ErrorPage
        message={clubResponse.message}
        path={{
          href: `/clubs`,
          label: "Volver a la lista de clubes",
        }}
      />
    );
  }
  return (
    <>
      <HeaderPage
        title={`Gestión de Temporadas - ${teamResponse.data.name}`}
        description="Gestión integral de las temporadas del equipo."
        action={
          <ButtonAdd
            href={`/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons/add`}
            label="Crear Nueva Temporada"
          />
        }
        urlBase={`/admin/teams/${disciplineId}/${clubId}`}
        breadcrumb={[
          { label: "Equipos", href: `/` },
          {
            label: `${teamResponse.data.name}`,
          },
        ]}
      />
      <TabsNavigation />
      <SectionFilters />
      <GridCards teamSeasons={teamSeasonsResponse.data.data} />
      <PaginationSection
        totalPages={teamSeasonsResponse.data.meta.totalPages}
        itemsPerPage={teamSeasonsResponse.data.meta.itemsPerPage}
        totalItems={teamSeasonsResponse.data.meta.totalItems}
      />
    </>
  );
}
