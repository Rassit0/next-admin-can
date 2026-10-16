import React from "react";
import { Chip, ProgressBar } from "@heroui/react";
import {
  Wallet02Icon,
  Invoice02Icon,
  Analytics02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { formatCurrency } from "@/utils/constants";
import { IDashboardSummary } from "../interfaces/dashboard.interface";
import { formatNumber } from "../utils/dashboard-period";
import { DashboardKpiCard } from "./DashboardKpiCard";
import clsx from "clsx";

interface DashboardKpiGridProps {
  summary: IDashboardSummary;
}

export const DashboardKpiGrid: React.FC<DashboardKpiGridProps> = ({ summary }) => {
  const visibleCardsCount = [
    summary.liquidity,
    summary.receivables,
    summary.financialFlow,
    summary.community,
  ].filter(Boolean).length;

  if (visibleCardsCount === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-sm">
        No hay métricas ejecutivas disponibles con los permisos actuales del usuario.
      </div>
    );
  }

  const gridColsClass =
    visibleCardsCount === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : visibleCardsCount === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : visibleCardsCount === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 max-w-md";

  return (
    <section className={clsx("grid gap-4 md:gap-6", gridColsClass)}>
      {/* KPI 1 — Liquidez Actual */}
      {summary.liquidity && (
        <DashboardKpiCard
          title="Liquidez actual"
          value={formatCurrency(summary.liquidity.total)}
          subtitle={`${formatNumber(summary.liquidity.activeAccountsCount)} cuentas activas`}
          icon={Wallet02Icon}
          accentColor="success"
          children={
            summary.liquidity.accounts && summary.liquidity.accounts.length > 0 ? (
              <div className="space-y-1 text-xs">
                {summary.liquidity.accounts.slice(0, 2).map((acc) => (
                  <div
                    key={acc.id}
                    className="flex justify-between items-center text-slate-500 dark:text-slate-400"
                  >
                    <span className="truncate max-w-[130px]">{acc.name}</span>
                    <span className="font-semibold text-on-surface">
                      {formatCurrency(acc.balance)}
                    </span>
                  </div>
                ))}
              </div>
            ) : null
          }
          footer="Efectivo y Cuentas Bancarias"
        />
      )}

      {/* KPI 2 — Por Cobrar Actual */}
      {summary.receivables && (
        <DashboardKpiCard
          title="Por cobrar actual"
          value={formatCurrency(summary.receivables.totalPending)}
          subtitle={`${formatNumber(summary.receivables.pendingChargesCount)} cargos pendientes`}
          icon={Invoice02Icon}
          accentColor={summary.receivables.overduePercentage > 50 ? "danger" : "warning"}
          children={
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Vencido</span>
                <span className="font-semibold text-danger">
                  {formatCurrency(summary.receivables.overdueAmount)} ({summary.receivables.overduePercentage}%)
                </span>
              </div>
              <ProgressBar
                aria-label="Porcentaje de cartera vencida"
                className="w-full"
                maxValue={100}
                minValue={0}
                value={summary.receivables.overduePercentage}
              >
                <ProgressBar.Track className="bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <ProgressBar.Fill className="bg-danger h-full transition-all" />
                </ProgressBar.Track>
              </ProgressBar>
            </div>
          }
          footer={`${formatNumber(summary.receivables.overdueChargesCount)} cargos con mora`}
        />
      )}

      {/* KPI 3 — Resultado Operativo del Período */}
      {summary.financialFlow && (
        <DashboardKpiCard
          title={`Resultado · ${summary.period.label}`}
          value={
            <span
              className={clsx(
                summary.financialFlow.netResult > 0 && "text-success",
                summary.financialFlow.netResult < 0 && "text-danger",
              )}
            >
              {summary.financialFlow.netResult > 0
                ? `+${formatCurrency(summary.financialFlow.netResult)}`
                : summary.financialFlow.netResult < 0
                ? `-${formatCurrency(Math.abs(summary.financialFlow.netResult))}`
                : formatCurrency(0)}
            </span>
          }
          badge={
            <Chip
              color={
                summary.financialFlow.netResult > 0
                  ? "success"
                  : summary.financialFlow.netResult < 0
                  ? "danger"
                  : "default"
              }
              variant="soft"
              size="sm"
            >
              <Chip.Label>
                {summary.financialFlow.netResult > 0
                  ? "Superávit"
                  : summary.financialFlow.netResult < 0
                  ? "Déficit"
                  : "Equilibrio"}
              </Chip.Label>
            </Chip>
          }
          icon={Analytics02Icon}
          accentColor={summary.financialFlow.netResult >= 0 ? "primary" : "danger"}
          children={
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">
                  Ingresos
                </span>
                <span className="font-semibold text-success truncate block">
                  {formatCurrency(summary.financialFlow.totalIncome)}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">
                  Egresos
                </span>
                <span className="font-semibold text-danger truncate block">
                  {formatCurrency(summary.financialFlow.totalExpense)}
                </span>
              </div>
            </div>
          }
          footer="Margen operativo del período"
        />
      )}

      {/* KPI 4 — Comunidad Activa */}
      {summary.community && (
        <DashboardKpiCard
          title="Comunidad activa"
          value={`${formatNumber(summary.community.uniqueActivePeople)} personas`}
          subtitle={`${formatNumber(summary.community.activeStudents)} Escuelas · ${formatNumber(summary.community.activePlayers)} Equipos`}
          icon={UserGroupIcon}
          accentColor="secondary"
          children={
            <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
              <span className="text-slate-500 dark:text-slate-400">Total membresías:</span>
              <span className="font-bold text-on-surface">
                {formatNumber(summary.community.totalActiveMemberships)}
              </span>
            </div>
          }
          footer={
            summary.community.dualAthletesCount > 0
              ? `${formatNumber(summary.community.dualAthletesCount)} atletas con membresía simultánea`
              : "Atletas físicos únicos"
          }
        />
      )}
    </section>
  );
};
