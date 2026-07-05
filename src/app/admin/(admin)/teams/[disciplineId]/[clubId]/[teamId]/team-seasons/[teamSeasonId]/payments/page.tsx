import { ErrorPage, HeaderPage } from "@/ui";
import { redirect } from "next/navigation";
import { getTeamSeasonById } from "@/modules/team-seasons";
import { getPlayerMemberships } from "@/modules/player-memberships";
import { PaymentsDashboard } from "@/modules/payments";

interface Props {
  params: Promise<{
    disciplineId: string;
    clubId: string;
    teamId: string;
    teamSeasonId: string;
  }>;
}

export default async function PaymentsPage({ params }: Props) {
  const { disciplineId, clubId, teamId, teamSeasonId } = await params;

  const [teamSeasonResponse, membershipsResponse] = await Promise.all([
    getTeamSeasonById({ id: teamSeasonId }),
    getPlayerMemberships({ teamSeasonId, per_page: "100" }),
  ]);

  if (membershipsResponse.error && membershipsResponse.statusCode === 401) {
    redirect("/login");
  }
  if (teamSeasonResponse.error) {
    return <ErrorPage message={teamSeasonResponse.message} />;
  }

  const teamSeason = teamSeasonResponse.data;
  const memberships = membershipsResponse.error
    ? []
    : membershipsResponse.data.data;

  return (
    <>
      <HeaderPage
        title={`Pagos · ${teamSeason.team.name}`}
        description="Procesa cobros y consulta el historial de pagos de la temporada"
        breadcrumb={[
          { label: "Gestión Equipos", href: `/` },
          {
            label: `Gestión de Temporadas - ${teamSeason.team.name}`,
            href: `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons`,
          },
          {
            label: `Membresías - ${teamSeason.team.name}`,
            href: `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons/${teamSeasonId}/player-memberships`,
          },
          { label: `Pagos - ${teamSeason.season.name}` },
        ]}
      />

      <PaymentsDashboard memberships={memberships} teamSeason={teamSeason} />
    </>
  );
}
