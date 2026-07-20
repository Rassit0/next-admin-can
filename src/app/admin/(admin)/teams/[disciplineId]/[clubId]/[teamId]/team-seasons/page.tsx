import { getClubById } from "@/modules/clubs";
import { getPaymentPlans } from "@/modules/payment-plans";
import { getPlayers } from "@/modules/players";

import {
  ButtonAdd,
  Gender,
  getCategoriesByDisciplineOptions,
  getSeasonsByDisciplineOptions,
  getTeamSeasons,
  GridCards,
  ListCards,
  TableTeamSeasons,
} from "@/modules/team-seasons";
import { getTeamById } from "@/modules/teams";
import {
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
    gender?: Gender;
  }>;
  params: Promise<{ disciplineId: string; clubId: string; teamId: string }>;
}

export default async function TeamSeasonsPage({ searchParams, params }: Props) {
  const [{ search, page, per_page, gender }, { disciplineId, clubId, teamId }] =
    await Promise.all([searchParams, params]);

  const [teamSeasonsResponse, teamResponse, categoriesOptions, seasonsOptions] =
    await Promise.all([
      getTeamSeasons({ search, page, per_page, teamId, gender }),
      getTeamById({ id: teamId }),
      getCategoriesByDisciplineOptions(disciplineId),
      getSeasonsByDisciplineOptions(disciplineId),
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

  if (categoriesOptions.error) {
    return (
      <ErrorPage
        message={categoriesOptions.message}
        path={{
          href: `/clubs/${teamResponse.data.club.id}/manage`,
          label: "Volver a la lista de equipos",
        }}
      />
    );
  }

  if (seasonsOptions.error) {
    return (
      <ErrorPage
        message={seasonsOptions.message}
        path={{
          href: `/clubs/${teamResponse.data.club.id}/manage`,
          label: "Volver a la lista de equipos",
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
          <>
            <ButtonAdd
              urlBase={`/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons`}
              buttonFloatingMobile
            />
          </>
        }
        urlBase={`/admin/teams/${disciplineId}/${clubId}`}
        breadcrumb={[
          { label: "Equipos", href: `/` },
          {
            label: `Temporadas`,
          },
        ]}
      />
      {/* <TabsNavigation /> */}
      <SectionFilters />
      {/* <TableTeamSeasons
        teamSeasons={teamSeasonsResponse.data.data}
        urlBase={`/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons`}
      /> */}
      <ListCards
        teamSeasons={teamSeasonsResponse.data.data}
        urlBase={`/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons`}
      />
      {/* <GridCards teamSeasons={teamSeasonsResponse.data.data} /> */}
      <PaginationSection
        totalPages={teamSeasonsResponse.data.meta.totalPages}
        itemsPerPage={teamSeasonsResponse.data.meta.itemsPerPage}
        totalItems={teamSeasonsResponse.data.meta.totalItems}
      />
    </>
  );
}
