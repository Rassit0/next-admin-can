"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/utils/constants";
import { InfoTooltip } from "@/ui";
import { Card } from "@heroui/react";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

interface Props {
  data: {
    name: string;
    ingresos: number;
    egresos: number;
  }[];
}

export const AccountingCashFlowChart = ({ data }: Props) => {
  return (
    <Card className="border-none bg-background/60 dark:bg-default-100/50 w-full h-full shadow-sm">
      <Card.Header className="px-6 pt-6 flex-col items-start gap-1">
        <Card.Title className="text-lg font-semibold flex items-center">
          Flujo de Caja
          <InfoTooltip text="Visualiza el historial de ingresos vs egresos para entender el comportamiento de la caja en el período." />
        </Card.Title>
        <p className="text-sm text-muted-foreground">Comparativa de ingresos vs egresos</p>
      </Card.Header>
      <div className="px-6 pb-6 pt-0 flex-1">
        <div className="w-full h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} dy={10} />
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
                formatter={(value: ValueType | undefined) => formatCurrency(Number(value) || 0)}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar dataKey="ingresos" name="Ingresos" fill="var(--success)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="egresos" name="Egresos" fill="var(--danger)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
