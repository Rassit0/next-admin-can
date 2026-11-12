"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wallet02Icon,
  SafeIcon,
  Building04Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/ui";
import { formatCurrency } from "@/utils/constants";

export interface AccountSummaryItem {
  id: string;
  name: string;
  type: string;
  currency: string;
  isActive: boolean;
  balance: number;
}

export interface CurrentTreasuryCardProps {
  availableBalance: number;
  accounts?: AccountSummaryItem[];
  className?: string;
}

export const CurrentTreasuryCard = ({
  availableBalance,
  accounts = [],
  className,
}: CurrentTreasuryCardProps) => {
  const { cashTotal, bankTotal, otherCurrenciesCount } = useMemo(() => {
    const active = accounts.filter((acc) => acc.isActive);
    let cash = 0;
    let bank = 0;
    let nonBob = 0;

    for (const acc of active) {
      if (!acc.currency || acc.currency === "BOB") {
        if (acc.type === "CASH") {
          cash += acc.balance;
        } else {
          bank += acc.balance;
        }
      } else {
        nonBob += 1;
      }
    }

    return {
      cashTotal: cash,
      bankTotal: bank,
      otherCurrenciesCount: nonBob,
    };
  }, [accounts]);

  return (
    <div
      className={clsx(
        "flex flex-col justify-between rounded-3xl border border-border/80 bg-surface/90 dark:bg-surface-secondary/70 p-5 sm:p-6 shadow-xs transition-shadow hover:shadow-sm",
        className,
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-secondary text-foreground/80 border border-border/80">
              <HugeiconsIcon icon={Wallet02Icon} size={22} />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                  Dinero disponible hoy
                </h3>
                <InfoTooltip text="Total consolidado de dinero líquido inmediatamente disponible en todas las cuentas y cajas activas del club en moneda nacional (BOB)." />
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground/55 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Saldo en cuentas (Stock)
              </span>
            </div>
          </div>

          <span className="rounded-full border border-border/80 bg-surface-secondary/70 px-2.5 py-1 text-[11px] font-bold text-foreground/75">
            BOB
          </span>
        </div>

        <div>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {formatCurrency(availableBalance)}
          </p>
          <div className="mt-2 flex items-start gap-1.5 text-xs text-foreground/60 leading-relaxed">
            <span
              className="shrink-0 text-foreground/50 mt-0.5"
              aria-hidden="true"
            >
              <HugeiconsIcon icon={Calendar03Icon} size={14} />
            </span>
            <p>
              Saldo actual al día de hoy. Este importe no cambia al modificar el
              período seleccionado.
            </p>
          </div>
        </div>
      </div>

      {/* Desglose de efectivo vs bancos */}
      <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-surface-secondary/70 px-3 py-1.5 text-xs">
          <span className="text-foreground/60">
            <HugeiconsIcon icon={SafeIcon} size={16} />
          </span>
          <span className="text-foreground/70 font-medium">Cajas físicas:</span>
          <span className="font-bold text-foreground">
            {formatCurrency(cashTotal)}
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-surface-secondary/70 px-3 py-1.5 text-xs">
          <span className="text-foreground/60">
            <HugeiconsIcon icon={Building04Icon} size={16} />
          </span>
          <span className="text-foreground/70 font-medium">
            Bancos y billeteras:
          </span>
          <span className="font-bold text-foreground">
            {formatCurrency(bankTotal)}
          </span>
        </div>

        {otherCurrenciesCount > 0 && (
          <span className="text-[11px] text-foreground/50 italic">
            (+{otherCurrenciesCount}{" "}
            {otherCurrenciesCount === 1 ? "cuenta" : "cuentas"} en otra divisa)
          </span>
        )}
      </div>
    </div>
  );
};

