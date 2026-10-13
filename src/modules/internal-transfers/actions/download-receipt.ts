'use server';

import { api } from '@/utils/api';

export async function downloadInternalTransferReceipt(id: string) {
  try {
    const blob = await api.getBlob(`internal-transfers/${id}/receipt`);
    
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64}`;

    return { success: true, url: dataUrl };
  } catch (error: any) {
    console.error('Error downloading internal transfer receipt:', error);
    return { success: false, error: error.message };
  }
}
