import { getAccountingDashboardSummary } from "@/modules/accounting-dashboard/actions/get";
import { ErrorPage } from "@/ui";
import { AccountingKpiCards } from "@/modules/account-charges/components/dashboard/AccountingKpiCards";
import { AccountingAlerts } from "@/modules/account-charges/components/dashboard/AccountingAlerts";
import { AccountingCashFlowChart } from "@/modules/account-charges/components/dashboard/AccountingCashFlowChart";
import { AccountingExpensesChart } from "@/modules/account-charges/components/dashboard/AccountingExpensesChart";

export default async function AccountingDashboardPage() {
  const summaryRes = await getAccountingDashboardSummary();

  if (summaryRes.error || !summaryRes.data) {
    return <ErrorPage message={summaryRes.message} />;
  }

  const { kpis, alerts, cashFlow, expensesByCategory } = summaryRes.data;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Centro de Control Financiero</h1>
        <p className="text-default-500 text-sm mt-1">Resumen del estado actual y acciones requeridas.</p>
      </div>

      <AccountingKpiCards data={kpis} />

      <AccountingAlerts 
        alerts={alerts} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <AccountingCashFlowChart data={cashFlow} />
        <AccountingExpensesChart data={expensesByCategory} />
      </div>
    </div>
  );
}
