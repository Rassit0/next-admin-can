import { Metadata } from "next";
import { CourseCycleReportForm } from "@/modules/reports/components/CourseCycleReportForm";

export const metadata: Metadata = {
  title: "Reportes de Escuelas Deportivas | Gestión360",
};

export default function SchoolsReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reportes de Escuelas</h1>
        <p className="text-sm text-gray-500">
          Genera reportes operativos de las escuelas deportivas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CourseCycleReportForm />
      </div>
    </div>
  );
}
