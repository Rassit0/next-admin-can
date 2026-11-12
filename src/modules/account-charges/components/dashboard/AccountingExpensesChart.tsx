"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/utils/constants";
import { InfoTooltip } from "@/ui";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import { HugeiconsIcon } from "@hugeicons/react";
import { Invoice01Icon } from "@hugeicons/core-free-icons";

interface Props {
  data: {
    name: string;
    value: number;
  }[];
}

const CATEGORY_COLORS = [
  "#0284c7", // Sky
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#64748b", // Slate
];

export const AccountingExpensesChart = ({ data }: Props) => {
  const { totalCommitments, chartData, displayCategories } = useMemo(() => {
    const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    if (data.length <= 5) {
      return { totalCommitments: total, chartData: data, displayCategories: data };
    }
    const top4 = data.slice(0, 4);
    const othersValue = data
      .slice(4)
      .reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    const chartList = [...top4, { name: "Otras categorías", value: othersValue }];
    return {
      totalCommitments: total,
      chartData: chartList,
      displayCategories: chartList,
    };
  }, [data]);

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-surface/90 dark:bg-surface-secondary/70 p-5 sm:p-6 shadow-xs h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/12 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              <HugeiconsIcon icon={Invoice01Icon} size={18} />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-foreground">
                  Compromisos registrados por categoría
                </h3>
                <InfoTooltip text="Muestra la suma de obligaciones y cuentas de pago (PAYABLE) registradas durante este período según su categoría contable. Corresponde a compromisos generados, no necesariamente dinero ya pagado." />
              </div>
              <p className="text-xs text-foreground/55">
                Distribución de obligaciones registradas en el período
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-foreground/75">
            Total: <strong className="text-foreground">{formatCurrency(totalCommitments)}</strong>
          </span>
        </div>

        {data.length === 0 ? (
          <div className="flex h-72 sm:h-80 items-center justify-center text-xs text-foreground/50">
            No hay compromisos por categoría registrados en este período.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mt-4">
            {/* Gráfico circular con total al centro */}
            <div className="md:col-span-6 relative flex items-center justify-center h-64 sm:h-72">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={chartData}
                    dataKey="value"
                    innerRadius={68}
                    outerRadius={92}
                    paddingAngle={3}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      borderRadius: "1rem",
                      color: "var(--foreground)",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                      fontSize: "12px",
                    }}
                    formatter={(value: ValueType | undefined) =>
                      formatCurrency(Number(value) || 0)
                    }
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Centro de la dona con el monto total */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
                  Total
                </span>
                <span className="text-sm sm:text-base font-extrabold text-foreground leading-tight truncate max-w-[120px]">
                  {formatCurrency(totalCommitments)}
                </span>
                <span className="text-[10px] text-foreground/50">
                  registrado
                </span>
              </div>
            </div>

            {/* Lista detallada con porcentajes */}
            <div className="md:col-span-6 flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
              {displayCategories.map((cat, index) => {
                const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
                const pct =
                  totalCommitments > 0
                    ? Math.round((cat.value / totalCommitments) * 100)
                    : 0;

                return (
                  <div
                    key={`cat-${index}`}
                    className="flex flex-col gap-1 rounded-xl border border-border/60 bg-surface-secondary/50 p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="truncate font-medium text-foreground">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-bold text-foreground">
                          {formatCurrency(cat.value)}
                        </span>
                        <span className="text-[10px] font-semibold text-foreground/50">
                          ({pct}%)
                        </span>
                      </div>
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(pct, 100)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
