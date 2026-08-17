"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown02Icon,
  ArrowUp02Icon,
  MoneySendSquareIcon,
  MoneyReceiveSquareIcon,
  Wallet02Icon,
  Activity01Icon,
} from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/ui";
import clsx from "clsx";

interface KpiData {
  treasury: {
    availableBalance: number;
  };
  financial: {
    totalReceivables: number;
    totalPayables: number;
    periodResult: number;
    receivablesTrend: number;
    payablesTrend: number;
  };
  monthlyIncome: number;
  monthlyExpenses: number;
}

interface Props {
  data: KpiData;
}

export const AccountingKpiCards = ({ data }: Props) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
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
            : "bg-danger-50 text-danger-600",
        )}
      >
        {isPositive ? (
          <HugeiconsIcon icon={ArrowUp02Icon} size={14} />
        ) : (
          <HugeiconsIcon icon={ArrowDown02Icon} size={14} />
        )}
        {Math.abs(trend)}%
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Saldo Disponible */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-success/10 rounded-lg text-success">
                <HugeiconsIcon icon={Wallet02Icon} size={20} />
              </div>
              <p className="text-xs sm:text-sm text-default-500 font-medium flex items-center gap-1">
                Saldo Disponible
                <InfoTooltip text="Total de dinero líquido disponible inmediatamente en todas las cuentas y cajas." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold truncate">
              {formatCurrency(data.treasury.availableBalance)}
            </h3>
            <p className="text-[10px] sm:text-xs text-default-400 mt-0.5 truncate">
              Efectivo y Bancos
            </p>
          </div>
        </div>
      </div>

      {/* 2. Total por Cobrar */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <HugeiconsIcon icon={MoneyReceiveSquareIcon} size={20} />
              </div>
              <p className="text-xs sm:text-sm text-default-500 font-medium flex items-center gap-1">
                Total por Cobrar
                <InfoTooltip text="Suma total de deudas a favor (mensualidades, matrículas y cuentas administrativas pendientes)." />
              </p>
            </div>
            {renderTrend(data.financial.receivablesTrend, false)}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold truncate">
              {formatCurrency(data.financial.totalReceivables)}
            </h3>
            <p className="text-[10px] sm:text-xs text-default-400 mt-0.5 truncate">
              Deudas a favor
            </p>
          </div>
        </div>
      </div>

      {/* 3. Total por Pagar */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-danger/10 rounded-lg text-danger">
                <HugeiconsIcon icon={MoneySendSquareIcon} size={20} />
              </div>
              <p className="text-xs sm:text-sm text-default-500 font-medium flex items-center gap-1">
                Total por Pagar
                <InfoTooltip text="Obligaciones y deudas pendientes de pago a proveedores o terceros." />
              </p>
            </div>
            {renderTrend(data.financial.payablesTrend, true)}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold truncate">
              {formatCurrency(data.financial.totalPayables)}
            </h3>
            <p className="text-[10px] sm:text-xs text-default-400 mt-0.5 truncate">
              Obligaciones de pago
            </p>
          </div>
        </div>
      </div>

      {/* 4. Resultado del Período */}
      <div className="border-none bg-default-50 rounded-large shadow-sm">
        <div className="p-3 sm:p-4 gap-2 sm:gap-3 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                <HugeiconsIcon icon={Activity01Icon} size={20} />
              </div>
              <p className="text-xs sm:text-sm text-default-500 font-medium flex items-center gap-1">
                Resultado del Período
                <InfoTooltip text="Ingresos menos egresos generados dentro del período seleccionado." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold truncate">
              {formatCurrency(data.financial.periodResult)}
            </h3>
            <p className="text-[10px] sm:text-xs text-default-400 mt-0.5 truncate">
              Ingresos - Egresos
            </p>
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
                <InfoTooltip text="Dinero real que ingresó a caja o bancos en lo que va del periodo seleccionado." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold truncate">
              {formatCurrency(data.monthlyIncome)}
            </h3>
            <p className="text-[10px] sm:text-xs text-default-400 mt-0.5 truncate">
              Total Ingresos
            </p>
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
                <InfoTooltip text="Dinero real que salió de caja o bancos para gastos durante el periodo seleccionado." />
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold truncate">
              {formatCurrency(data.monthlyExpenses)}
            </h3>
            <p className="text-[10px] sm:text-xs text-default-400 mt-0.5 truncate">
              Total Egresos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
