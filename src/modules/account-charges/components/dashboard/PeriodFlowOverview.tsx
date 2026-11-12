"use client";

import clsx from "clsx";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown02Icon,
  ArrowUp02Icon,
  EqualSignIcon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/ui";
import { formatCurrency } from "@/utils/constants";

export interface PeriodFlowOverviewProps {
  periodResult: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  className?: string;
}

export const PeriodFlowOverview = ({
  periodResult,
  monthlyIncome,
  monthlyExpenses,
  className,
}: PeriodFlowOverviewProps) => {
  const isPositive = periodResult > 0;
  const isNegative = periodResult < 0;

  return (
    <div className={clsx("grid grid-cols-1 md:grid-cols-3 gap-5", className)}>
      {/* 1. Balance neto del período */}
      <div className="flex flex-col justify-between rounded-3xl border border-sky-500/25 bg-surface/90 dark:bg-surface-secondary/70 p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/12 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <HugeiconsIcon icon={EqualSignIcon} size={20} />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm sm:text-base font-bold text-foreground">
                    Balance del período
                  </h4>
                  <InfoTooltip text="Diferencia neta entre el dinero efectivamente cobrado (entradas) y el dinero efectivamente pagado (salidas) durante el rango de fechas seleccionado." />
                </div>
                <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                  Flujo neto en el rango
                </span>
              </div>
            </div>

            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wider shrink-0">
              Según período
            </span>
          </div>

          <div>
            <p
              className={clsx(
                "text-2xl sm:text-3xl font-extrabold tracking-tight",
                isPositive && "text-emerald-600 dark:text-emerald-400",
                isNegative && "text-rose-600 dark:text-rose-400",
                !isPositive && !isNegative && "text-foreground",
              )}
            >
              {periodResult > 0
                ? `+${formatCurrency(periodResult)}`
                : formatCurrency(periodResult)}
            </p>
            <p className="mt-1 text-xs text-foreground/60 leading-relaxed">
              Diferencia neta entre cobros y pagos completados en las fechas.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60">
          <span
            className={clsx(
              "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold border",
              isPositive &&
                "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
              isNegative &&
                "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
              !isPositive &&
                !isNegative &&
                "border-border bg-surface-secondary text-foreground/70",
            )}
          >
            {isPositive
              ? "Entró más de lo que salió"
              : isNegative
                ? "Salió más de lo que entró"
                : "Entradas y salidas equilibradas"}
          </span>
        </div>
      </div>

      {/* 2. Dinero recibido (Entradas) */}
      <div className="flex flex-col justify-between rounded-3xl border border-sky-500/25 bg-surface/90 dark:bg-surface-secondary/70 p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <HugeiconsIcon icon={ArrowDown02Icon} size={20} />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm sm:text-base font-bold text-foreground">
                    Dinero recibido
                  </h4>
                  <InfoTooltip text="Total de fondos efectivamente percibidos por la institución en todas las cuentas durante el rango de fechas seleccionado (excluye transferencias internas)." />
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Entradas efectivas
                </span>
              </div>
            </div>

            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wider shrink-0">
              Según período
            </span>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {formatCurrency(monthlyIncome)}
            </p>
            <p className="mt-1 text-xs text-foreground/60 leading-relaxed">
              Cobros cobrados en efectivo o transferencias en el rango.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60">
          <Link
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-md"
            href="/admin/accounting/transactions?type=INCOME"
          >
            <span>Ver transacciones de ingreso</span>
            <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
          </Link>
        </div>
      </div>

      {/* 3. Dinero gastado (Salidas) */}
      <div className="flex flex-col justify-between rounded-3xl border border-sky-500/25 bg-surface/90 dark:bg-surface-secondary/70 p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/12 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <HugeiconsIcon icon={ArrowUp02Icon} size={20} />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm sm:text-base font-bold text-foreground">
                    Dinero gastado
                  </h4>
                  <InfoTooltip text="Total de fondos efectivamente desembolsados en pagos y gastos operativos durante el rango de fechas seleccionado (excluye transferencias internas)." />
                </div>
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                  Salidas efectivas
                </span>
              </div>
            </div>

            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wider shrink-0">
              Según período
            </span>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {formatCurrency(monthlyExpenses)}
            </p>
            <p className="mt-1 text-xs text-foreground/60 leading-relaxed">
              Pagos ejecutados y gastos desembolsados en el rango.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60">
          <Link
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-md"
            href="/admin/accounting/transactions?type=EXPENSE"
          >
            <span>Ver transacciones de egreso</span>
            <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

