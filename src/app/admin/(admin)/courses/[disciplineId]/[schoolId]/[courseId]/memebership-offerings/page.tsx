import { getSchoolById } from "@/modules/schools";
import {
  getCourseSeasons,
  GridCards,
  StatusCourseSeason,
  TabsNavigation,
} from "@/modules/course-membership-offerings";
import { getCourseById } from "@/modules/courses";
import {
  ButtonAdd,
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
    status?: StatusCourseSeason;
  }>;
  params: Promise<{ disciplineId: string; schoolId: string; courseId: string }>;
}

export default async function BidManagementPage({
  searchParams,
  params,
}: Props) {
  const [{ search, page, per_page, status }, { disciplineId, schoolId, courseId }] =
    await Promise.all([searchParams, params]);

  const [courseSeasonsResponse, courseResponse, schoolResponse] = await Promise.all([
    getCourseSeasons({ search, page, per_page, courseId, status }),
    getCourseById({ id: courseId }),
    getSchoolById({ id: schoolId }),
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
          label: "Volver a la lista de equipos",
        }}
      />
    );
  }

  if (schoolResponse.error && schoolResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (schoolResponse.error) {
    return (
      <ErrorPage
        message={schoolResponse.message}
        path={{
          href: `/schools`,
          label: "Volver a la lista de schooles",
        }}
      />
    );
  }
  return (
    <>
      <HeaderPage
        title={`Gestión de Temporadas - ${courseResponse.data.name}`}
        description="Gestión integral de las temporadas del equipo."
        action={
          <ButtonAdd
            href={`/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons/add`}
            label="Crear Nueva Temporada"
          />
        }
        urlBase={`/admin/courses/${disciplineId}/${schoolId}`}
        breadcrumb={[
          { label: "Equipos", href: `/` },
          {
            label: `${courseResponse.data.name}`,
          },
        ]}
      />
      <TabsNavigation />
      <SectionFilters />
      <GridCards courseSeasons={courseSeasonsResponse.data.data} />
      <PaginationSection
        totalPages={courseSeasonsResponse.data.meta.totalPages}
        itemsPerPage={courseSeasonsResponse.data.meta.itemsPerPage}
        totalItems={courseSeasonsResponse.data.meta.totalItems}
      />
    </>
  );
}
