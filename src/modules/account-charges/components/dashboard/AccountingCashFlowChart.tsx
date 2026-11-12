"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/utils/constants";
import { InfoTooltip } from "@/ui";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartHistogramIcon } from "@hugeicons/core-free-icons";

interface Props {
  data: {
    name: string;
    ingresos: number;
    egresos: number;
  }[];
}

export const AccountingCashFlowChart = ({ data }: Props) => {
  const { totalIngresos, totalEgresos, tickInterval } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const d of data) {
      inc += d.ingresos || 0;
      exp += d.egresos || 0;
    }
    const interval = data.length > 20 ? Math.ceil(data.length / 10) - 1 : 0;
    return { totalIngresos: inc, totalEgresos: exp, tickInterval: interval };
  }, [data]);

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-surface/90 dark:bg-surface-secondary/70 p-5 sm:p-6 shadow-xs h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/12 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <HugeiconsIcon icon={ChartHistogramIcon} size={18} />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-foreground">
                  Entradas vs. salidas
                </h3>
                <InfoTooltip text="Historial de movimientos de dinero efectivamente cobrado (entradas) vs. dinero gastado (salidas) en el período seleccionado. Excluye estrictamente transferencias internas entre cuentas propias." />
              </div>
              <p className="text-xs text-foreground/55">
                Evolución de movimientos de efectivo y bancos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="text-emerald-600 dark:text-emerald-400">
              Recibido: <strong>{formatCurrency(totalIngresos)}</strong>
            </span>
            <span className="text-foreground/30">•</span>
            <span className="text-rose-600 dark:text-rose-400">
              Gastado: <strong>{formatCurrency(totalEgresos)}</strong>
            </span>
          </div>
        </div>

        <div className="w-full h-72 sm:h-80 mt-4">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-foreground/50">
              No hay movimientos de caja en el período seleccionado.
            </div>
          ) : (
            <ResponsiveContainer height="100%" width="100%">
              <BarChart
                data={data}
                margin={{ top: 12, right: 12, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  axisLine={false}
                  dataKey="name"
                  dy={8}
                  interval={tickInterval}
                  tick={{ fill: "var(--foreground)", opacity: 0.65, fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: "var(--foreground)", opacity: 0.65, fontSize: 11 }}
                  tickFormatter={(value) => formatCurrency(Number(value) || 0)}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    borderRadius: "1rem",
                    color: "var(--foreground)",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "var(--surface-secondary)", opacity: 0.6 }}
                  formatter={(value: ValueType | undefined) =>
                    formatCurrency(Number(value) || 0)
                  }
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs font-medium text-foreground/80">
                      {value}
                    </span>
                  )}
                  wrapperStyle={{ paddingTop: "14px" }}
                />
                <Bar
                  dataKey="ingresos"
                  fill="var(--success)"
                  maxBarSize={32}
                  name="Dinero recibido"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="egresos"
                  fill="var(--danger)"
                  maxBarSize={32}
                  name="Dinero gastado"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
