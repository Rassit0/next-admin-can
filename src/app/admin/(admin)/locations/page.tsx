import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { notFound, redirect } from "next/navigation";
import { AddModal, getLocations, TableLocations } from "@/modules/locations";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
  }>;
}
export default async function LocationsPage({ searchParams }: Props) {
  const { search, page, per_page } = await searchParams;
  const result = await getLocations({
    search,
    page,
    per_page,
  });

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (result.error && result.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (result.error) {
    return <ErrorPage message={result.message} />;
  }

  return (
    <>
      {/* <!-- Header --> */}
      <HeaderPage
        title="Gestión de Instalaciones"
        description="Administra las instalaciones del club"
        action={<AddModal />}
      />
      {/* <!-- Search and Filter Bar (Tonal Architecture) --> */}
      <SectionFilters />
      {/* <!-- Main Member Table --> */}
      <TableLocations locations={result.data.data} />
      <PaginationSection
        totalPages={result.data.meta.totalPages}
        itemsPerPage={result.data.meta.itemsPerPage}
        totalItems={result.data.meta.totalItems}
      />
    </>
  );
}
