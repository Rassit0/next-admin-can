import { ErrorPage, PaginationSection, HeaderPage, SectionFilters } from "@/ui";
import { Card } from "@heroui/react";
import { Metadata } from "next";
import { getCharges, TableCharges } from "@/modules/charge-transactions";

export const metadata: Metadata = {
  title: "Cuotas Estudiantiles | Gestión CAN",
  description: "Listado de cuotas estudiantiles y colegiaturas (CourseSeason)",
};

export default async function StudentChargesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    per_page?: string;
    status?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search || "";
  const page = resolvedSearchParams?.page || "1";
  const per_page = resolvedSearchParams?.per_page || "10";
  const status = resolvedSearchParams?.status;

  // We filter specifically by type = STUDENT_CHARGE
  const res = await getCharges({
    search,
    page,
    per_page,
    status,
    type: "STUDENT_CHARGE",
  });

  if (res.error) {
    return <ErrorPage message={res.message} />;
  }

  const { data: chargesData, meta } = res.data!;

  return (
    <>
      <div className="flex flex-col gap-6 mt-2">
        <Card className="shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border">
          <HeaderPage
            title="Cuotas Estudiantiles"
            description="Gestiona las cuotas y cobros de estudiantes (CourseSeason)."
            showButtonBack={false}
          />
          <SectionFilters />
          
          <TableCharges 
            charges={chargesData} 
            showPerson={true} 
          />
          
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
