'use client';

import { Card } from '@heroui/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserGroupIcon, MoneyReceiveCircleIcon, Alert01Icon } from '@hugeicons/core-free-icons';
import { formatCurrency } from '@/utils/constants';

interface KpiCardsProps {
  data: {
    counters: {
      active: number;
    };
    financialSummary: {
      totalPendingDebt: number;
      collectedThisMonth: number;
    };
    membershipGrowth: {
      newThisMonth: number;
      growthPercentage: number;
    };
  };
}

export const KpiCards = ({ data }: KpiCardsProps) => {
  const { counters, financialSummary, membershipGrowth } = data;

  const kpis = [
    {
      title: 'Membresías Activas',
      value: counters.active.toString(),
      icon: <HugeiconsIcon icon={UserGroupIcon} size={24} className="text-primary" />,
      subtext: `${membershipGrowth.newThisMonth} nuevas este mes`,
      trend: membershipGrowth.growthPercentage,
    },
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(financialSummary.collectedThisMonth),
      icon: <HugeiconsIcon icon={MoneyReceiveCircleIcon} size={24} className="text-success" />,
      subtext: 'Cobrado en el mes actual',
    },
    {
      title: 'Deuda Pendiente',
      value: formatCurrency(financialSummary.totalPendingDebt),
      icon: <HugeiconsIcon icon={Alert01Icon} size={24} className="text-danger" />,
      subtext: 'Total por cobrar',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="border-none bg-background/60 dark:bg-default-100/50 shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-default-500 font-medium">{kpi.title}</p>
              <h3 className="text-3xl font-bold mt-2">{kpi.value}</h3>
            </div>
            <div className="p-2 bg-default-100 dark:bg-default-50 rounded-xl">
              {kpi.icon}
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            {kpi.trend !== undefined && (
              <span className={`text-xs font-semibold ${kpi.trend >= 0 ? 'text-success' : 'text-danger'}`}>
                {kpi.trend >= 0 ? '+' : ''}{kpi.trend}%
              </span>
            )}
            <span className="text-xs text-default-400">{kpi.subtext}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
