import React from "react";
import {
  DashboardHeader,
  DashboardKpiGrid,
  DashboardActivityFeed,
  DashboardFinancialFlowSection,
  DashboardAccountsCard,
  DashboardOccupancyCard,
  DashboardAlertsCard,
  DashboardSportsCard,
  DashboardMotionSection,
  getDashboardSummary,
  getDashboardActivity,
  getDashboardMatches,
  resolvePeriodDates,
  IDashboardSummary,
  IDashboardActivityResponse,
  IDashboardMatchItem,
} from "@/modules/dashboard";
import { ServiceResponse } from "@/types/api";
import { getCurrentUserPermissions } from "@/shared/helpers/server-permissions";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";

interface Props {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const period =
    typeof resolvedParams.period === "string"
      ? resolvedParams.period
      : undefined;
  const from =
    typeof resolvedParams.from === "string" ? resolvedParams.from : undefined;
  const to =
    typeof resolvedParams.to === "string" ? resolvedParams.to : undefined;

  // 1. Resolver fechas según preset o parámetros personalizados
  const { from: resolvedFrom, to: resolvedTo } = resolvePeriodDates(
    period,
    from,
    to,
  );

  // 2. Verificar permisos del usuario de forma segura y en memoria (RolePermission únicamente)
  const permissions = await getCurrentUserPermissions();
  const canReadAuditLogs = permissions.includes("READ_AUDIT_LOGS");
  const canReadMatches = permissions.includes("READ_MATCHES");

  // 3. Ejecutar peticiones en paralelo con aislamiento de errores
  const [summaryResult, activityResult, matchesResult] = await Promise.allSettled([
    getDashboardSummary({
      from: resolvedFrom,
      to: resolvedTo,
    }),
    canReadAuditLogs
      ? getDashboardActivity({ limit: 10 })
      : Promise.resolve(null),
    canReadMatches
      ? getDashboardMatches({ limit: 3 })
      : Promise.resolve(null),
  ]);

  const summaryResponse: ServiceResponse<IDashboardSummary> =
    summaryResult.status === "fulfilled"
      ? summaryResult.value
      : {
          error: true,
          statusCode: 500,
          message: "Error al cargar el resumen del panel.",
        };

  const activityResponse: ServiceResponse<IDashboardActivityResponse> | null =
    activityResult.status === "fulfilled" ? activityResult.value : null;

  const matchesResponse: ServiceResponse<IDashboardMatchItem[]> | null =
    matchesResult.status === "fulfilled" ? matchesResult.value : null;

  // 4. Manejo de error graceful en caso de fallo crítico en el summary
  if (summaryResponse.error || !summaryResponse.data) {
    return (
      <div className="space-y-6">
        <DashboardHeader permissions={permissions} />
        <div className="bg-danger-50 dark:bg-danger-950/30 border border-danger-200 dark:border-danger-800 rounded-2xl p-6 text-center">
          <div className="inline-flex p-3 bg-danger-100 dark:bg-danger-900/50 rounded-xl text-danger mb-3">
            <HugeiconsIcon icon={AlertCircleIcon} size={24} />
          </div>
          <h3 className="text-base font-bold text-danger">
            No se pudo cargar el resumen del Panel de Control
          </h3>
          <p className="text-xs text-danger-700 dark:text-danger-400 mt-1 max-w-md mx-auto">
            {summaryResponse.message ||
              "Ocurrió un error al consultar las métricas ejecutivas. Verifique la conexión con el servidor."}
          </p>
        </div>
      </div>
    );
  }

  const summary = summaryResponse.data;
  const hasActivityFeed =
    canReadAuditLogs &&
    activityResponse !== null &&
    !activityResponse.error &&
    Boolean(activityResponse.data);

  const hasSportsCard =
    canReadMatches &&
    matchesResponse !== null &&
    !matchesResponse.error &&
    Boolean(matchesResponse.data);

  const hasFinancialFlow = Boolean(summary.financialFlow);
  const hasAlerts = Boolean(summary.alerts && summary.alerts.length > 0);
  const hasAccounts = Boolean(
    summary.liquidity?.accounts && summary.liquidity.accounts.length > 0,
  );
  const hasOccupancy = Boolean(
    summary.coursesOccupancy?.topOccupiedShifts &&
      summary.coursesOccupancy.topOccupiedShifts.length > 0,
  );

  return (
    <div className="space-y-6">
      {/* Fallback de accesibilidad SSR si JavaScript está deshabilitado */}
      <noscript>
        <style>{`[data-motion-section] { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>

      {/* 1. Header con Quick Actions adaptativo y selector de período */}
      <DashboardHeader permissions={permissions} />

      {/* 2. Grid de KPIs P0 con datos reales y layout adaptativo por RBAC */}
      <DashboardMotionSection delay={0.04}>
        <DashboardKpiGrid summary={summary} />
      </DashboardMotionSection>

      {/* 3. Bento Grid - Fila Superior: Flujo Financiero (ComposedChart) + Alertas */}
      {(hasFinancialFlow || hasAlerts) && (
        <DashboardMotionSection delay={0.08}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {hasFinancialFlow && (
              <section
                className={hasAlerts ? "lg:col-span-2" : "col-span-full"}
              >
                <DashboardFinancialFlowSection
                  financialFlow={summary.financialFlow}
                  periodLabel={summary.period.label}
                />
              </section>
            )}

            {hasAlerts && (
              <section
                className={hasFinancialFlow ? "lg:col-span-1" : "col-span-full"}
              >
                <DashboardAlertsCard alerts={summary.alerts} />
              </section>
            )}
          </div>
        </DashboardMotionSection>
      )}

      {/* 4. Bento Grid - Fila Media: Cuentas Financieras + Ocupación de Turnos */}
      {(hasAccounts || hasOccupancy) && (
        <DashboardMotionSection delay={0.12}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {hasAccounts && (
              <section className={hasOccupancy ? "lg:col-span-1" : "col-span-full"}>
                <DashboardAccountsCard liquidity={summary.liquidity} />
              </section>
            )}

            {hasOccupancy && (
              <section className={hasAccounts ? "lg:col-span-1" : "col-span-full"}>
                <DashboardOccupancyCard
                  coursesOccupancy={summary.coursesOccupancy}
                />
              </section>
            )}
          </div>
        </DashboardMotionSection>
      )}

      {/* 5. Bento Grid - Fila Inferior: Feed de Actividad + Deportes Real */}
      {(hasActivityFeed || hasSportsCard) && (
        <DashboardMotionSection delay={0.16}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {hasActivityFeed && (
              <section className={hasSportsCard ? "lg:col-span-2" : "col-span-full"}>
                <DashboardActivityFeed items={activityResponse!.data!.items} />
              </section>
            )}

            {hasSportsCard && (
              <section className={hasActivityFeed ? "lg:col-span-1" : "col-span-full"}>
                <DashboardSportsCard matches={matchesResponse!.data!} />
              </section>
            )}
          </div>
        </DashboardMotionSection>
      )}
    </div>
  );
}
