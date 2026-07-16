import {
  ErrorPage,
  HeaderPage,
  PaginationSection,
  SectionFilters,
  TabsTypeFilter,
} from "@/ui";
import { redirect } from "next/navigation";
import {
  AddModal,
  getSchools,
  getDisciplinesOptions,
  SelectDisciplineOptions,
} from "@/modules/schools";
import { TableSchools } from "@/modules/schools/components/table/Table";
import { Card } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Structure04FreeIcons } from "@hugeicons/core-free-icons";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    sortField?: string;
    orderBy?: "asc" | "desc";
  }>;
  params: Promise<{ disciplineId: string }>;
}
export default async function SchoolsPage({ searchParams, params }: Props) {
  const { search, page, per_page, sortField, orderBy } = await searchParams;
  const { disciplineId } = await params;
  const [schoolsResponse, disciplinesOptionsResponse] = await Promise.all([
    getSchools({
      search,
      page,
      per_page,
      sortField,
      orderBy,
      disciplineId,
    }),
    getDisciplinesOptions(),
  ]);

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (schoolsResponse.error && schoolsResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (schoolsResponse.error) {
    return (
      <ErrorPage
        message={schoolsResponse.message}
        path={{ href: "/schools", label: "Recargar la lista de schooles" }}
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
    return <ErrorPage message={disciplinesOptionsResponse.message} />;
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
            urlBase="/admin/schools"
            disciplineId={disciplineId}
          />
        </Card.Content>
      </Card>
      <HeaderPage
        title={`Gestión de Schooles de "${disciplinesOptionsResponse.data.data.find((d) => d.id === disciplineId)?.name}"`}
        description="Administra los schooles deportivos"
        action={<AddModal disciplineId={disciplineId} />}
      />
      {/* <!-- Search and Filter Bar (Tonal Architecture) --> */}
      <SectionFilters />
      {/* <!-- Main Member Table --> */}
      <TableSchools schools={schoolsResponse.data.data} disciplineId={disciplineId} />
      <PaginationSection
        totalPages={schoolsResponse.data.meta.totalPages}
        itemsPerPage={schoolsResponse.data.meta.itemsPerPage}
        totalItems={schoolsResponse.data.meta.totalItems}
      />
    </>
  );
}
