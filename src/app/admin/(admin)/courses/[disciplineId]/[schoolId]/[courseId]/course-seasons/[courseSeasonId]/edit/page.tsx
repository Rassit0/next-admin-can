import {
  ButtonsSubmit,
  FormCourseSeason,
  getCategoriesByDisciplineOptions,
  getSeasonsByDisciplineOptions,
  getCourseSeasonById,
} from "@/modules/course-seasons";
import { getCourseById } from "@/modules/courses";
import { ErrorPage, HeaderPage } from "@/ui";
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
  ] = await Promise.all([
    getCourseById({ id: courseId }),
    getCategoriesByDisciplineOptions(disciplineId),
    getSeasonsByDisciplineOptions(disciplineId),
    getCourseSeasonById({ id: courseSeasonId }),
  ]);

  if (courseResponse.error && courseResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (courseResponse.error) {
    return (
      <ErrorPage
        message={courseResponse.message}
        path={{
          href: `/schools`,
          label: "Volver a la lista de schooles",
        }}
      />
    );
  }

  if (categoriesOptions.error) {
    return (
      <ErrorPage
        message={categoriesOptions.message}
        path={{
          href: `/schools/${courseResponse.data.school.id}/manage`,
          label: "Volver a la lista de escuelas",
        }}
      />
    );
  }

  if (seasonsOptions.error) {
    return (
      <ErrorPage
        message={seasonsOptions.message}
        path={{
          href: `/schools/${courseResponse.data.school.id}/manage`,
          label: "Volver a la lista de escuelas",
        }}
      />
    );
  }

  if (courseSeasonResponse.error) {
    return (
      <ErrorPage
        message={courseSeasonResponse.message}
        path={{
          href: `/schools/${courseResponse.data.school.id}/manage`,
          label: "Volver a la lista de escuelas",
        }}
      />
    );
  }
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
          { label: "Gestión Cursos", href: `/` },
          {
            label: `Gestión de Temporadas - ${courseResponse.data.name}`,
          },
        ]}
      />
      <FormCourseSeason
        formId="form-edit-course-season"
        courseSeason={courseSeasonResponse.data}
        course={courseResponse.data}
        categoriesOptions={categoriesOptions.data.data}
        seasonsOptions={seasonsOptions.data.data}
        urlRedirect={`/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`}
      />
    </>
  );
}
