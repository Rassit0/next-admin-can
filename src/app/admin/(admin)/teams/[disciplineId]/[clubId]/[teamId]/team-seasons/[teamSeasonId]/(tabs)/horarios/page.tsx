import { Suspense } from "react";
import { ScheduleClientPage } from "@/modules/schedules";

interface Props {
  params: Promise<{
    disciplineId: string;
    clubId: string;
    teamId: string;
    teamSeasonId: string;
  }>;
}

export default async function TeamSeasonSchedulesPage({ params }: Props) {
  const { teamSeasonId } = await params;

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<div>Cargando horarios...</div>}>
        <ScheduleClientPage teamSeasonId={teamSeasonId} />
      </Suspense>
    </div>
  );
}
