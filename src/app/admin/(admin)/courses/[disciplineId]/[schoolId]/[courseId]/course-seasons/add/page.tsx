import {
  ButtonsSubmit,
  FormCourseSeason,
  getCategoriesByDisciplineOptions,
  getSeasonsByDisciplineOptions,
} from "@/modules/course-seasons";
import { getCourseById } from "@/modules/courses";
import { ErrorPage, HeaderPage } from "@/ui";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ disciplineId: string; schoolId: string; courseId: string }>;
}

export default async function AddCourseSeasonPage({ params }: Props) {
  const { disciplineId, schoolId, courseId } = await params;
  const [courseResponse, categoriesOptions, seasonsOptions] = await Promise.all(
    [
      getCourseById({ id: courseId }),
      getCategoriesByDisciplineOptions(disciplineId),
      getSeasonsByDisciplineOptions(disciplineId),
    ],
  );

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
          label: "Volver a la lista de Escuelas",
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
          label: "Volver a la lista de Cursos",
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
          label: "Volver a la lista de Cursos",
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
          <>
            <ButtonsSubmit
              cancelHref={`/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`}
              formId="form-course-season"
            />
          </>
        }
        urlBase={`/admin/courses/${disciplineId}/${schoolId}`}
        breadcrumb={[
          { label: "Cursos", href: `/` },
          {
            label: `${courseResponse.data.name}`,
            href: `${courseId}/course-seasons`,
          },
          {
            label: `Crear Oferta de Temporada`,
          },
        ]}
      />
      <FormCourseSeason
        formId="form-course-season"
        course={courseResponse.data}
        categoriesOptions={categoriesOptions.data.data}
        seasonsOptions={seasonsOptions.data.data}
        urlRedirect={`/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`}
      />
    </>
  );
}
