"use client";

import clsx from "clsx";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoneyReceiveSquareIcon,
  MoneySendSquareIcon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/ui";
import { formatCurrency } from "@/utils/constants";

interface Props {
  totalReceivables: number;
  totalPayables: number;
  className?: string;
}

export const PendingCommitmentsCards = ({
  totalReceivables,
  totalPayables,
  className,
}: Props) => {
  return (
    <div
      className={clsx(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4",
        className,
      )}
    >
      {/* 1. Pendiente de cobro */}
      <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-surface/90 dark:bg-surface-secondary/70 p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/12 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <HugeiconsIcon icon={MoneyReceiveSquareIcon} size={20} />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm sm:text-base font-bold text-foreground">
                    Pendiente de cobro
                  </h4>
                  <InfoTooltip text="Monto total pendiente correspondiente a cuotas escolares, mensualidades y cargos administrativos que aún deben ingresar a la institución." />
                </div>
                <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                  Por ingresar al club
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {formatCurrency(totalReceivables)}
            </p>
            <p className="mt-1 text-xs text-foreground/60 leading-relaxed">
              Cargos emitidos pendientes o parcialmente abonados por cobrar.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60">
          <Link
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-md"
            href="/admin/accounting/receivables"
          >
            <span>Ver cuentas por cobrar</span>
            <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
          </Link>
        </div>
      </div>

      {/* 2. Compromisos de pago */}
      <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-surface/90 dark:bg-surface-secondary/70 p-5 shadow-xs transition-shadow hover:shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/12 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <HugeiconsIcon icon={MoneySendSquareIcon} size={20} />
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm sm:text-base font-bold text-foreground">
                    Compromisos de pago
                  </h4>
                  <InfoTooltip text="Monto total correspondiente a obligaciones registradas con proveedores o staff que aún no han sido pagadas (no representan dinero que ya salió de caja o bancos)." />
                </div>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  Obligaciones registradas
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {formatCurrency(totalPayables)}
            </p>
            <p className="mt-1 text-xs text-foreground/60 leading-relaxed">
              Obligaciones pendientes de pago (no descontadas aún de cuentas).
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60">
          <Link
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-md"
            href="/admin/accounting/payables"
          >
            <span>Ver cuentas por pagar</span>
            <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

