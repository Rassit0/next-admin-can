import {
  AddModal,
  FiltersBar,
  MetricsPanel,
  GridCards,
  getSchoolsOptions,
  SelectSchoolOptions,
  SelectDisciplineOptions,
  getDisciplinesOptions,
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
  params: Promise<{ disciplineId: string }>;
}

export default async function CoursesPage({ searchParams, params }: Props) {
  const { search, page, per_page } = await searchParams;
  const { disciplineId } = await params;

  const [schoolsOptionsResponse, disciplinesOptionsResponse] =
    await Promise.all([
      getSchoolsOptions(disciplineId),
      getDisciplinesOptions(),
    ]);

  // 1. Manejo de error específico (Ej: 401 no autorizado)
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
        path={{ href: "/schools", label: "Volver a la lista de Escuelas" }}
      />
    );
  }

  // 1. Manejo de error específico (Ej: 401 no autorizado)
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
        path={{ href: "/schools", label: "Volver a la lista de Escuelas" }}
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
            urlBase="/admin/courses"
            disciplineId={disciplineId}
          />
        </Card.Content>
      </Card>
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={FootballIcon} />
            <Card.Title className="text-xl font-bold">
              Seleccione una Escuela
            </Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <SelectSchoolOptions
            schoolOptions={schoolsOptionsResponse.data.data}
            urlBase={`/admin/courses/${disciplineId}`}
          />
        </Card.Content>
      </Card>
    </>
  );
}
