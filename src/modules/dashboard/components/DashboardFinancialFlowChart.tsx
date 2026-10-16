"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/utils/constants";
import { useReducedMotion } from "framer-motion";
import { IDashboardFinancialFlowPoint } from "../interfaces/dashboard.interface";
import {
  formatChartBucket,
  formatCompactCurrency,
} from "../utils/dashboard-chart.utils";

interface DashboardFinancialFlowChartProps {
  series: IDashboardFinancialFlowPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomFinancialTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const dataPoint = payload[0]?.payload as IDashboardFinancialFlowPoint | undefined;
  if (!dataPoint) return null;

  const isNetPositive = dataPoint.netMargin >= 0;

  return (
    <div className="bg-surface dark:bg-slate-900 border border-border shadow-xl rounded-2xl p-4 min-w-[200px] text-xs space-y-2">
      <div className="border-b border-border/60 pb-2 flex justify-between items-center">
        <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
          {formatChartBucket(label || dataPoint.date)}
        </span>
        <span className="text-[10px] text-muted font-mono">
          {dataPoint.date}
        </span>
      </div>

      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: "var(--success)" }}
            />
            <span className="text-foreground">Ingresos</span>
          </div>
          <span className="font-semibold" style={{ color: "var(--success)" }}>
            {formatCurrency(dataPoint.income)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: "var(--danger)" }}
            />
            <span className="text-foreground">Egresos</span>
          </div>
          <span className="font-semibold" style={{ color: "var(--danger)" }}>
            {formatCurrency(dataPoint.expense)}
          </span>
        </div>

        <div className="border-t border-border/60 pt-1.5 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-1 rounded-sm shrink-0"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span className="font-bold text-foreground">Resultado</span>
          </div>
          <span
            className="font-extrabold"
            style={{
              color: isNetPositive ? "var(--success)" : "var(--danger)",
            }}
          >
            {isNetPositive ? "+" : ""}
            {formatCurrency(dataPoint.netMargin)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const DashboardFinancialFlowChart: React.FC<
  DashboardFinancialFlowChartProps
> = ({ series }) => {
  const shouldReduceMotion = useReducedMotion();
  const isAnimationActive = !shouldReduceMotion;

  return (
    <div className="w-full h-72 sm:h-80 select-none">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={series}
          margin={{ top: 16, right: 12, left: -16, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border)"
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            tickFormatter={formatChartBucket}
            dy={8}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            tickFormatter={(val) => formatCompactCurrency(Number(val) || 0)}
          />

          <Tooltip
            content={<CustomFinancialTooltip />}
            cursor={{
              fill: "var(--surface-secondary)",
              opacity: 0.4,
            }}
          />

          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: "12px", fontSize: "12px" }}
            iconType="circle"
            formatter={(value) => (
              <span className="text-foreground font-medium mr-2">
                {value}
              </span>
            )}
          />

          <Bar
            dataKey="income"
            name="Ingresos"
            fill="var(--success)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            isAnimationActive={isAnimationActive}
          />

          <Bar
            dataKey="expense"
            name="Egresos"
            fill="var(--danger)"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
            isAnimationActive={isAnimationActive}
          />

          <Line
            type="monotone"
            dataKey="netMargin"
            name="Resultado Neto"
            stroke="var(--accent)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "var(--accent)" }}
            activeDot={{ r: 5 }}
            isAnimationActive={isAnimationActive}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
