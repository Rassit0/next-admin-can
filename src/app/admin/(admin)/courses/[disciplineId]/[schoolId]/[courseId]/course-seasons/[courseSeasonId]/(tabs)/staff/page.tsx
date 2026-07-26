import { Card } from "@heroui/react";
import { getCourseSeasonById } from "@/modules/course-seasons";
import {
  getCourseSeasonStaff,
  AssignStaffDrawer,
  CourseSeasonStaffTable,
} from "@/modules/course-season-staff";

interface Props {
  params: Promise<{
    courseSeasonId: string;
  }>;
}

export default async function CourseSeasonStaffPage({ params }: Props) {
  const { courseSeasonId } = await params;

  const [courseSeasonRes, staffRes] = await Promise.all([
    getCourseSeasonById({ id: courseSeasonId }),
    getCourseSeasonStaff({ courseSeasonId, per_page: "100" }),
  ]);

  if (courseSeasonRes.error || !courseSeasonRes.data) {
    return <div>Error cargando la temporada del curso</div>;
  }

  const courseSeason = courseSeasonRes.data;
  const staffList = staffRes.data?.data || [];

  return (
    <Card className="flex-1 rounded-t-none bg-surface p-1 shadow-sm md:p-4">
      <Card.Header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between w-full px-2">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">Personal Asignado</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gestione los profesores y personal administrativo asignado a este
            curso.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <AssignStaffDrawer courseSeason={courseSeason} />
        </div>
      </Card.Header>

      <Card.Content className="px-2">
        <CourseSeasonStaffTable
          staffList={staffList}
          courseSeason={courseSeason}
        />
      </Card.Content>
    </Card>
  );
}
