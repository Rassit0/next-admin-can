'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { Download01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { downloadReportAction } from '../actions/download-report.action';
import { toast } from 'sonner';

interface Props {
  reportId: string;
  start?: string;
  end?: string;
  format?: string;
}

export function DownloadReportButton({ reportId, start, end, format = 'pdf' }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const result = await downloadReportAction({ reportId, start, end, format });
      
      if (!result.success || !result.url) {
        throw new Error(result.error || 'Error al generar el reporte');
      }

      // Convert data URL to Blob to prevent browser hanging on large base64 strings
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
      
      // Clean up object URL after a while
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      toast.success('Reporte generado exitosamente');
    } catch (error: any) {
      toast.error(error.message || 'Ocurrió un error inesperado al descargar el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      className="w-full" 
      variant="primary"
      onClick={handleDownload} 
      isDisabled={isLoading}
    >
      {!isLoading && <HugeiconsIcon icon={Download01Icon} />}
      Descargar PDF
    </Button>
  );
}
