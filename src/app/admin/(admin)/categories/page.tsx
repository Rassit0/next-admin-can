import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { notFound, redirect } from "next/navigation";
import { TableCategories } from "@/modules/categories/components/table/Table";
import {
  AddModal,
  getCategories,
  getDisciplinesOptions,
} from "@/modules/categories";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
  }>;
}
export default async function DisciplinesPage({ searchParams }: Props) {
  const { search, page, per_page } = await searchParams;
  const [categoriesResponse, disciplinesOptionsResponse] = await Promise.all([
    getCategories({
      search,
      page,
      per_page,
    }),
    getDisciplinesOptions(),
  ]);

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (categoriesResponse.error && categoriesResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (categoriesResponse.error) {
    return <ErrorPage message={categoriesResponse.message} />;
  }

  if (
    disciplinesOptionsResponse.error &&
    disciplinesOptionsResponse.statusCode === 401
  ) {
    redirect("/login");
  }

  if (disciplinesOptionsResponse.error) {
    return <ErrorPage message={disciplinesOptionsResponse.message} />;
  }

  return (
    <>
      {/* <!-- Header --> */}
      <HeaderPage
        title="Gestión de Categorías"
        description="Administra las categorías del club"
        action={
          <AddModal
            disciplinesOptions={disciplinesOptionsResponse.data.data}
            buttonFloatingMobile
          />
        }
      />
      {/* <!-- Search and Filter Bar (Tonal Architecture) --> */}
      <SectionFilters />
      {/* <!-- Main Member Table --> */}
      <TableCategories
        categories={categoriesResponse.data.data}
        disciplinesOptions={disciplinesOptionsResponse.data.data}
      />
      <PaginationSection
        totalPages={categoriesResponse.data.meta.totalPages}
        itemsPerPage={categoriesResponse.data.meta.itemsPerPage}
        totalItems={categoriesResponse.data.meta.totalItems}
      />
    </>
  );
}
