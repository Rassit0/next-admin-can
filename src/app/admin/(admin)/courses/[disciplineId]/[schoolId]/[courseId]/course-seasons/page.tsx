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
import { resolvePageData } from "@/utils/resolvePageData";

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
    { search, page, per_page = "5", gender },
    { disciplineId, schoolId, courseId },
  ] = await Promise.all([searchParams, params]);

  const [courseSeasonsResponse, courseResponse] = await resolvePageData([
    getCourseSeasons({ search, page, per_page, courseId, gender }),
    getCourseById({ id: courseId }),
  ]);

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
          { label: "Cursos", href: `/` },
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
