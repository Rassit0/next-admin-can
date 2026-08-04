'use server';

import { api } from '@/utils/api';

interface DownloadReportParams {
  reportId: string;
  start?: string;
  end?: string;
  format?: string;
}

export async function downloadReportAction({ reportId, start, end, format = 'pdf' }: DownloadReportParams) {
  try {
    const query = new URLSearchParams();
    query.append('id', reportId);
    query.append('format', format);
    if (start) query.append('start', start);
    if (end) query.append('end', end);

    const blob = await api.getBlob(`reports/download?${query.toString()}`);
    
    // We need to convert the blob to a base64 or Data URL so we can pass it to the client, 
    // OR just return the direct API URL if it's publicly accessible (which it shouldn't be).
    // Actually, Server Actions cannot return Blob directly to the client.
    // The standard way is to return the object URL or base64.
    
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64}`;

    return { success: true, url: dataUrl };
  } catch (error: any) {
    console.error('Error downloading report:', error);
    return { success: false, error: error.message };
  }
}
