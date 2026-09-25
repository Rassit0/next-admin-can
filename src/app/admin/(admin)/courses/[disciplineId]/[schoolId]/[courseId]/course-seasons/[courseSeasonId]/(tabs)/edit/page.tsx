import {
  ButtonsSubmit,
  FormCourseSeason,
  getCategoriesByDisciplineOptions,
  getSeasonsByDisciplineOptions,
  getCourseSeasonById,
  getShiftsOptions,
} from "@/modules/course-seasons";
import { getCourseById } from "@/modules/courses";
import { ErrorPage, HeaderPage } from "@/ui";
import { resolvePageData } from "@/utils/resolvePageData";
import { Button } from "@heroui/react";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    disciplineId: string;
    schoolId: string;
    courseId: string;
    courseSeasonId: string;
  }>;
}

export default async function EditCourseSeasonPage({ params }: Props) {
  const { disciplineId, schoolId, courseId, courseSeasonId } = await params;
  const [
    courseResponse,
    categoriesOptions,
    seasonsOptions,
    courseSeasonResponse,
    shiftsOptions,
  ] = await resolvePageData([
    getCourseById({ id: courseId }),
    getCategoriesByDisciplineOptions(disciplineId),
    getSeasonsByDisciplineOptions(disciplineId),
    getCourseSeasonById({ id: courseSeasonId }),
    getShiftsOptions(),
  ]);

  return (
    <>
      <HeaderPage
        title={`Crear Oferta de Temporada - ${courseResponse.data.name}`}
        description="Formulario para la creación de una nueva oferta de temporada."
        action={
          <ButtonsSubmit
            cancelHref={`/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`}
            formId="form-edit-course-season"
          />
        }
        urlBase={`/admin/courses/${disciplineId}/${schoolId}`}
        breadcrumb={[
          { label: "Cursos", href: `/` },
          {
            label: `${courseResponse.data.name}`,
          },
        ]}
      />
      <FormCourseSeason
        formId="form-edit-course-season"
        courseSeason={courseSeasonResponse.data}
        course={courseResponse.data}
        categoriesOptions={categoriesOptions.data.data}
        seasonsOptions={seasonsOptions.data.data}
        shiftsOptions={shiftsOptions.data.data}
        urlRedirect={`/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`}
      />
    </>
  );
}
