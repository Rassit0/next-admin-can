import { getAccountingDashboardSummary } from "@/modules/accounting-dashboard/actions/get";
import { ErrorPage, InfoTooltip, DateRangeFilter } from "@/ui";
import { AccountingKpiCards } from "@/modules/account-charges/components/dashboard/AccountingKpiCards";
import { AccountingAlerts } from "@/modules/account-charges/components/dashboard/AccountingAlerts";
import { AccountingCashFlowChart } from "@/modules/account-charges/components/dashboard/AccountingCashFlowChart";
import { AccountingExpensesChart } from "@/modules/account-charges/components/dashboard/AccountingExpensesChart";
import { AccountingBalancesCard } from "@/modules/account-charges/components/dashboard/AccountingBalancesCard";
import { CurrentStateKpis } from "@/modules/account-charges/components/dashboard/CurrentStateKpis";


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

  let subtitle = "Ingresos, gastos y flujo correspondientes a este mes.";
  
  if (resolvedSearchParams.start && resolvedSearchParams.end) {
    try {
      const formatFecha = (iso: string) => {
        const date = new Date(iso);
        return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
      };
      subtitle = `Ingresos, gastos y flujo desde el ${formatFecha(resolvedSearchParams.start)} hasta el ${formatFecha(resolvedSearchParams.end)}.`;
    } catch (e) {
      // fallback
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          Centro de Control Financiero
          <InfoTooltip text="Dashboard principal de finanzas de la academia." />
        </h1>
      </div>

      {/* SECCIÓN 1: SITUACIÓN ACTUAL */}
      <section className="flex flex-col gap-4 bg-default-50/50 p-4 rounded-xl border border-default-100">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold flex items-center gap-2">
            ⚡ Situación Actual
          </h2>
          <p className="text-default-500 text-sm mt-1">Estado financiero actual de las cuentas y obligaciones.</p>
        </div>
        
        <CurrentStateKpis data={kpis} />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1">
            <AccountingBalancesCard accounts={accounts} />
          </div>
          <div className="xl:col-span-3">
            <AccountingAlerts alerts={alerts} />
          </div>
        </div>
      </section>

      <div className="h-px bg-divider w-full my-2 opacity-50" />

      {/* SECCIÓN 2: ANÁLISIS DE PERÍODO */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold flex items-center gap-2">
              📊 Análisis de Período
            </h2>
            <p className="text-default-500 text-sm mt-1">{subtitle}</p>
          </div>
          <DateRangeFilter />
        </div>

        <AccountingKpiCards data={kpis} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          <div className="lg:col-span-2">
            <AccountingCashFlowChart data={cashFlow} />
          </div>
          <div className="lg:col-span-2">
            <AccountingExpensesChart data={expensesByCategory} />
          </div>
        </div>
      </section>
    </div>
  );
}
