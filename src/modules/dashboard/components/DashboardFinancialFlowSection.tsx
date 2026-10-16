import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Analytics02Icon } from "@hugeicons/core-free-icons";
import { formatCurrency } from "@/utils/constants";
import { IDashboardFinancialFlow } from "../interfaces/dashboard.interface";
import { isFinancialDatasetEmpty } from "../utils/dashboard-chart.utils";
import { DashboardFinancialFlowChart } from "./DashboardFinancialFlowChart";

interface DashboardFinancialFlowSectionProps {
  financialFlow?: IDashboardFinancialFlow;
  periodLabel: string;
}

export const DashboardFinancialFlowSection: React.FC<
  DashboardFinancialFlowSectionProps
> = ({ financialFlow, periodLabel }) => {
  if (!financialFlow) return null;

  const isEmpty = isFinancialDatasetEmpty(financialFlow.series);
  const isNetPositive = financialFlow.netResult >= 0;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-[40px] shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-full transition-all duration-200 hover:border-slate-200/80 dark:hover:border-slate-700/80 hover:shadow-sm">
      {/* Header del Gráfico */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={Analytics02Icon} size={20} />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold font-headline text-on-surface">
                Flujo Financiero
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {periodLabel}
              </p>
            </div>
          </div>

          {/* Resumen de totales del período */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Ingresos
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(financialFlow.totalIncome)}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Egresos
              </span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {formatCurrency(financialFlow.totalExpense)}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Neto
              </span>
              <span
                className={`font-extrabold ${
                  isNetPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {isNetPositive ? "+" : ""}
                {formatCurrency(financialFlow.netResult)}
              </span>
            </div>
          </div>
        </div>

        {/* Gráfico o Empty State */}
        {isEmpty ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500 space-y-2">
            <HugeiconsIcon
              icon={Analytics02Icon}
              size={36}
              className="mx-auto opacity-30"
            />
            <p className="text-sm font-medium">
              No se registraron movimientos en este período.
            </p>
            <p className="text-xs text-slate-400">
              Seleccione otro rango temporal para visualizar ingresos y egresos.
            </p>
          </div>
        ) : (
          <DashboardFinancialFlowChart series={financialFlow.series} />
        )}
      </div>
    </div>
  );
};
