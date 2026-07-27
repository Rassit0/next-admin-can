"use client";

import { Card } from "@heroui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/utils/constants";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

interface RevenueChartProps {
  data: {
    name: string;
    ingresos: number;
    deuda: number;
  }[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <Card className="border-none bg-background/60 dark:bg-default-100/50 w-full h-full shadow-sm">
      <Card.Header className="px-6 pt-6">
        <Card.Title className="text-lg font-semibold">
          Ingresos vs Deuda (Últimos 6 Meses)
        </Card.Title>
      </Card.Header>
      <div className="px-6 pb-6 pt-0 flex-1">
        <div className="h-75 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted)", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted)", fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(Number(value) || 0)}
              />
              <Tooltip
                cursor={{ fill: "var(--surface-secondary)" }}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  color: "var(--foreground)",
                }}
                formatter={(value: ValueType | undefined) =>
                  formatCurrency(Number(value) || 0)
                }
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar
                name="Ingresos"
                dataKey="ingresos"
                fill="var(--success)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                name="Deuda Pendiente"
                dataKey="deuda"
                fill="var(--danger)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
