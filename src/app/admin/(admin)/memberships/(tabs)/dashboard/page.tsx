import { getMembershipsSummary } from '@/modules/memberships/actions/get-memberships-summary.action';
import { KpiCards } from '@/modules/memberships/components/KpiCards';
import { RevenueChart } from '@/modules/memberships/components/RevenueChart';
import { DistributionChart } from '@/modules/memberships/components/DistributionChart';
import { MembershipsAlerts } from '@/modules/memberships/components/MembershipsAlerts';
import { DashboardTables } from '@/modules/memberships/components/DashboardTables';
import { HugeiconsIcon } from '@hugeicons/react';
import { InformationCircleIcon } from '@hugeicons/core-free-icons';
import { Alert } from '@heroui/react';

export default async function MembershipsDashboardPage() {
  const response = await getMembershipsSummary();

  if (!response || response.error || !response.data) {
    return (
      <div className="p-6">
        <Alert color="danger">
          <Alert.Indicator>
            <HugeiconsIcon icon={InformationCircleIcon} />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Error al cargar</Alert.Title>
            <Alert.Description>No se pudo obtener el resumen de membresías en este momento.</Alert.Description>
          </Alert.Content>
        </Alert>
      </div>
    );
  }

  const summary = response.data;

  return (
    <div className="flex flex-col gap-8 p-1 animate-fade-in">
      {/* Alertas Críticas */}
      <MembershipsAlerts alerts={summary.alerts} />

      {/* Tarjetas KPI */}
      <KpiCards data={summary} />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={summary.revenueSummary} />
        </div>
        <div className="lg:col-span-1">
          <DistributionChart data={summary.membershipDistribution} />
        </div>
      </div>

      {/* Tablas (Deudores y Pagos Recientes) */}
      <DashboardTables 
        topDebtors={summary.topDebtors} 
        upcomingCharges={summary.upcomingCharges}
        recentPayments={summary.recentPayments} 
      />
    </div>
  );
}
