import { Suspense } from "react";
import { ScheduleClientPage } from "@/modules/schedules";

interface Props {
  params: Promise<{
    disciplineId: string;
    schoolId: string;
    courseId: string;
    courseSeasonId: string;
  }>;
}

export default async function CourseSeasonSchedulesPage({ params }: Props) {
  const { courseSeasonId } = await params;

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<div>Cargando horarios...</div>}>
        <ScheduleClientPage courseSeasonId={courseSeasonId} />
      </Suspense>
    </div>
  );
}
