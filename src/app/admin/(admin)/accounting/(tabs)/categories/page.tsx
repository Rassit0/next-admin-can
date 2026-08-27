import { getAccountCategories, AccountCategoriesClient, CreateCategoryButton } from "@/modules/account-categories";
import { ErrorPage, PaginationSection, HeaderPage, SectionFilters } from "@/ui";
import { Card } from "@heroui/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorías Contables | Gestión CAN",
  description: "Categorías para organizar los ingresos y egresos de la institución",
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    per_page?: string;
    type?: string;
    sortField?: string;
    orderBy?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search || "";
  const page = resolvedSearchParams?.page || "1";
  const per_page = resolvedSearchParams?.per_page || "10";
  const type = resolvedSearchParams?.type;
  const sortField = resolvedSearchParams?.sortField;
  const orderBy = resolvedSearchParams?.orderBy;

  const res = await getAccountCategories({
    search,
    page,
    per_page,
    type,
    sortField,
    orderBy,
  });

  if (res.error) {
    return <ErrorPage message={res.message} />;
  }

  const { data, meta } = res.data!;

  return (
    <>
      <div className="flex flex-col gap-6 mt-2">
        <Card className="shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border">
          <HeaderPage
            title="Categorías Contables"
            description="Administra las categorías utilizadas para agrupar y organizar el flujo de caja."
            showButtonBack={false}
            action={<CreateCategoryButton />}
          />
          <SectionFilters />
          
          <AccountCategoriesClient categories={data} />
          
          <PaginationSection 
            totalPages={meta.totalPages} 
            itemsPerPage={meta.itemsPerPage} 
            totalItems={meta.totalItems} 
          />
        </Card>
      </div>
    </>
  );
}
