'use server';

import { api } from '@/utils/api';

export async function downloadMatrixAction(endpoint: string) {
  try {
    const blob = await api.getBlob(endpoint);
    
    // We need to convert the blob to a base64 or Data URL so we can pass it to the client
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64}`;

    return { success: true, url: dataUrl };
  } catch (error: any) {
    console.error('Error downloading matrix report:', error);
    return { success: false, error: error.message };
  }
}
