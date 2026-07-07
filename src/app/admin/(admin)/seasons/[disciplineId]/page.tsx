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
  getDisciplinesOptions,
  getSeasons,
  GridCards,
  SelectDisciplineOptions,
  TableSeasons,
} from "@/modules/seasons";
import { Card } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Structure04FreeIcons } from "@hugeicons/core-free-icons";
import { getCurrentInstitutionId } from "@/lib/current-institution";
import { getInstitutions } from "@/modules/organizations";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    sortField?: "name" | "startDate" | "endDate" | "createdAt" | "updatedAt";
    orderBy?: "asc" | "desc";
  }>;
  params: Promise<{ disciplineId: string }>;
}
export default async function SeasonsPage({ searchParams, params }: Props) {
  const { search, page, per_page, sortField, orderBy } = await searchParams;
  const { disciplineId } = await params;
  const [seasonsResponse, disciplinesOptionsResponse] = await Promise.all([
    getSeasons({
      search,
      page,
      per_page,
      sortField,
      orderBy,
    }),
    getDisciplinesOptions(),
  ]);

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (seasonsResponse.error && seasonsResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (seasonsResponse.error) {
    return <ErrorPage message={seasonsResponse.message} />;
  }

  if (disciplinesOptionsResponse.error) {
    return <ErrorPage message={disciplinesOptionsResponse.message} />;
  }

  const [institutionsResponse] = await Promise.all([getInstitutions({})]);

  if (institutionsResponse.error || !institutionsResponse.data) {
    return <ErrorPage message={institutionsResponse.message} />;
  }
  const institution = institutionsResponse.data.data[0];

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
            urlBase="/admin/seasons"
            disciplineId={disciplineId}
          />
        </Card.Content>
      </Card>
      <HeaderPage
        title="Gestión de Temporadas"
        description="Administra las temporadas del club"
        action={
          <AddModal
            institutionId={institution.id}
            disciplineId={disciplineId}
          />
        }
      />
      {/* <!-- Search and Filter Bar (Tonal Architecture) --> */}
      <SectionFilters />
      {/* <!-- Main Member Table --> */}
      <TableSeasons
        seasons={seasonsResponse.data.data}
        institutionId={institution.id}
        disciplineId={disciplineId}
      />
      {/* <GridCards /> */}
      <PaginationSection
        totalPages={seasonsResponse.data.meta.totalPages}
        itemsPerPage={seasonsResponse.data.meta.itemsPerPage}
        totalItems={seasonsResponse.data.meta.totalItems}
      />
    </>
  );
}
