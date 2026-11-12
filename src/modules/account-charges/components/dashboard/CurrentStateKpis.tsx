"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoneySendSquareIcon,
  MoneyReceiveSquareIcon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/ui";
import { formatCurrency } from "@/utils/constants";

interface CurrentStateData {
  treasury: {
    availableBalance: number;
  };
  financial: {
    totalReceivables: number;
    totalPayables: number;
    receivablesTrend?: number;
    payablesTrend?: number;
  };
}

interface Props {
  data: CurrentStateData;
}

export const CurrentStateKpis = ({ data }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
      {/* 1. Dinero disponible hoy */}
      <div className="rounded-2xl border border-border/80 bg-surface/90 dark:bg-surface-secondary/70 p-4 shadow-xs">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex gap-2.5 items-center">
              <span className="p-2 bg-sky-500/12 text-sky-600 dark:text-sky-400 rounded-xl border border-sky-500/20">
                <HugeiconsIcon icon={Wallet02Icon} size={18} />
              </span>
              <p className="text-xs sm:text-sm text-foreground/75 font-semibold flex items-center gap-1">
                Dinero disponible hoy
                <InfoTooltip text="Total consolidado de dinero líquido inmediatamente disponible en todas las cuentas y cajas en moneda nacional (BOB)." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-foreground truncate">
              {formatCurrency(data.treasury.availableBalance)}
            </h3>
            <p className="text-[10px] sm:text-xs text-foreground/50 mt-0.5 truncate">
              Saldo en cuentas activas (Stock)
            </p>
          </div>
        </div>
      </div>

      {/* 2. Pendiente de cobro */}
      <div className="rounded-2xl border border-border/80 bg-surface/90 dark:bg-surface-secondary/70 p-4 shadow-xs">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex gap-2.5 items-center">
              <span className="p-2 bg-sky-500/12 text-sky-600 dark:text-sky-400 rounded-xl border border-sky-500/20">
                <HugeiconsIcon icon={MoneyReceiveSquareIcon} size={18} />
              </span>
              <p className="text-xs sm:text-sm text-foreground/75 font-semibold flex items-center gap-1">
                Pendiente de cobro
                <InfoTooltip text="Monto total correspondiente a cuotas escolares, membresías y cargos administrativos que aún deben ingresar a la institución." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-foreground truncate">
              {formatCurrency(data.financial.totalReceivables)}
            </h3>
            <p className="text-[10px] sm:text-xs text-foreground/50 mt-0.5 truncate">
              Cargos pendientes por ingresar
            </p>
          </div>
        </div>
      </div>

      {/* 3. Compromisos de pago */}
      <div className="rounded-2xl border border-border/80 bg-surface/90 dark:bg-surface-secondary/70 p-4 shadow-xs">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div className="flex gap-2.5 items-center">
              <span className="p-2 bg-amber-500/12 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-500/20">
                <HugeiconsIcon icon={MoneySendSquareIcon} size={18} />
              </span>
              <p className="text-xs sm:text-sm text-foreground/75 font-semibold flex items-center gap-1">
                Compromisos de pago
                <InfoTooltip text="Monto total de obligaciones registradas con proveedores o staff que aún no han sido pagadas (no representan dinero que ya salió de caja o bancos)." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-foreground truncate">
              {formatCurrency(data.financial.totalPayables)}
            </h3>
            <p className="text-[10px] sm:text-xs text-foreground/50 mt-0.5 truncate">
              Obligaciones pendientes de pago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
