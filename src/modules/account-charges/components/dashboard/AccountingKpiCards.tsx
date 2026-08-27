"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wallet02Icon,
  Activity01Icon,
} from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/ui";
import clsx from "clsx";

interface KpiData {
  financial: {
    periodResult: number;
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
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
                Ingresos Período
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
                Egresos Período
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
