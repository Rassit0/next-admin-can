"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/utils/constants";

interface Props {
  data: {
    name: string;
    ingresos: number;
    egresos: number;
  }[];
}

export const AccountingCashFlowChart = ({ data }: Props) => {
  return (
    <div className="bg-default-50 border border-default-200 p-6 rounded-xl shadow-sm flex flex-col gap-4">
      <div>
        <h3 className="font-semibold text-lg">Flujo de Caja (6 meses)</h3>
        <p className="text-sm text-default-500">Comparativa de ingresos vs egresos</p>
      </div>
      <div className="flex-1 w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-default-200))" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--heroui-default-500))" }} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "hsl(var(--heroui-default-500))" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              cursor={{ fill: "hsl(var(--heroui-default-100))" }}
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--heroui-default-200))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              formatter={(value: any) => formatCurrency(Number(value))}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
            <Bar dataKey="ingresos" name="Ingresos" fill="hsl(var(--heroui-success))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="egresos" name="Egresos" fill="hsl(var(--heroui-danger))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
