import { ErrorPage, HeaderPage, TabsRouteNavigation } from "@/ui";
import { getTeamSeasonById, TeamSeasonActions } from "@/modules/team-seasons";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    disciplineId: string;
    clubId: string;
    teamId: string;
    teamSeasonId: string;
  }>;
}

const GENDER_MAP: Record<string, string> = {
  MALE: "Masculino",
  FEMALE: "Femenino",
  MIXED: "Mixto",
};

export default async function TeamSeasonDetailLayout({
  children,
  params,
}: LayoutProps) {
  const { disciplineId, clubId, teamId, teamSeasonId } = await params;

  const teamSeasonResponse = await getTeamSeasonById({ id: teamSeasonId });

  if (teamSeasonResponse.error) {
    return <ErrorPage message={teamSeasonResponse.message} />;
  }

  const teamSeason = teamSeasonResponse.data;

  const basePath = `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons/${teamSeasonId}`;

  const tabsRoutes = [
    { value: "/", title: "Información General" },
    { value: "/player-memberships", title: "Membresías" },
    { value: "/payment-plans", title: "Planes de Pago" },
    { value: "/payments", title: "Transacciones" },
  ];

  return (
    <>
      <HeaderPage
        title={`${teamSeason.category.name} (${GENDER_MAP[teamSeason.gender] || teamSeason.gender}) · ${teamSeason.season.name}`}
        description={`Equipo: ${teamSeason.team.name} · Detalle de la temporada`}
        action={<TeamSeasonActions teamSeason={teamSeason} />}
        breadcrumb={[
          { label: "Gestión Equipos", href: `/` },
          {
            label: `Temporadas`,
            href: `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons`,
          },
          {
            label: `Detalles`,
          },
        ]}
      />
      <div className="flex flex-col page-content">
        <TabsRouteNavigation
          routes={tabsRoutes}
          basePath={basePath}
          defaultRoute="/"
        />
        {children}
      </div>
    </>
  );
}
