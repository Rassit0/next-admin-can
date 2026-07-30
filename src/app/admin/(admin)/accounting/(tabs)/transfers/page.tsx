import { getInternalTransfers } from "@/modules/internal-transfers/actions/get";
import { getFinancialAccounts } from "@/modules/financial-accounts/actions/get-all";
import { InternalTransfersClient } from "@/modules/internal-transfers/components/InternalTransfersClient";
import { ErrorPage, PaginationSection, HeaderPage, SectionFilters } from "@/ui";
import { resolvePageData } from "@/utils/resolvePageData";

export default async function TransfersPage({
  searchParams,
}: {
  searchParams: { page?: string; per_page?: string; sourceAccountId?: string; destinationAccountId?: string; startDate?: string; endDate?: string; };
}) {
  const { page, per_page, sourceAccountId, destinationAccountId, startDate, endDate } = searchParams;

  const [transfersRes, accountsRes] = await resolvePageData([
    getInternalTransfers({ page, per_page, sourceAccountId, destinationAccountId, startDate, endDate }),
    getFinancialAccounts(),
  ]);

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
