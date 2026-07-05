import { AddModal, DisciplineCard } from "@/modules/disciplines";
import { HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { getDisciplines } from "@/modules/disciplines";
import { notFound, redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
  }>;
}
export default async function DisciplinesPage({ searchParams }: Props) {
  const { search, page, per_page } = await searchParams;
  const result = await getDisciplines({
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
    notFound();
  }

  return (
    <>
      {/* <!-- Header --> */}
      <HeaderPage
        title="Gestión de Disciplinas"
        description="Administra los deportes y actividades del club"
        action={<AddModal />}
      />
      {/* <!-- Search and Filter Bar (Tonal Architecture) --> */}
      <SectionFilters />
      {/* <!-- Disciplines Grid --> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* <!-- Cards Dinamicas --> */}
        {result.data.data.map((discipline) => (
          <DisciplineCard key={discipline.id} discipline={discipline} />
        ))}
      </div>
      <PaginationSection
        totalPages={result.data.meta.totalPages}
        itemsPerPage={result.data.meta.itemsPerPage}
        totalItems={result.data.meta.totalItems}
      />
    </>
  );
}
