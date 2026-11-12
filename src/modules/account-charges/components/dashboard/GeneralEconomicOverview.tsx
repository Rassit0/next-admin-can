"use client";

import {
  CurrentTreasuryCard,
  AccountSummaryItem,
} from "./CurrentTreasuryCard";
import { PeriodFlowOverview } from "./PeriodFlowOverview";

export type { AccountSummaryItem };

export interface GeneralEconomicOverviewProps {
  availableBalance: number;
  periodResult: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  accounts?: AccountSummaryItem[];
  className?: string;
}

export const GeneralEconomicOverview = ({
  availableBalance,
  periodResult,
  monthlyIncome,
  monthlyExpenses,
  accounts = [],
  className,
}: GeneralEconomicOverviewProps) => {
  return (
    <div className={className ?? "grid grid-cols-1 lg:grid-cols-12 gap-5"}>
      <CurrentTreasuryCard
        accounts={accounts}
        availableBalance={availableBalance}
        className="lg:col-span-7"
      />
      <PeriodFlowOverview
        className="lg:col-span-5"
        monthlyExpenses={monthlyExpenses}
        monthlyIncome={monthlyIncome}
        periodResult={periodResult}
      />
    </div>
  );
};
