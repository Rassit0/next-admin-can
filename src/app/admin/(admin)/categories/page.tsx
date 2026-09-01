import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { notFound, redirect } from "next/navigation";
import { TableCategories } from "@/modules/categories/components/table/Table";
import {
  AddModal,
  getCategories,
  getDisciplinesOptions,
} from "@/modules/categories";

import { resolvePageData } from "@/utils/resolvePageData";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
  }>;
}

export default async function DisciplinesPage({ searchParams }: Props) {
  const { search, page, per_page = "5" } = await searchParams;

  // Usamos resolvePageData para extraer la data directamente.
  // Si hay un error, Next.js capturará la excepción y mostrará `app/admin/error.tsx`.
  // Si es 401, nos redirigirá automáticamente a `/api/logout`.
  const [categoriesRes, disciplinesOptionsRes] = await resolvePageData([
    getCategories({ search, page, per_page }),
    getDisciplinesOptions(),
  ]);

  const categories = categoriesRes.data;
  const disciplinesOptions = disciplinesOptionsRes.data;

  return (
    <>
      {/* <!-- Header --> */}
      <HeaderPage
        title="Gestión de Categorías"
        description="Administra las categorías del club"
        action={
          <AddModal
            disciplinesOptions={disciplinesOptions.data}
            buttonFloatingMobile
          />
        }
      />
      {/* <!-- Search and Filter Bar (Tonal Architecture) --> */}
      <SectionFilters />
      {/* <!-- Main Member Table --> */}
      <TableCategories
        categories={categories.data}
        disciplinesOptions={disciplinesOptions.data}
      />
      <PaginationSection
        totalPages={categories.meta.totalPages}
        itemsPerPage={categories.meta.itemsPerPage}
        totalItems={categories.meta.totalItems}
      />
    </>
  );
}
