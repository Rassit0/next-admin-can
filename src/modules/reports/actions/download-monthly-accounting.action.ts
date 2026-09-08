'use server';

import { api } from '@/utils/api';

interface DownloadMonthlyAccountingParams {
  year: number;
  month: number;
}

export async function downloadMonthlyAccountingAction({ year, month }: DownloadMonthlyAccountingParams) {
  try {
    const query = new URLSearchParams();
    query.append('year', year.toString());
    query.append('month', month.toString());

    const blob = await api.getBlob(`reports/monthly-accounting?${query.toString()}`);
    
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;

    return { success: true, url: dataUrl };
  } catch (error: any) {
    console.error('Error downloading monthly accounting report:', error);
    return { success: false, error: error.message };
  }
}
