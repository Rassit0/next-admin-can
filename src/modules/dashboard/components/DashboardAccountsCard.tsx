import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wallet02Icon,
  Building04Icon,
  SafeIcon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";
import { formatCurrency } from "@/utils/constants";
import {
  IDashboardLiquidity,
  IDashboardAccountBalance,
} from "../interfaces/dashboard.interface";
import clsx from "clsx";

interface DashboardAccountsCardProps {
  liquidity?: IDashboardLiquidity;
  className?: string;
}

export const DashboardAccountsCard: React.FC<DashboardAccountsCardProps> = ({
  liquidity,
  className,
}) => {
  if (!liquidity || !liquidity.accounts || liquidity.accounts.length === 0) {
    return null;
  }

  // Multi-currency: Agrupar cuentas por moneda para no sumar o comparar peras con manzanas
  const accountsByCurrency = liquidity.accounts.reduce<
    Record<string, IDashboardAccountBalance[]>
  >((acc, account) => {
    const curr = account.currency || "BOB";
    if (!acc[curr]) acc[curr] = [];
    acc[curr].push(account);
    return acc;
  }, {});

  const getAccountTypePresentation = (type: string) => {
    switch (type) {
      case "CASH":
        return {
          label: "Caja",
          icon: SafeIcon,
          bgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        };
      case "BANK":
        return {
          label: "Banco",
          icon: Building04Icon,
          bgClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
        };
      case "DIGITAL_WALLET":
      default:
        return {
          label: "Billetera",
          icon: CreditCardIcon,
          bgClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        };
    }
  };

  return (
    <div
      className={clsx(
        "bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-[40px] shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-full transition-all duration-200 hover:border-slate-200/80 dark:hover:border-slate-700/80 hover:shadow-sm",
        className,
      )}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HugeiconsIcon icon={Wallet02Icon} size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold font-headline text-on-surface">
                Disponibilidad en cuentas
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {liquidity.activeAccountsCount} cuentas activas en tesorería
              </p>
            </div>
          </div>
          <span className="text-sm font-extrabold text-on-surface">
            {formatCurrency(liquidity.total)}
          </span>
        </div>

        {/* Listado de cuentas agrupadas por moneda */}
        <div className="space-y-6">
          {Object.entries(accountsByCurrency).map(([currency, accounts]) => {
            // Calcular total de esta moneda para barras proporcionales
            const currencyTotal = accounts.reduce(
              (sum, acc) => (acc.balance > 0 ? sum + acc.balance : sum),
              0,
            );

            return (
              <div key={currency} className="space-y-3.5">
                {Object.keys(accountsByCurrency).length > 1 && (
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Cuentas en {currency}
                  </div>
                )}

                {accounts.map((acc) => {
                  const typePres = getAccountTypePresentation(acc.type);
                  const isNegative = acc.balance < 0;
                  const ratio =
                    currencyTotal > 0 && acc.balance > 0
                      ? Number(((acc.balance / currencyTotal) * 100).toFixed(1))
                      : 0;

                  return (
                    <div key={acc.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={clsx(
                              "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                              typePres.bgClass,
                            )}
                          >
                            <HugeiconsIcon icon={typePres.icon} size={13} />
                          </div>
                          <span className="font-semibold text-on-surface truncate">
                            {acc.name}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                            ({typePres.label})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {!isNegative && ratio > 0 && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              {ratio}%
                            </span>
                          )}
                          <span
                            className={clsx(
                              "font-bold",
                              isNegative
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-on-surface",
                            )}
                          >
                            {isNegative
                              ? `-${formatCurrency(Math.abs(acc.balance))}`
                              : formatCurrency(acc.balance)}
                          </span>
                        </div>
                      </div>

                      {/* Barra proporcional horizontal */}
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={clsx(
                            "h-full rounded-full transition-all duration-500 ease-out motion-reduce:transition-none",
                            isNegative ? "bg-rose-500" : "bg-emerald-500",
                          )}
                          style={{
                            width: `${isNegative ? 100 : Math.min(Math.max(ratio, 0), 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
