import { Metadata } from "next";
import { getTransactions, getPaymentMethods } from "@/modules/accounting-cash-flow/actions/get";
import { CashFlowView } from "@/modules/accounting-cash-flow/components/CashFlowView";
import { getAccountCategories } from "@/modules/account-categories/actions/get";
import { getFinancialAccounts } from "@/modules/financial-accounts/actions/get-all";
import { resolvePageData } from "@/utils/resolvePageData";

export const metadata: Metadata = {
  title: "Flujo de Caja | Sistema de Gestión CAN",
  description: "Historial de movimientos directos de ingresos y egresos.",
};

export default async function QuickOperationsCashFlowPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const resolvedSearchParams = await searchParams;
  const {
    search,
    page,
    per_page = "5",
    sortField = "transactionDate",
    orderBy = "desc",
    type,
    paymentMethods,
    financialAccountIds,
    start,
    end,
    origin,
    categoryId,
  } = resolvedSearchParams;

  const [response, categoriesRes, financialAccountsRes, paymentMethodsRes] = await resolvePageData(
    [
      getTransactions({
        search,
        page,
        per_page,
        sortField,
        orderBy,
        type,
        paymentMethods,
        financialAccountIds,
        startDate: start,
        endDate: end,
        origin,
        categoryId,
      }),
      getAccountCategories({ per_page: "100" }),
      getFinancialAccounts(),
      getPaymentMethods(),
    ],
  );

  const financialAccounts = financialAccountsRes.data || [];

  return (
    <CashFlowView
      response={response.data!}
      categories={categoriesRes.data?.data || []}
      financialAccounts={financialAccounts || []}
      allPaymentMethods={paymentMethodsRes.data?.data || []}
    />
  );
}
