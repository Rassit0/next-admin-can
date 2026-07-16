import { EditModal, getSchoolById, ISchool } from "@/modules/schools";
import {
  AddModal,
  FiltersBar,
  MetricsPanel,
  GridCards,
  getSchoolsOptions,
  SelectSchoolOptions,
  getDisciplinesOptions,
  SelectDisciplineOptions,
} from "@/modules/courses";
import { getCourses } from "@/modules/courses";
import { TableCourses } from "@/modules/courses/components/table/Table";
import { ServiceResponse } from "@/types/api";
import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { Card, Separator, Surface } from "@heroui/react";
import { FootballIcon, Structure04FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
  }>;
  params: Promise<{ disciplineId: string; schoolId: string }>;
}

export default async function CoursesPage({ searchParams, params }: Props) {
  const { search, page, per_page } = await searchParams;
  const { disciplineId, schoolId } = await params;

  const [
    coursesResponse,
    schoolsOptionsResponse,
    disciplinesOptionsResponse,
    schoolResponse,
  ] = await Promise.all([
    getCourses({
      search,
      page,
      per_page,
      schoolId,
    }),
    getSchoolsOptions(disciplineId),
    getDisciplinesOptions(),
    getSchoolById({ id: schoolId }),
  ]);

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (coursesResponse.error && coursesResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (coursesResponse.error) {
    return (
      <ErrorPage
        message={coursesResponse.message}
        path={{ href: "/schools", label: "Volver a la lista de Escuelas" }}
      />
    );
  }

  if (schoolResponse?.error && schoolResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (schoolResponse?.error) {
    return (
      <ErrorPage
        message={schoolResponse.message}
        path={{ href: "/schools", label: "Volver a la lista de Escuelas" }}
      />
    );
  }

  if (
    schoolsOptionsResponse.error &&
    schoolsOptionsResponse.statusCode === 401
  ) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (schoolsOptionsResponse.error) {
    return (
      <ErrorPage
        message={schoolsOptionsResponse.message}
        path={{ href: "/courses", label: "Volver a la lista de Cursos" }}
      />
    );
  }

  if (
    disciplinesOptionsResponse.error &&
    disciplinesOptionsResponse.statusCode === 401
  ) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (disciplinesOptionsResponse.error) {
    return (
      <ErrorPage
        message={disciplinesOptionsResponse.message}
        path={{ href: "/courses", label: "Volver a la lista de Cursos" }}
      />
    );
  }

  return (
    <>
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Structure04FreeIcons} />
            <Card.Title className="text-xl font-bold">
              Seleccione una Disciplina
            </Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <SelectDisciplineOptions
            disciplineOptions={disciplinesOptionsResponse.data.data}
            urlBase={`/admin/courses`}
            disciplineId={disciplineId}
          />
        </Card.Content>
      </Card>
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={FootballIcon} />
            <Card.Title className="text-xl font-bold">
              Seleccione un School
            </Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <SelectSchoolOptions
            schoolOptions={schoolsOptionsResponse.data.data}
            urlBase={`/admin/courses/${disciplineId}`}
            schoolId={schoolId}
          />
        </Card.Content>
      </Card>
      {/* <!-- Breadcrumbs & Header --> */}
      <div>
        <HeaderPage
          title={`Cursos de "${schoolResponse.data.name}"`}
          description={`Gestión integral de los cursos.`}
          action={schoolId ? <AddModal schoolId={schoolId} /> : null}
          urlBase={`/admin/courses/${schoolId}`}
        />
        {/* <!-- Metrics Panel: Asymmetric Bento Grid --> */}
        {/* <MetricsPanel /> */}

        {/* <Separator className="md:hidden my-4" /> */}

        <Surface className="rounded-xl p-2">
          <div className="flex flex-col gap-2">
            {/* <!-- Search and Filter Bar (Tonal Architecture) --> */}
            <SectionFilters />
            {/* <!-- Grid --> */}
            <TableCourses
              courses={coursesResponse.data.data}
              urlBase={`/admin/courses/${disciplineId}/${schoolId}`}
            />
            <PaginationSection
              totalPages={coursesResponse.data.meta.totalPages}
              itemsPerPage={coursesResponse.data.meta.itemsPerPage}
              totalItems={coursesResponse.data.meta.totalItems}
            />
          </div>
        </Surface>
      </div>
    </>
  );
}
