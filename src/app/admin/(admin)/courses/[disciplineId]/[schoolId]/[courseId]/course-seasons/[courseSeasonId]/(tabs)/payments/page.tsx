import { ErrorPage } from "@/ui";
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
    <div className="mt-2 flex flex-col gap-6">
      <PaymentsDashboard memberships={memberships} courseSeason={courseSeason} />
    </div>
  );
}
