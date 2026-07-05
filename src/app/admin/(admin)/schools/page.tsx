import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { redirect } from "next/navigation";
import { AddModal, getClubs, getDisciplinesOptions } from "@/modules/clubs";
import { TableClubs } from "@/modules/clubs/components/table/Table";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    sortField?: string;
    orderBy?: "asc" | "desc";
  }>;
}
export default async function SchoolsPage({ searchParams }: Props) {
  const { search, page, per_page, sortField, orderBy } = await searchParams;
  const [clubsResponse, disciplinesOptionsResponse] = await Promise.all([
    getClubs({
      search,
      page,
      per_page,
      sortField,
      orderBy,
    }),
    getDisciplinesOptions(),
  ]);

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (clubsResponse.error && clubsResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (clubsResponse.error) {
    return <ErrorPage message={clubsResponse.message} />;
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
      {/* <!-- Header --> */}
      <HeaderPage
        title="Gestión de Escuelas"
        description="Administra las escuelas deportivas del país"
      />
      {/* <!-- Search and Filter Bar (Tonal Architecture) --> */}
      <SectionFilters />
      {/* <!-- Main Member Table --> */}

      <PaginationSection
        totalPages={clubsResponse.data.meta.totalPages}
        itemsPerPage={clubsResponse.data.meta.itemsPerPage}
        totalItems={clubsResponse.data.meta.totalItems}
      />
    </>
  );
}
