import { getAccountCharges, AccountChargesClient, CreateChargeButton } from "@/modules/account-charges";
import { ErrorPage, PaginationSection, HeaderPage, SectionFilters } from "@/ui";
import { Card } from "@heroui/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cuentas por Cobrar | Gestión CAN",
  description: "Cuentas administrativas por cobrar del club",
};

export default async function ReceivablesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    per_page?: string;
    status?: string | string[];
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.search || "";
  const page = resolvedSearchParams?.page || "1";
  const per_page = resolvedSearchParams?.per_page || "10";
  const status = resolvedSearchParams?.status || ["PENDING", "PARTIAL"];

  const res = await getAccountCharges({
    search,
    page,
    per_page,
    direction: "RECEIVABLE",
    status,
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
            title="Listado de Cuentas por Cobrar"
            description="Gestiona las cuentas administrativas a favor de la institución."
            showButtonBack={false}
            action={<CreateChargeButton direction="RECEIVABLE" />}
          />
          <SectionFilters />
          
          <AccountChargesClient charges={data} direction="RECEIVABLE" />
          
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
