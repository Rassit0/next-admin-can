"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown02Icon, ArrowUp02Icon, MoneySendSquareIcon, MoneyReceiveSquareIcon, Wallet02Icon, Activity01Icon } from "@hugeicons/core-free-icons";
import clsx from "clsx";

interface KpiData {
  totalReceivables: number;
  totalPayables: number;
  receivablesTrend: number;
  payablesTrend: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalInCash: number;
  totalInBanks: number;
  netPosition: number;
}

interface Props {
  data: KpiData;
}

export const AccountingKpiCards = ({ data }: Props) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(amount);
  };

  const renderTrend = (trend: number, invertedGood: boolean = false) => {
    const isPositive = trend >= 0;
    const isGood = invertedGood ? !isPositive : isPositive;

    return (
      <div
        className={clsx(
          "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
          isGood
            ? "bg-success-50 text-success-600"
            : "bg-danger-50 text-danger-600"
        )}
      >
        {isPositive ? <HugeiconsIcon icon={ArrowUp02Icon} size={14} /> : <HugeiconsIcon icon={ArrowDown02Icon} size={14} />}
        {Math.abs(trend)}%
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Liquidez Inmediata */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-4 gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-success/10 rounded-lg text-success">
                <HugeiconsIcon icon={Wallet02Icon} size={24} />
              </div>
              <p className="text-sm text-default-500 font-medium">Liquidez</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">{formatCurrency(data.totalInCash + data.totalInBanks)}</h3>
            <p className="text-xs text-default-400 mt-1">Efectivo y Bancos</p>
          </div>
        </div>
      </div>

      {/* 2. Posición Neta */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-4 gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <HugeiconsIcon icon={Activity01Icon} size={24} />
              </div>
              <p className="text-sm text-default-500 font-medium">Posición Neta</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">{formatCurrency(data.netPosition)}</h3>
            <p className="text-xs text-default-400 mt-1">Liquidez + CXC - CXP</p>
          </div>
        </div>
      </div>

      {/* 3. Por Cobrar */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-4 gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <HugeiconsIcon icon={MoneyReceiveSquareIcon} size={24} />
              </div>
              <p className="text-sm text-default-500 font-medium">Por Cobrar</p>
            </div>
            {renderTrend(data.receivablesTrend, false)}
          </div>
          <div>
            <h3 className="text-xl font-bold">{formatCurrency(data.totalReceivables)}</h3>
            <p className="text-xs text-default-400 mt-1">Pendiente de cobro</p>
          </div>
        </div>
      </div>

      {/* 4. Por Pagar */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-4 gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-danger/10 rounded-lg text-danger">
                <HugeiconsIcon icon={MoneySendSquareIcon} size={24} />
              </div>
              <p className="text-sm text-default-500 font-medium">Por Pagar</p>
            </div>
            {renderTrend(data.payablesTrend, true)}
          </div>
          <div>
            <h3 className="text-xl font-bold">{formatCurrency(data.totalPayables)}</h3>
            <p className="text-xs text-default-400 mt-1">Obligaciones pendientes</p>
          </div>
        </div>
      </div>

      {/* 5. Ingresos Mes */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-4 gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-success/10 rounded-lg text-success">
                <HugeiconsIcon icon={Wallet02Icon} size={24} />
              </div>
              <p className="text-sm text-default-500 font-medium">Ingresos Mes</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">{formatCurrency(data.monthlyIncome)}</h3>
            <p className="text-xs text-default-400 mt-1">Cobrado este mes</p>
          </div>
        </div>
      </div>

      {/* 6. Egresos Mes */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-4 gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-warning/10 rounded-lg text-warning-600">
                <HugeiconsIcon icon={Activity01Icon} size={24} />
              </div>
              <p className="text-sm text-default-500 font-medium">Egresos Mes</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold">{formatCurrency(data.monthlyExpenses)}</h3>
            <p className="text-xs text-default-400 mt-1">Gastado este mes</p>
          </div>
        </div>
      </div>
    </div>
  );
};
