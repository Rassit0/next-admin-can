"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wallet02Icon,
  Building04Icon,
  SafeIcon,
  Activity01Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/ui";
import clsx from "clsx";

interface AccountDetail {
  id: string;
  name: string;
  type: string;
  currency: string;
  isActive: boolean;
  balance: number;
}

interface Props {
  accounts: AccountDetail[];
}

export const AccountingBalancesCard = ({ accounts }: Props) => {
  const formatAccountCurrency = (amount: number, currency: string = "BOB") => {
    try {
      return new Intl.NumberFormat("es-BO", {
        style: "currency",
        currency: currency,
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(2)}`;
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "CASH":
        return <HugeiconsIcon icon={SafeIcon} size={18} />;
      case "BANK":
        return <HugeiconsIcon icon={Building04Icon} size={18} />;
      case "DIGITAL_WALLET":
        return <HugeiconsIcon icon={Wallet02Icon} size={18} />;
      default:
        return <HugeiconsIcon icon={Activity01Icon} size={18} />;
    }
  };

  const activeAccounts = accounts?.filter((acc) => acc.isActive) || [];
  const cashAccounts = activeAccounts.filter((acc) => acc.type === "CASH");
  const bankAccounts = activeAccounts.filter(
    (acc) => acc.type === "BANK" || acc.type === "DIGITAL_WALLET",
  );

  const renderAccountGroup = (title: string, groupAccounts: AccountDetail[]) => {
    if (groupAccounts.length === 0) return null;

    return (
      <div className="flex flex-col gap-2.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground/55">
          {title} ({groupAccounts.length})
        </h4>
        <div className="flex flex-col gap-2">
          {groupAccounts.map((acc) => (
            <div
              key={acc.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface-secondary/60 p-3 hover:bg-surface-secondary transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={clsx(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    acc.type === "CASH"
                      ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-sky-500/12 text-sky-600 dark:text-sky-400 border border-sky-500/20",
                  )}
                >
                  {getAccountIcon(acc.type)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs sm:text-sm font-semibold text-foreground">
                    {acc.name}
                  </p>
                  <p className="text-[10px] text-foreground/50">
                    {acc.type === "CASH"
                      ? "Caja física"
                      : acc.type === "BANK"
                        ? "Cuenta bancaria"
                        : "Billetera digital"}{" "}
                    • {acc.currency || "BOB"}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p
                  className={clsx(
                    "text-xs sm:text-sm font-bold",
                    acc.balance === 0
                      ? "text-foreground/45"
                      : acc.balance < 0
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-foreground",
                  )}
                >
                  {formatAccountCurrency(acc.balance, acc.currency || "BOB")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-surface/90 dark:bg-surface-secondary/70 p-5 sm:p-6 shadow-xs h-full">
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/12 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <HugeiconsIcon icon={Building04Icon} size={18} />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-foreground">
                  Dónde está el dinero
                </h3>
                <InfoTooltip text="Desglose del saldo actual (liquidez viva) en las diferentes cajas físicas, cuentas bancarias y billeteras de la institución." />
              </div>
              <p className="text-xs text-foreground/55">
                Distribución en cajas y cuentas bancarias
              </p>
            </div>
          </div>

          <span className="rounded-full border border-border/70 bg-surface-secondary px-2.5 py-0.5 text-[11px] font-semibold text-foreground/60">
            {activeAccounts.length}{" "}
            {activeAccounts.length === 1 ? "cuenta" : "cuentas"}
          </span>
        </div>

        <div className="flex flex-col gap-4 mt-4 max-h-96 overflow-y-auto pr-1">
          {activeAccounts.length === 0 ? (
            <p className="py-8 text-center text-xs text-foreground/50">
              No hay cuentas activas registradas.
            </p>
          ) : (
            <>
              {renderAccountGroup("Cajas físicas", cashAccounts)}
              {renderAccountGroup("Bancos y billeteras", bankAccounts)}
            </>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-border/60">
        <Link
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-md"
          href="/admin/accounting/accounts"
        >
          <span>Administrar cuentas financieras</span>
          <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
        </Link>
      </div>
    </div>
  );
};
