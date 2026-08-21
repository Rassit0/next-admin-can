'use client';

import {
  Table,
  Card,
  Spinner,
  Button
} from '@heroui/react';
import { useState } from 'react';
import { Download01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { PaymentsMatrixResponse } from '../types/payments-matrix.type';
import { downloadMatrixAction } from '../actions/download-matrix.action';
import { toast } from 'sonner';

interface PaymentMatrixTableProps {
  data: PaymentsMatrixResponse | null;
  isLoading?: boolean;
  error?: string | null;
}

export function PaymentMatrixTable({ data, isLoading, error }: PaymentMatrixTableProps) {
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
        <p className="text-default-500">No hay estudiantes registrados en este turno/temporada.</p>
      </Card>
    );
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const isCourse = group.type === 'COURSE_SEASON_SHIFT';
      const endpoint = isCourse 
        ? `reports/payments-matrix/course-season-shifts/${group.id}/pdf`
        : `reports/payments-matrix/team-seasons/${group.id}/pdf`;
        
      const result = await downloadMatrixAction(endpoint);
      
      if (!result.success || !result.url) {
        throw new Error(result.error || 'Error al descargar el PDF');
      }
      
      const base64Part = result.url.split(',')[1];
      const byteCharacters = atob(base64Part);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, '_blank');
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      toast.success('Reporte generado exitosamente');
    } catch (error: any) {
      toast.error(error.message || 'Ocurrió un error inesperado al descargar el reporte');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">Control de Pagos</h3>
          <p className="text-sm text-default-500">{group.name} {group.category ? ` - ${group.category}` : ''}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleDownload}
          isDisabled={isDownloading}
        >
          {!isDownloading && <HugeiconsIcon icon={Download01Icon} />}
          {isDownloading ? 'Generando...' : 'Imprimir PDF'}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table aria-label="Matriz de pagos" className="min-w-max">
          <Table.Header>
            <Table.Column className="min-w-[200px]">Estudiante</Table.Column>
            {periods.map(period => (
              <Table.Column key={period.key} className="text-center min-w-[100px]">
                {period.label}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body>
            {students.map(student => (
              <Table.Row key={student.id} id={student.id}>
                <Table.Cell className="font-medium">{student.name}</Table.Cell>
                {periods.map(period => {
                  const periodData = student.paymentsByPeriod[period.key];
                  if (!periodData || periodData.totalPaid === 0) {
                    return (
                      <Table.Cell key={period.key} className="text-center text-default-300">
                      </Table.Cell>
                    );
                  }

                  const lastPayment = periodData.payments[periodData.payments.length - 1];
                  const formattedDate = lastPayment 
                    ? new Date(lastPayment.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }) 
                    : '';

                  return (
                    <Table.Cell key={period.key} className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">${periodData.totalPaid}</span>
                        {formattedDate && (
                          <span className="text-xs text-default-400">{formattedDate}</span>
                        )}
                      </div>
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
