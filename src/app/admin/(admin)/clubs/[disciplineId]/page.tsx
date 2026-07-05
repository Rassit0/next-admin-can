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
  getClubs,
  getDisciplinesOptions,
  SelectDisciplineOptions,
} from "@/modules/clubs";
import { TableClubs } from "@/modules/clubs/components/table/Table";
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
export default async function ClubsPage({ searchParams, params }: Props) {
  const { search, page, per_page, sortField, orderBy } = await searchParams;
  const { disciplineId } = await params;
  const [clubsResponse, disciplinesOptionsResponse] = await Promise.all([
    getClubs({
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
  if (clubsResponse.error && clubsResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (clubsResponse.error) {
    return (
      <ErrorPage
        message={clubsResponse.message}
        path={{ href: "/clubs", label: "Recargar la lista de clubes" }}
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
            urlBase="/admin/clubs"
            disciplineId={disciplineId}
          />
        </Card.Content>
      </Card>
      <HeaderPage
        title={`Gestión de Clubes de "${disciplinesOptionsResponse.data.data.find((d) => d.id === disciplineId)?.name}"`}
        description="Administra los clubes deportivos"
        action={<AddModal disciplineId={disciplineId} />}
      />
      {/* <!-- Search and Filter Bar (Tonal Architecture) --> */}
      <SectionFilters />
      {/* <!-- Main Member Table --> */}
      <TableClubs clubs={clubsResponse.data.data} disciplineId={disciplineId} />
      <PaginationSection
        totalPages={clubsResponse.data.meta.totalPages}
        itemsPerPage={clubsResponse.data.meta.itemsPerPage}
        totalItems={clubsResponse.data.meta.totalItems}
      />
    </>
  );
}
