"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/utils/constants";

interface Props {
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = [
  "hsl(var(--heroui-primary))", 
  "hsl(var(--heroui-secondary))", 
  "hsl(var(--heroui-warning))", 
  "hsl(var(--heroui-danger))",
  "hsl(var(--heroui-success))",
];

export const AccountingExpensesChart = ({ data }: Props) => {
  return (
    <div className="bg-default-50 border border-default-200 p-6 rounded-xl shadow-sm flex flex-col gap-4">
      <div>
        <h3 className="font-semibold text-lg">Distribución de Egresos</h3>
        <p className="text-sm text-default-500">Gastos por categoría</p>
      </div>
      <div className="flex-1 w-full h-[300px]">
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--heroui-default-200))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              formatter={(value: any) => formatCurrency(Number(value))}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
