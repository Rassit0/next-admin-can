import { getAccountingDashboardSummary } from "@/modules/accounting-dashboard/actions/get";
import { ErrorPage, InfoTooltip, DateRangeFilter } from "@/ui";
import { CurrentTreasuryCard } from "@/modules/account-charges/components/dashboard/CurrentTreasuryCard";
import { PendingCommitmentsCards } from "@/modules/account-charges/components/dashboard/PendingCommitmentsCards";
import { AccountingAlerts } from "@/modules/account-charges/components/dashboard/AccountingAlerts";
import { AccountingBalancesCard } from "@/modules/account-charges/components/dashboard/AccountingBalancesCard";
import { PeriodFlowOverview } from "@/modules/account-charges/components/dashboard/PeriodFlowOverview";
import { AccountingCashFlowChart } from "@/modules/account-charges/components/dashboard/AccountingCashFlowChart";
import { AccountingExpensesChart } from "@/modules/account-charges/components/dashboard/AccountingExpensesChart";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, Calendar03Icon } from "@hugeicons/core-free-icons";

interface Props {
  searchParams: Promise<{ start?: string; end?: string }>;
}

export default async function QuickOperationsDashboardPage({
  searchParams,
}: Props) {
  const resolvedSearchParams = await searchParams;
  const summaryRes = await getAccountingDashboardSummary({
    start: resolvedSearchParams.start,
    end: resolvedSearchParams.end,
  });

  if (summaryRes.error || !summaryRes.data) {
    return <ErrorPage message={summaryRes.message} />;
  }

  const { kpis, alerts, cashFlow, expensesByCategory, accounts } =
    summaryRes.data;

  let periodSubtitle =
    "Consulta los movimientos y resultados financieros correspondientes al rango de fechas seleccionado.";

  if (resolvedSearchParams.start && resolvedSearchParams.end) {
    try {
      const formatFecha = (iso: string) => {
        const date = new Date(iso);
        return new Intl.DateTimeFormat("es-ES", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(date);
      };
      periodSubtitle = `Movimientos registrados desde el ${formatFecha(resolvedSearchParams.start)} hasta el ${formatFecha(resolvedSearchParams.end)}.`;
    } catch {
      // fallback
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-12">
      {/* Encabezado global de la vista */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Resumen Operativo
            </h1>
            <InfoTooltip text="Visión integral de operaciones rápidas: estado financiero actual de tesorería y compromisos, junto al análisis de flujos del período seleccionado." />
          </div>
          <p className="text-xs sm:text-sm text-foreground/60 mt-1">
            Monitoreo financiero dividido en situación actual de tesorería y
            análisis de movimientos por período.
          </p>
        </div>
      </div>

      {/* SECCIÓN A — Situación actual (Independiente del filtro) */}
      <section aria-label="Situación actual" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-surface-secondary text-foreground/75 border border-border/80">
                <HugeiconsIcon icon={Clock01Icon} size={16} />
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Situación actual
              </h2>
              <span className="rounded-full border border-border/80 bg-surface-secondary/80 px-2.5 py-0.5 text-[11px] font-semibold text-foreground/70">
                Vigente hoy
              </span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/60">
              Estado financiero actual de la institución, independiente del
              período seleccionado.
            </p>
          </div>
        </div>

        {/* Nivel 1: Dinero disponible hoy (7 cols) + Compromisos pendientes (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-7">
            <CurrentTreasuryCard
              accounts={accounts}
              availableBalance={kpis.treasury.availableBalance}
              className="h-full"
            />
          </div>

          <div className="lg:col-span-5">
            <PendingCommitmentsCards
              className="h-full"
              totalPayables={kpis.financial.totalPayables}
              totalReceivables={kpis.financial.totalReceivables}
            />
          </div>
        </div>

        {/* Nivel 2: Dónde está el dinero (5 cols) + Atención inmediata (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5">
            <AccountingBalancesCard accounts={accounts} />
          </div>

          <div className="lg:col-span-7">
            <AccountingAlerts alerts={alerts} />
          </div>
        </div>
      </section>

      {/* SECCIÓN B — Análisis del período (Dependiente del filtro) */}
      <section
        aria-label="Análisis del período"
        className="rounded-3xl border border-sky-500/25 bg-sky-500/[0.02] dark:bg-sky-500/[0.03] p-5 sm:p-7 shadow-xs space-y-6"
      >
        {/* Encabezado y Filtro integrados */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-sky-500/15">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                <HugeiconsIcon icon={Calendar03Icon} size={16} />
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                Análisis del período
              </h2>
              <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                Controlado por filtro de fechas
              </span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/65">
              {periodSubtitle}
            </p>
          </div>

          {/* Filtro de fechas contenido exclusivamente en esta sección */}
          <div className="shrink-0">
            <DateRangeFilter />
          </div>
        </div>

        {/* Indicadores del período: Balance neto, Dinero recibido, Dinero gastado */}
        <PeriodFlowOverview
          monthlyExpenses={kpis.monthlyExpenses}
          monthlyIncome={kpis.monthlyIncome}
          periodResult={kpis.financial.periodResult}
        />

        {/* Gráficos del período: Entradas vs. Salidas y Compromisos por categoría */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Evolución y distribución del período
              </h3>
              <p className="text-xs text-foreground/55">
                Comportamiento temporal de liquidez y desglose de obligaciones
                registradas en las fechas seleccionadas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <AccountingCashFlowChart data={cashFlow} />
            <AccountingExpensesChart data={expensesByCategory} />
          </div>
        </div>
      </section>
    </div>
  );
}
