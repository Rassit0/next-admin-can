import { getSchoolById } from "@/modules/schools";
import { getPaymentPlans } from "@/modules/payment-plans";
import { getStudents } from "@/modules/students";

import {
  ButtonAdd,
  Gender,
  getCategoriesByDisciplineOptions,
  getSeasonsByDisciplineOptions,
  getCourseSeasons,
  GridCards,
  ListCards,
  TableCourseSeasons,
} from "@/modules/course-seasons";
import { getCourseById } from "@/modules/courses";
import {
  ErrorPage,
  HeaderPage,
  PaginationSection,
  SectionFilters,
  TabsTypeFilter,
} from "@/ui";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    gender?: Gender;
  }>;
  params: Promise<{ disciplineId: string; schoolId: string; courseId: string }>;
}

export default async function CourseSeasonsPage({
  searchParams,
  params,
}: Props) {
  const [
    { search, page, per_page, gender },
    { disciplineId, schoolId, courseId },
  ] = await Promise.all([searchParams, params]);

  const [
    courseSeasonsResponse,
    courseResponse,
    categoriesOptions,
    seasonsOptions,
  ] = await Promise.all([
    getCourseSeasons({ search, page, per_page, courseId, gender }),
    getCourseById({ id: courseId }),
    getCategoriesByDisciplineOptions(disciplineId),
    getSeasonsByDisciplineOptions(disciplineId),
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
          label: "Volver a la lista de Escuelas",
        }}
      />
    );
  }

  if (courseSeasonsResponse.error && courseSeasonsResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (courseSeasonsResponse.error) {
    return (
      <ErrorPage
        message={courseSeasonsResponse.message}
        path={{
          href: `/schools/${courseResponse.data.school.id}/manage`,
          label: "Volver a la lista de Cursos",
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
        title={`Gestión de Temporadas - ${courseResponse.data.name}`}
        description="Gestión integral de las temporadas del curso."
        action={
          <>
            <ButtonAdd
              urlBase={`/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`}
              buttonFloatingMobile
            />
          </>
        }
        urlBase={`/admin/courses/${disciplineId}/${schoolId}`}
        breadcrumb={[
          { label: "Gestión Cursos", href: `/` },
          {
            label: `Temporadas`,
          },
        ]}
      />
      {/* <TabsNavigation /> */}
      <SectionFilters />
      {/* <TableCourseSeasons
        courseSeasons={courseSeasonsResponse.data.data}
        urlBase={`/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`}
      /> */}
      <ListCards
        courseSeasons={courseSeasonsResponse.data.data}
        urlBase={`/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`}
      />
      {/* <GridCards courseSeasons={courseSeasonsResponse.data.data} /> */}
      <PaginationSection
        totalPages={courseSeasonsResponse.data.meta.totalPages}
        itemsPerPage={courseSeasonsResponse.data.meta.itemsPerPage}
        totalItems={courseSeasonsResponse.data.meta.totalItems}
      />
    </>
  );
}
