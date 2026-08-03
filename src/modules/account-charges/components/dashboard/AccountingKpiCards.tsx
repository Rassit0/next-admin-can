"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown02Icon, ArrowUp02Icon, MoneySendSquareIcon, MoneyReceiveSquareIcon, Wallet02Icon, Activity01Icon } from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/ui";
import clsx from "clsx";

interface KpiData {
  totalAccountReceivables: number;
  totalMembershipReceivables: number;
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
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Liquidez Inmediata */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-success/10 rounded-lg text-success">
                <HugeiconsIcon icon={Wallet02Icon} size={20} />
              </div>
              <p className="text-xs sm:text-sm text-default-500 font-medium flex items-center gap-1">
                Liquidez
                <InfoTooltip text="Suma total de dinero disponible inmediatamente (Efectivo en caja chica + Saldo en cuentas bancarias)." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold truncate">{formatCurrency(data.totalInCash + data.totalInBanks)}</h3>
            <p className="text-[10px] sm:text-xs text-default-400 mt-0.5 truncate">Efectivo y Bancos</p>
          </div>
        </div>
      </div>

      {/* 2. Posición Neta */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <HugeiconsIcon icon={Activity01Icon} size={20} />
              </div>
              <p className="text-xs sm:text-sm text-default-500 font-medium flex items-center gap-1">
                Posición Neta
                <InfoTooltip text="Tu liquidez actual más lo que te deben (Por Cobrar), restando lo que debes (Por Pagar)." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold truncate">{formatCurrency(data.netPosition)}</h3>
            <p className="text-[10px] sm:text-xs text-default-400 mt-0.5 truncate">Liquidez + CXC - CXP</p>
          </div>
        </div>
      </div>

      {/* 3. Cuentas por Cobrar */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <HugeiconsIcon icon={MoneyReceiveSquareIcon} size={20} />
              </div>
              <p className="text-xs sm:text-sm text-default-500 font-medium flex items-center gap-1">
                Cuentas por Cobrar
                <InfoTooltip text="Deudas administrativas a tu favor pendientes de cobro." />
              </p>
            </div>
            {renderTrend(data.receivablesTrend, false)}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold truncate">{formatCurrency(data.totalAccountReceivables)}</h3>
            <p className="text-[10px] sm:text-xs text-default-400 mt-0.5 truncate">Cuentas pendientes</p>
          </div>
        </div>
      </div>

      {/* 4. Membresías por Cobrar */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                <HugeiconsIcon icon={MoneyReceiveSquareIcon} size={20} />
              </div>
              <p className="text-xs sm:text-sm text-default-500 font-medium flex items-center gap-1">
                Membresías por Cobrar
                <InfoTooltip text="Mensualidades y matrículas de estudiantes pendientes de pago." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold truncate">{formatCurrency(data.totalMembershipReceivables)}</h3>
            <p className="text-[10px] sm:text-xs text-default-400 mt-0.5 truncate">Membresías pendientes</p>
          </div>
        </div>
      </div>

      {/* 4. Por Pagar */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-danger/10 rounded-lg text-danger">
                <HugeiconsIcon icon={MoneySendSquareIcon} size={20} />
              </div>
              <p className="text-xs sm:text-sm text-default-500 font-medium flex items-center gap-1">
                Por Pagar
                <InfoTooltip text="Compromisos y deudas que la academia debe pagar próximamente a terceros." />
              </p>
            </div>
            {renderTrend(data.payablesTrend, true)}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold truncate">{formatCurrency(data.totalPayables)}</h3>
            <p className="text-[10px] sm:text-xs text-default-400 mt-0.5 truncate">Obligaciones pendientes</p>
          </div>
        </div>
      </div>

      {/* 5. Ingresos Mes */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-success/10 rounded-lg text-success">
                <HugeiconsIcon icon={Wallet02Icon} size={20} />
              </div>
              <p className="text-xs sm:text-sm text-default-500 font-medium flex items-center gap-1">
                Ingresos Mes
                <InfoTooltip text="Dinero real que ingresó a caja o bancos en lo que va del mes actual." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold truncate">{formatCurrency(data.monthlyIncome)}</h3>
            <p className="text-[10px] sm:text-xs text-default-400 mt-0.5 truncate">Cobrado este mes</p>
          </div>
        </div>
      </div>

      {/* 6. Egresos Mes */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-warning/10 rounded-lg text-warning-600">
                <HugeiconsIcon icon={Activity01Icon} size={20} />
              </div>
              <p className="text-xs sm:text-sm text-default-500 font-medium flex items-center gap-1">
                Egresos Mes
                <InfoTooltip text="Dinero real que salió de caja o bancos para gastos durante el mes actual." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold truncate">{formatCurrency(data.monthlyExpenses)}</h3>
            <p className="text-[10px] sm:text-xs text-default-400 mt-0.5 truncate">Gastado este mes</p>
          </div>
        </div>
      </div>
    </div>
  );
};
