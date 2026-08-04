"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/utils/constants";
import { InfoTooltip } from "@/ui";
import { Card } from "@heroui/react";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

interface Props {
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = [
  "var(--primary)",
  "var(--secondary)",
  "var(--warning)",
  "var(--danger)",
  "var(--success)",
];

export const AccountingExpensesChart = ({ data }: Props) => {
  return (
    <Card className="border-none bg-background/60 dark:bg-default-100/50 w-full h-full shadow-sm">
      <Card.Header className="px-6 pt-6 flex-col items-start gap-1">
        <Card.Title className="text-lg font-semibold flex items-center">
          Distribución de Egresos
          <InfoTooltip text="Muestra en qué categorías se están gastando los recursos de la academia actualmente." />
        </Card.Title>
        <p className="text-sm text-muted-foreground">Gastos por categoría</p>
      </Card.Header>
      <div className="px-6 pb-6 pt-0 flex-1">
        <div className="w-full h-75 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
