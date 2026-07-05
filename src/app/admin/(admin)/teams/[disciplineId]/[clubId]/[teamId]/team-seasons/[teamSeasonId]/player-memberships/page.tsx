import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPaymentPlans } from "@/modules/payment-plans";
import { getPlayers } from "@/modules/players";
import { getTeamSeasonById } from "@/modules/team-seasons";
import {
  EnrollMembershipDrawer,
  getPlayerMemberships,
  MetricsCards,
  TableMemberships,
} from "@/modules/player-memberships";
import { Button, Card } from "@heroui/react";
import { Wallet01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    status?: string;
  }>;
  params: Promise<{
    disciplineId: string;
    clubId: string;
    teamId: string;
    teamSeasonId: string;
  }>;
}

export default async function PlayerMembershipsPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page, status } = await searchParams;
  const { disciplineId, clubId, teamId, teamSeasonId } = await params;

  const [membershipsResponse, teamSeasonResponse, paymentPlansResponse] =
    await Promise.all([
      getPlayerMemberships({ search, page, per_page, teamSeasonId, status }),
      getTeamSeasonById({ id: teamSeasonId }),
      getPaymentPlans({ per_page: "100", teamSeasonId }),
    ]);

  if (membershipsResponse.error && membershipsResponse.statusCode === 401) {
    redirect("/login");
  }
  if (teamSeasonResponse.error) {
    return <ErrorPage message={teamSeasonResponse.message} />;
  }
  if (membershipsResponse.error) {
    return <ErrorPage message={membershipsResponse.message} />;
  }

  const teamSeason = teamSeasonResponse.data;
  const memberships = membershipsResponse.data.data;
  const meta = membershipsResponse.data.meta;
  const paymentPlans = paymentPlansResponse.error
    ? []
    : paymentPlansResponse.data.data;

  const GENDER_MAP: Record<string, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
    MIXED: "Mixto",
  };

  return (
    <>
      <HeaderPage
        title={`${teamSeason.category.name} (${GENDER_MAP[teamSeason.gender] || teamSeason.gender}) · ${teamSeason.season.name}`}
        description={`Equipo: ${teamSeason.team.name} · Gestiona las membresías de la temporada y sus cargos iniciales`}
        action={
          <Link
            href={`/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons/${teamSeasonId}/payments`}
          >
            <Button variant="secondary">
              <HugeiconsIcon icon={Wallet01Icon} size={18} />
              Ver pagos
            </Button>
          </Link>
        }
        breadcrumb={[
          { label: "Gestión Equipos", href: `/` },
          {
            label: `Gestión de Temporadas - ${teamSeason.team.name}`,
            href: `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons`,
          },
          {
            label: `Membresías - ${teamSeason.category.name} (${GENDER_MAP[teamSeason.gender] || teamSeason.gender}) - ${teamSeason.season.name}`,
          },
        ]}
      />

      <div className="flex flex-col gap-6 page-content">
        <MetricsCards
          memberships={memberships}
          teamSeason={teamSeason}
          totalItems={meta.totalItems}
        />

        <Card className="shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border">
          <HeaderPage
            title="Atletas inscritos"
            description="Asigna membresías y revisa los cargos iniciales generados"
            action={
              <div className="w-full">
                <EnrollMembershipDrawer
                  teamSeason={teamSeason}
                  paymentPlans={paymentPlans}
                  size="md"
                />
              </div>
            }
          />
          <SectionFilters />
          <TableMemberships memberships={memberships} teamSeason={teamSeason} />
          <PaginationSection
            totalPages={meta.totalPages}
            itemsPerPage={meta.itemsPerPage}
            totalItems={meta.totalItems}
          />
        </Card>
      </div>
    </>
  );
}
