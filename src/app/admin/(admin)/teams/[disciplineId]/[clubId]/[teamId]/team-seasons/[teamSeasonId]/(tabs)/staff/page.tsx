import { Card } from "@heroui/react";
import { getTeamSeasonById } from "@/modules/team-seasons";
import {
  getTeamSeasonStaff,
  AssignStaffDrawer,
  TeamSeasonStaffTable,
} from "@/modules/team-season-staff";

interface Props {
  params: Promise<{
    teamSeasonId: string;
  }>;
}

export default async function TeamSeasonStaffPage({ params }: Props) {
  const { teamSeasonId } = await params;

  const [teamSeasonRes, staffRes] = await Promise.all([
    getTeamSeasonById({ id: teamSeasonId }),
    getTeamSeasonStaff({ teamSeasonId, per_page: "100" }),
  ]);

  if (teamSeasonRes.error || !teamSeasonRes.data) {
    return <div>Error cargando la temporada del equipo</div>;
  }

  const teamSeason = teamSeasonRes.data;
  const staffList = staffRes.data?.data || [];

  return (
    <Card className="flex-1 rounded-t-none bg-surface p-1 shadow-sm md:p-4">
      <Card.Header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between w-full px-2">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">Personal Asignado</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gestione el personal técnico y administrativo asignado a esta
            temporada.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <AssignStaffDrawer teamSeason={teamSeason} />
        </div>
      </Card.Header>

      <Card.Content className="px-2">
        <TeamSeasonStaffTable staffList={staffList} teamSeason={teamSeason} />
      </Card.Content>
    </Card>
  );
}
