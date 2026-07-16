import { ErrorPage, HeaderPage } from "@/ui";
import { redirect } from "next/navigation";
import { getCourseSeasonById } from "@/modules/course-seasons";
import { getStudentMemberships } from "@/modules/student-memberships";
import { PaymentsDashboard } from "@/modules/payments";

interface Props {
  params: Promise<{
    disciplineId: string;
    schoolId: string;
    courseId: string;
    courseSeasonId: string;
  }>;
}

export default async function PaymentsPage({ params }: Props) {
  const { disciplineId, schoolId, courseId, courseSeasonId } = await params;

  const [courseSeasonResponse, membershipsResponse] = await Promise.all([
    getCourseSeasonById({ id: courseSeasonId }),
    getStudentMemberships({ courseSeasonId, per_page: "100" }),
  ]);

  if (membershipsResponse.error && membershipsResponse.statusCode === 401) {
    redirect("/login");
  }
  if (courseSeasonResponse.error) {
    return <ErrorPage message={courseSeasonResponse.message} />;
  }

  const courseSeason = courseSeasonResponse.data;
  const memberships = membershipsResponse.error
    ? []
    : membershipsResponse.data.data;

  return (
    <>
      <HeaderPage
        title={`Pagos · ${courseSeason.course.name}`}
        description="Procesa cobros y consulta el historial de pagos de la temporada"
        breadcrumb={[
          { label: "Gestión Equipos", href: `/` },
          {
            label: `Gestión de Temporadas - ${courseSeason.course.name}`,
            href: `/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`,
          },
          {
            label: `Membresías - ${courseSeason.course.name}`,
            href: `/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons/${courseSeasonId}/student-memberships`,
          },
          { label: `Pagos - ${courseSeason.season.name}` },
        ]}
      />

      <PaymentsDashboard memberships={memberships} courseSeason={courseSeason} />
    </>
  );
}
