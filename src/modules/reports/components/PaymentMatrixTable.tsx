"use client";

import { Table, Card, Spinner, Button } from "@heroui/react";
import { useState } from "react";
import { Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PaymentsMatrixResponse } from "../types/payments-matrix.type";
import { downloadMatrixAction } from "../actions/download-matrix.action";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/constants";
import { useSearchParams } from "next/navigation";

const getChargeLabel = (type: string) => {
  switch (type) {
    case "RECURRING_FEE":
      return "Cuota";
    case "LATE_FEE":
      return "Mora";
    case "REGISTRATION":
      return "Matrícula";
    case "MANUAL":
      return "Manual";
    default:
      return type;
  }
};

const formatUTCDate = (isoDateString: string) => {
  const d = new Date(isoDateString);
  const day = d.getUTCDate().toString().padStart(2, "0");
  const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = d.getUTCFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

interface PaymentMatrixTableProps {
  data: PaymentsMatrixResponse | null;
  isLoading?: boolean;
  error?: string | null;
}

export function PaymentMatrixTable({
  data,
  isLoading,
  error,
}: PaymentMatrixTableProps) {
  const searchParams = useSearchParams();
  const teamSeasonCategoryId = searchParams.get("teamSeasonCategoryId");
  const [isDownloading, setIsDownloading] = useState(false);

  if (isLoading) {
    return (
      <Card className="w-full h-64 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-default-500">Cargando matriz de pagos...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-danger-50 border-danger p-6 flex flex-col items-center">
        <p className="font-semibold text-danger">Error al cargar la matriz</p>
        <p className="text-sm text-danger">{error}</p>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const { group, periods, students } = data;

  if (students.length === 0) {
    return (
      <Card className="w-full p-10 flex flex-col items-center">
        <p className="text-default-500">
          No hay estudiantes registrados en este turno/temporada.
        </p>
      </Card>
    );
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const isCourse = group.type === "COURSE_SEASON_SHIFT";
      const endpoint = isCourse
        ? `reports/payments-matrix/course-season-shifts/${group.id}/pdf`
        : `reports/payments-matrix/team-seasons/${group.id}/pdf${teamSeasonCategoryId ? `?teamSeasonCategoryId=${teamSeasonCategoryId}` : ""}`;

      const result = await downloadMatrixAction(endpoint);

      if (!result.success || !result.url) {
        throw new Error(result.error || "Error al descargar el PDF");
      }

      const base64Part = result.url.split(",")[1];
      const byteCharacters = atob(base64Part);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      toast.success("Reporte generado exitosamente");
    } catch (error: any) {
      toast.error(
        error.message || "Ocurrió un error inesperado al descargar el reporte",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">Control de Pagos</h3>
          <p className="text-sm text-default-500">
            {group.name} {group.category ? ` - ${group.category}` : ""}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleDownload}
          isDisabled={isDownloading}
        >
          {!isDownloading && <HugeiconsIcon icon={Download01Icon} />}
          {isDownloading ? "Generando..." : "Imprimir PDF"}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table aria-label="Matriz de pagos" className="min-w-max">
          <Table.ScrollContainer>
            <Table.Content>
              <Table.Header>
                <Table.Column
                  isRowHeader
                  className="min-w-50 border-x border-default-200 bg-default-100"
                >
                  Estudiante
                </Table.Column>
                <Table.Column className="text-center min-w-25 border-x border-default-200 bg-default-100">
                  Matrícula
                </Table.Column>
                {periods.map((period) => (
                  <Table.Column
                    key={period.key}
                    className="text-center min-w-25 border-x border-default-200 bg-default-100"
                  >
                    {period.label}
                  </Table.Column>
                ))}
                <Table.Column className="text-center min-w-25 font-bold border-x border-default-200 bg-default-100">
                  Total General
                </Table.Column>
              </Table.Header>
              <Table.Body>
                {students.map((student) => (
                  <Table.Row key={student.id} id={student.id}>
                    <Table.Cell className="font-medium border-x border-b border-default-200 align-top py-3">
                      {student.name}
                    </Table.Cell>
                    
                    {!student.registration || student.registration.totalPaid === 0 ? (
                      <Table.Cell className="text-center text-default-300 border-x border-b border-default-200 align-top py-3"></Table.Cell>
                    ) : (
                      <Table.Cell className="text-center min-w-30 border-x border-b border-default-200 align-top py-3">
                        <div className="flex flex-col h-full">
                          <div className="font-semibold text-center border-b border-default-200 pb-2 mb-2">
                            {formatCurrency(student.registration.totalPaid)}
                          </div>
                          <div className="flex flex-col gap-3 flex-1">
                            {student.registration.payments.map((p, idx) => {
                              const uniqueKey = idx;
                              let receiptLine = p.receiptNumber || "";
                              if (p.date) {
                                if (receiptLine) receiptLine += " · ";
                                receiptLine += formatUTCDate(p.date);
                              }
                              return (
                                <div key={uniqueKey} className="flex flex-col text-xs text-center">
                                  <span className="font-medium text-default-700">
                                    {formatCurrency(p.amount)} {getChargeLabel(p.chargeType)}
                                  </span>
                                  {receiptLine && (
                                    <span className="text-default-500 mt-0.5">{receiptLine}</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </Table.Cell>
                    )}
                    {periods.map((period) => {
                      const periodData = student.paymentsByPeriod[period.key];
                      if (!periodData || periodData.totalPaid === 0) {
                        return (
                          <Table.Cell
                            key={period.key}
                            className="text-center text-default-300 border-x border-b border-default-200 align-top py-3"
                          ></Table.Cell>
                        );
                      }

                      return (
                        <Table.Cell
                          key={period.key}
                          className="text-center min-w-30 border-x border-b border-default-200 align-top py-3"
                        >
                          <div className="flex flex-col h-full">
                            <div className="font-semibold text-center border-b border-default-200 pb-2 mb-2">
                              {formatCurrency(periodData.totalPaid)}
                            </div>

                            <div className="flex flex-col gap-3 flex-1">
                              {periodData.payments.map((p, idx) => {
                                // Fallback a index si no hay ID, aunque idealmente debería haber un ID.
                                // Si en el futuro backend añade ID, se puede usar p.id.
                                const uniqueKey = idx;

                                let receiptLine = p.receiptNumber || "";
                                if (p.date) {
                                  if (receiptLine) receiptLine += " · ";
                                  receiptLine += formatUTCDate(p.date);
                                }

                                return (
                                  <div
                                    key={uniqueKey}
                                    className="flex flex-col text-xs text-center"
                                  >
                                    <span className="font-medium text-default-700">
                                      {formatCurrency(p.amount)}{" "}
                                      {getChargeLabel(p.chargeType)}
                                    </span>
                                    {receiptLine && (
                                      <span className="text-default-500 mt-0.5">
                                        {receiptLine}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </Table.Cell>
                      );
                    })}
                    <Table.Cell className="text-center border-x border-b border-default-200 align-top py-3">
                      <span className="font-bold text-success-600">
                        {formatCurrency(
                          (student.registration?.totalPaid ?? 0) +
                          Object.values(student.paymentsByPeriod).reduce(
                            (sum, periodData) => sum + periodData.totalPaid,
                            0,
                          ),
                        )}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </div>
  );
}
