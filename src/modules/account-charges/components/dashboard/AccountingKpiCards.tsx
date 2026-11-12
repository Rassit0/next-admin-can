"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wallet02Icon,
  Activity01Icon,
  MoneySendSquareIcon,
} from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/ui";
import { formatCurrency } from "@/utils/constants";
import clsx from "clsx";

interface KpiData {
  financial: {
    periodResult: number;
  };
  monthlyIncome: number;
  monthlyExpenses: number;
}

interface Props {
  data: KpiData;
}

export const AccountingKpiCards = ({ data }: Props) => {
  const isPositive = data.financial.periodResult > 0;
  const isNegative = data.financial.periodResult < 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
      {/* 1. Balance del período */}
      <div className="rounded-2xl border border-border/80 bg-surface/90 dark:bg-surface-secondary/70 p-4 shadow-xs">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex gap-2.5 items-center">
              <span className="p-2 bg-violet-500/12 text-violet-600 dark:text-violet-400 rounded-xl border border-violet-500/20">
                <HugeiconsIcon icon={Activity01Icon} size={18} />
              </span>
              <p className="text-xs sm:text-sm text-foreground/75 font-semibold flex items-center gap-1">
                Balance del período
                <InfoTooltip text="Diferencia real entre el dinero efectivamente cobrado y el dinero gastado durante el rango de fechas seleccionado (excluye transferencias internas entre cuentas propias)." />
              </p>
            </div>
          </div>
          <div>
            <h3
              className={clsx(
                "text-lg sm:text-xl font-extrabold truncate",
                isPositive && "text-emerald-600 dark:text-emerald-400",
                isNegative && "text-rose-600 dark:text-rose-400",
                !isPositive && !isNegative && "text-foreground",
              )}
            >
              {isPositive
                ? `+${formatCurrency(data.financial.periodResult)}`
                : formatCurrency(data.financial.periodResult)}
            </h3>
            <p className="text-[10px] sm:text-xs text-foreground/50 mt-0.5 truncate">
              {isPositive
                ? "Entró más de lo que salió"
                : isNegative
                  ? "Salió más de lo que entró"
                  : "Entradas y salidas equilibradas"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Dinero recibido */}
      <div className="rounded-2xl border border-border/80 bg-surface/90 dark:bg-surface-secondary/70 p-4 shadow-xs">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex gap-2.5 items-center">
              <span className="p-2 bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20">
                <HugeiconsIcon icon={Wallet02Icon} size={18} />
              </span>
              <p className="text-xs sm:text-sm text-foreground/75 font-semibold flex items-center gap-1">
                Dinero recibido
                <InfoTooltip text="Dinero real cobrado en caja o bancos durante el período seleccionado." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-foreground truncate">
              {formatCurrency(data.monthlyIncome)}
            </h3>
            <p className="text-[10px] sm:text-xs text-foreground/50 mt-0.5 truncate">
              Cobros completados
            </p>
          </div>
        </div>
      </div>

      {/* 3. Dinero gastado */}
      <div className="rounded-2xl border border-border/80 bg-surface/90 dark:bg-surface-secondary/70 p-4 shadow-xs">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex gap-2.5 items-center">
              <span className="p-2 bg-rose-500/12 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-500/20">
                <HugeiconsIcon icon={MoneySendSquareIcon} size={18} />
              </span>
              <p className="text-xs sm:text-sm text-foreground/75 font-semibold flex items-center gap-1">
                Dinero gastado
                <InfoTooltip text="Dinero real pagado desde caja o bancos durante el período seleccionado." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-foreground truncate">
              {formatCurrency(data.monthlyExpenses)}
            </h3>
            <p className="text-[10px] sm:text-xs text-foreground/50 mt-0.5 truncate">
              Egresos pagados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
