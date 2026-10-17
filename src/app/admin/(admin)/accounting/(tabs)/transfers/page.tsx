import { Metadata } from "next";
import { getInternalTransfers } from "@/modules/internal-transfers/actions/get";
import { getFinancialAccounts } from "@/modules/financial-accounts/actions/get-all";
import { InternalTransfersClient } from "@/modules/internal-transfers/components/InternalTransfersClient";
import { ErrorPage, PaginationSection } from "@/ui";
import { resolvePageData } from "@/utils/resolvePageData";

export const metadata: Metadata = {
  title: "Transferencias Internas | Gestión CAN",
  description: "Historial de transferencias de fondos entre cuentas financieras.",
};

export default async function TransfersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    per_page?: string;
    sourceAccountId?: string;
    destinationAccountId?: string;
    startDate?: string;
    endDate?: string;
    start?: string;
    end?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const {
    page,
    per_page = "5",
    sourceAccountId,
    destinationAccountId,
    startDate,
    endDate,
    start,
    end,
  } = resolvedSearchParams;

  const [transfersRes, accountsRes] = await resolvePageData([
    getInternalTransfers({
      page,
      per_page,
      sourceAccountId,
      destinationAccountId,
      startDate: start || startDate,
      endDate: end || endDate,
    }),
    getFinancialAccounts(),
  ]);

  if (transfersRes.error) {
    return <ErrorPage message={transfersRes.message} />;
  }

  const { data, meta } = transfersRes.data!;
  const accounts = accountsRes.data || [];

  return (
    <>
      <InternalTransfersClient transfers={data} accounts={accounts} />

      <PaginationSection
        totalPages={meta.totalPages}
        itemsPerPage={meta.itemsPerPage}
        totalItems={meta.totalItems}
      />
    </>
  );
}
