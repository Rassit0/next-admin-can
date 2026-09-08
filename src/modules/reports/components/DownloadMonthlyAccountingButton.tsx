"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { downloadMonthlyAccountingAction } from "../actions/download-monthly-accounting.action";
import { toast } from "sonner";

export function DownloadMonthlyAccountingButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  const handleDownload = async () => {
    if (!selectedDate) {
      toast.error("Por favor seleccione un mes y año.");
      return;
    }

    try {
      setIsLoading(true);
      const [yearStr, monthStr] = selectedDate.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);

      const result = await downloadMonthlyAccountingAction({ year, month });

      if (!result.success || !result.url) {
        throw new Error(result.error || "Error al generar el reporte");
      }

      const base64Part = result.url.split(",")[1];
      const byteCharacters = atob(base64Part);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Informe_Contable_Mensual_${year}_${String(month).padStart(2, "0")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      toast.success("Reporte generado exitosamente");
    } catch (error: any) {
      toast.error(
        error.message || "Ocurrió un error inesperado al descargar el reporte",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="space-y-2">
        <label className="text-sm font-medium">Mes y Año</label>
        <input
          type="month"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full flex h-10 rounded-md border border-default-200 bg-white dark:bg-zinc-900 px-3 py-2 text-sm placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="h-px bg-default-200 w-full my-2" />
      <Button
        className="w-full"
        variant="primary"
        onClick={handleDownload}
        isDisabled={isLoading || !selectedDate}
      >
        {!isLoading && <HugeiconsIcon icon={Download01Icon} />}
        Descargar Excel
      </Button>
    </div>
  );
}
