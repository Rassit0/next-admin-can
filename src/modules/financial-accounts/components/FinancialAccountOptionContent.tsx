"use client";

import clsx from "clsx";

export interface FinancialAccountSelectItem {
  id: string;
  name: string;
  type?: string;
  currency?: string;
  cachedBalance?: number | string | null;
  isDefault?: boolean;
  allowedPaymentMethods?: string[];
  isActive?: boolean;
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  CASH: "Caja",
  BANK: "Banco",
  DIGITAL_WALLET: "Billetera Digital",
};

export const parseAccountBalance = (
  balance: number | string | null | undefined,
): number | null => {
  if (balance === null || balance === undefined || balance === "") {
    return null;
  }
  const numeric = Number(balance);
  return Number.isFinite(numeric) ? numeric : null;
};

export const formatAccountBalance = (
  balance: number | string | null | undefined,
  currency: string = "BOB",
): string | null => {
  const numeric = parseAccountBalance(balance);
  if (numeric === null) return null;

  const safeCurrency = currency || "BOB";
  try {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: safeCurrency,
    }).format(numeric);
  } catch {
    return `${safeCurrency} ${numeric.toFixed(2)}`;
  }
};

interface FinancialAccountOptionContentProps {
  account: FinancialAccountSelectItem;
}

export const FinancialAccountOptionContent = ({
  account,
}: FinancialAccountOptionContentProps) => {
  const numericBalance = parseAccountBalance(account.cachedBalance);
  const formattedBalance = formatAccountBalance(
    account.cachedBalance,
    account.currency,
  );
  const typeLabel = account.type
    ? ACCOUNT_TYPE_LABELS[account.type] || account.type
    : null;

  const balanceColorClass =
    numericBalance === null || numericBalance === 0
      ? "text-default-400"
      : numericBalance < 0
        ? "text-danger"
        : "text-foreground";

  const secondaryLabel =
    formattedBalance !== null
      ? typeLabel
        ? `${typeLabel} · Saldo actual`
        : "Saldo actual"
      : typeLabel || "Cuenta contable";

  return (
    <div className="flex w-full min-w-0 flex-col gap-0.5 py-0.5">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <span className="truncate text-sm font-medium text-foreground">
          {account.name}
        </span>
        {formattedBalance !== null && (
          <span
            className={clsx(
              "shrink-0 whitespace-nowrap text-xs font-semibold tabular-nums",
              balanceColorClass,
            )}
          >
            {formattedBalance}
          </span>
        )}
      </div>
      <span className="truncate text-[11px] text-default-400">
        {secondaryLabel}
      </span>
    </div>
  );
};

