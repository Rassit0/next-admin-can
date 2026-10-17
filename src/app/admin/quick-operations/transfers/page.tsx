import { Metadata } from "next";
import { getInternalTransfers } from "@/modules/internal-transfers/actions/get";
import { getFinancialAccounts } from "@/modules/financial-accounts/actions/get-all";
import { InternalTransfersClient } from "@/modules/internal-transfers/components/InternalTransfersClient";
import { PaginationSection, ModuleGuard } from "@/ui";
import { resolvePageData } from "@/utils/resolvePageData";

export const metadata: Metadata = {
  title: "Transferencias Internas | Operaciones Rápidas",
  description: "Gestión de transferencias entre cuentas financieras.",
};

export default async function QuickOperationsTransfersPage({
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

  const { data, meta } = transfersRes.data!;
  const accounts = accountsRes.data || [];

  return (
    <ModuleGuard moduleId="quick-operations" childRouteId="quick-ops-transfers">
      <InternalTransfersClient transfers={data} accounts={accounts} />

      <PaginationSection
        totalPages={meta.totalPages}
        itemsPerPage={meta.itemsPerPage}
        totalItems={meta.totalItems}
      />
    </ModuleGuard>
  );
}
