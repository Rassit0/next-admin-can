import { ErrorPage, HeaderPage } from "@/ui";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTeamSeasonById } from "@/modules/team-seasons";
import { TeamSeasonPaymentsMatrix } from "@/modules/reports/components/TeamSeasonPaymentsMatrix";

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

  const teamSeasonResponse = await getTeamSeasonById({ id: teamSeasonId });

  if (teamSeasonResponse.error) {
    return <ErrorPage message={teamSeasonResponse.message || "Error loading team season"} />;
  }

  const basePath = `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons/${teamSeasonId}`;

  return (
    <>
      <HeaderPage
        title={`Pagos - ${teamSeasonResponse.data.team.name} - ${teamSeasonResponse.data.season.name}`}
        description="Administra los pagos de membresías y sus estados"
        breadcrumb={[
          { label: "Equipos", href: `/` },
          {
            label: `${teamSeasonResponse.data.team.name}`,
            href: `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons`,
          },
          {
            label: "Pagos",
          },
        ]}
      />

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border pb-4">
        <Link href={`${basePath}/payment-plans`}>
          <div className="px-4 py-2 rounded-t-lg font-medium text-muted hover:text-foreground hover:bg-surface transition">
            Planes de Pago
          </div>
        </Link>
        <Link href={`${basePath}/membresias`}>
          <div className="px-4 py-2 rounded-t-lg font-medium text-muted hover:text-foreground hover:bg-surface transition">
            Membresías
          </div>
        </Link>
        <Link href={`${basePath}/pagos`}>
          <div className="px-4 py-2 rounded-t-lg font-medium text-foreground border-b-2 border-accent bg-accent-soft">
            Pagos
          </div>
        </Link>
      </div>

      <div className="mt-6">
        <TeamSeasonPaymentsMatrix teamSeasonId={teamSeasonId} />
      </div>
    </>
  );
}
