import { ErrorPage } from "@/ui";
import { getCourseSeasonById } from "@/modules/course-seasons";
import { CourseSeasonPaymentsMatrix } from "@/modules/reports/components/CourseSeasonPaymentsMatrix";
import { Card } from "@heroui/react";
import { resolvePageData } from "@/utils/resolvePageData";

interface Props {
  params: Promise<{
    courseSeasonId: string;
  }>;
}

export default async function PaymentsPage({ params }: Props) {
  const { courseSeasonId } = await params;

  const [courseSeasonResponse] = await resolvePageData([
    getCourseSeasonById({ id: courseSeasonId })
  ]);

  if (courseSeasonResponse.error || !courseSeasonResponse.data) {
    return (
      <ErrorPage
        message={courseSeasonResponse.message || "Error loading course season"}
      />
    );
  }

  return (
    <Card className="flex-1 rounded-t-none bg-surface p-1 shadow-sm md:p-4">
      <Card.Header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between w-full px-2">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">Control de Pagos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Matriz de control de pagos para esta temporada.
          </p>
        </div>
      </Card.Header>

      <Card.Content className="px-2 mt-4">
        <CourseSeasonPaymentsMatrix shifts={courseSeasonResponse.data.shifts} />
      </Card.Content>
    </Card>
  );
}
