import { PaginationSection, SectionFilters, DateRangeFilter } from "@/ui";
import { ITransactionsResponse } from "../interfaces/transaction.interface";
import { CashFlowTable } from "./table/CashFlowTable";
import { FinancialAccount } from "@/modules/financial-accounts/interfaces/financial-account.interface";
import { CashFlowActions } from "./CashFlowActions";
import { CashFlowSelectFilters } from "./CashFlowSelectFilters";

interface Props {
  response: ITransactionsResponse;
  categories: Array<{ id: string; name: string; type: string }>;
  financialAccounts: FinancialAccount[];
  allPaymentMethods: string[];
}

export const CashFlowView = ({
  response,
  categories,
  financialAccounts,
  allPaymentMethods,
}: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <SectionFilters
        searchPlaceholder="Buscar por nombre, apellidos o recibo..."
        actions={
          <CashFlowActions
            categories={categories}
            financialAccounts={financialAccounts}
          />
        }
      >
        <DateRangeFilter />
        <CashFlowSelectFilters
          financialAccounts={financialAccounts}
          allPaymentMethods={allPaymentMethods}
        />
      </SectionFilters>

      <CashFlowTable transactions={response.data} />
      {response.meta.totalPages > 1 && (
        <PaginationSection
          totalPages={response.meta.totalPages}
          itemsPerPage={response.meta.itemsPerPage}
          totalItems={response.meta.totalItems}
        />
      )}
    </div>
  );
};
