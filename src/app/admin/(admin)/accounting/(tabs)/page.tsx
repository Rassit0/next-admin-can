import { getAccountingDashboardSummary } from "@/modules/accounting-dashboard/actions/get";
import { ErrorPage, InfoTooltip, DateRangeFilter } from "@/ui";
import { AccountingKpiCards } from "@/modules/account-charges/components/dashboard/AccountingKpiCards";
import { AccountingAlerts } from "@/modules/account-charges/components/dashboard/AccountingAlerts";
import { AccountingCashFlowChart } from "@/modules/account-charges/components/dashboard/AccountingCashFlowChart";
import { AccountingExpensesChart } from "@/modules/account-charges/components/dashboard/AccountingExpensesChart";
import { AccountingBalancesCard } from "@/modules/account-charges/components/dashboard/AccountingBalancesCard";

interface Props {
  searchParams: Promise<{ start?: string; end?: string }>;
}

export default async function AccountingDashboardPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const summaryRes = await getAccountingDashboardSummary({ 
    start: resolvedSearchParams.start, 
    end: resolvedSearchParams.end 
  });

  if (summaryRes.error || !summaryRes.data) {
    return <ErrorPage message={summaryRes.message} />;
  }

  const { kpis, alerts, cashFlow, expensesByCategory, accounts } = summaryRes.data;

  let subtitle = "Resumen del estado actual (Este mes).";
  
  if (resolvedSearchParams.start && resolvedSearchParams.end) {
    try {
      const formatFecha = (iso: string) => {
        const [y, m, d] = iso.split('-');
        const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
      };
      subtitle = `Resumen desde el ${formatFecha(resolvedSearchParams.start)} hasta el ${formatFecha(resolvedSearchParams.end)}.`;
    } catch (e) {
      // fallback
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            Centro de Control Financiero
            <InfoTooltip text="Dashboard principal de finanzas, muestra liquidez en tiempo real, proyecciones y estado de cuentas de la academia." />
          </h1>
          <p className="text-default-500 text-sm mt-1">{subtitle}</p>
        </div>
        <DateRangeFilter />
      </div>

      <AccountingKpiCards data={kpis} />

      <AccountingAlerts 
        alerts={alerts} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <AccountingCashFlowChart data={cashFlow} />
            </div>
            <div className="lg:col-span-2">
              <AccountingExpensesChart data={expensesByCategory} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <AccountingBalancesCard accounts={accounts} />
        </div>
      </div>
    </div>
  );
}
