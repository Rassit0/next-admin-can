"use client";

import { Card } from "@heroui/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DistributionChartProps {
  data: {
    byStatus: {
      name: string;
      value: number;
    }[];
  };
}

const COLORS = {
  ACTIVE: "var(--success)",
  PENDING_ACTIVE: "var(--warning)",
  SUSPENDED: "var(--danger)",
  WITHDRAWN: "var(--muted)",
  FINISHED: "var(--default)",
};

const translateStatus = (status: string) => {
  const map: Record<string, string> = {
    ACTIVE: "Activos",
    PENDING_ACTIVE: "Pendientes",
    SUSPENDED: "Suspendidos",
    WITHDRAWN: "Retirados",
    FINISHED: "Finalizados",
  };
  return map[status] || status;
};

export const DistributionChart = ({ data }: DistributionChartProps) => {
  const chartData = data.byStatus.map((item) => ({
    ...item,
    label: translateStatus(item.name),
  }));

  return (
    <Card className="border-none bg-background/60 dark:bg-default-100/50 w-full h-full shadow-sm">
      <Card.Header className="px-6 pt-6">
        <Card.Title className="text-lg font-semibold">
          Estado de Membresías
        </Card.Title>
      </Card.Header>
      <div className="px-6 pb-6 pt-0 flex-1">
        <div className="h-75 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="label"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      COLORS[entry.name as keyof typeof COLORS] ||
                      "hsl(var(--heroui-primary))"
                    }
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
              />
              <Legend position="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
