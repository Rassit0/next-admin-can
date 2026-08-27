import React from "react";
import { File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DateRangeFilter } from "@/ui";
import { DownloadReportButton } from "@/modules/reports/components/DownloadReportButton";

export const metadata = {
  title: "Reportes | Contabilidad",
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{
    general_start?: string;
    general_end?: string;
    closures_start?: string;
    closures_end?: string;
    detailed_start?: string;
    detailed_end?: string;
  }>;
}) {
  const {
    general_start,
    general_end,
    closures_start,
    closures_end,
    detailed_start,
    detailed_end,
  } = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Catálogo de Reportes
        </h2>
        <p className="text-default-500">
          Genera y exporta reportes financieros y consolidados del sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta: Reporte General de Contabilidad */}
        {/* <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-default-200 shadow-sm overflow-hidden">
          <div className="flex flex-col gap-3 p-6 pb-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={File01Icon} className="text-primary" />
              <p className="text-md font-bold">Reporte General</p>
            </div>
            <p className="text-sm text-default-500">
              Resumen ejecutivo de ingresos, egresos, saldos de cuentas y deuda viva. Ideal para control gerencial.
            </p>
          </div>
          <div className="h-px bg-default-200 w-full" />
          <div className="flex-1 space-y-4 p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Período de análisis</label>
              <DateRangeFilter startKey="general_start" endKey="general_end" />
            </div>
          </div>
          <div className="h-px bg-default-200 w-full" />
          <div className="p-6 pt-4">
            <DownloadReportButton reportId="accounting.general" start={general_start} end={general_end} />
          </div>
        </div> */}

        {/* Tarjeta: Informe de Arqueos de Caja */}
        <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-default-200 shadow-sm overflow-hidden">
          <div className="flex flex-col gap-3 p-6 pb-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={File01Icon} className="text-primary" />
              <p className="text-md font-bold">Informe de Arqueos de Caja</p>
            </div>
            <p className="text-sm text-default-500">
              Auditoría financiera de tesorería. Historial de cierres, sobrantes
              y faltantes agrupados por caja física.
            </p>
          </div>
          <div className="h-px bg-default-200 w-full" />
          <div className="flex-1 space-y-4 p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Período de análisis</label>
              <DateRangeFilter
                startKey="closures_start"
                endKey="closures_end"
              />
            </div>
          </div>
          <div className="h-px bg-default-200 w-full" />
          <div className="p-6 pt-4">
            <DownloadReportButton
              reportId="accounting.cash-closures"
              start={closures_start}
              end={closures_end}
            />
          </div>
        </div>

        {/* Tarjeta: Reporte Detallado de Contabilidad */}
        <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-default-200 shadow-sm overflow-hidden">
          <div className="flex flex-col gap-3 p-6 pb-4">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={File01Icon} className="text-primary" />
              <p className="text-md font-bold">Reporte Detallado</p>
            </div>
            <p className="text-sm text-default-500">
              Desglose de ingresos por grupos concepto (Escuelas, Equipos),
              detallando recibos y distribución en cuentas financieras.
            </p>
          </div>
          <div className="h-px bg-default-200 w-full" />
          <div className="flex-1 space-y-4 p-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Período de análisis</label>
              <DateRangeFilter
                startKey="detailed_start"
                endKey="detailed_end"
              />
            </div>
          </div>
          <div className="h-px bg-default-200 w-full" />
          <div className="p-6 pt-4">
            <DownloadReportButton
              reportId="accounting.detailed"
              start={detailed_start}
              end={detailed_end}
            />
          </div>
        </div>

        {/* Espacio para futuros reportes (ej. Reporte de Deudores) */}
        <div className="flex flex-col bg-default-50 border-2 border-dashed border-default-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <HugeiconsIcon icon={File01Icon} className="text-default-500" />
            <p className="text-md font-bold text-default-500">
              Más reportes próximamente
            </p>
          </div>
          <p className="text-sm text-default-400">
            Nuevos reportes como "Estado de Deudores" se irán añadiendo aquí.
          </p>
        </div>
      </div>
    </div>
  );
}
