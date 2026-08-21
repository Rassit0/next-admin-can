import { ErrorPage, HeaderPage } from "@/ui";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCourseSeasonById } from "@/modules/course-seasons";
import { CourseSeasonPaymentsMatrix } from "@/modules/reports/components/CourseSeasonPaymentsMatrix";

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

  const courseSeasonResponse = await getCourseSeasonById({
    id: courseSeasonId,
  });

  if (courseSeasonResponse.error) {
    return (
      <ErrorPage
        message={courseSeasonResponse.message || "Error loading course season"}
      />
    );
  }

  const basePath = `/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons/${courseSeasonId}`;

  return (
    <>
      <HeaderPage
        title={`Pagos - ${courseSeasonResponse.data.course.name} - ${courseSeasonResponse.data.season.name}`}
        description="Administra los pagos de membresías y sus estados"
        breadcrumb={[
          { label: "Cursos", href: `/` },
          {
            label: `${courseSeasonResponse.data.course.name}`,
            href: `/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`,
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
        <CourseSeasonPaymentsMatrix shifts={courseSeasonResponse.data.shifts} />
      </div>
    </>
  );
}
