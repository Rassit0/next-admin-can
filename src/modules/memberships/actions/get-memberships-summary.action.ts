'use server';

import { api } from '@/utils/api';
import { ServiceResponse } from '@/types/api';
import { handleServerAction } from '@/utils';
import { MembershipsSummaryResponse } from '../interfaces/memberships-summary.interface';

export const getMembershipsSummary = async (): Promise<ServiceResponse<MembershipsSummaryResponse>> => {
  return handleServerAction(async () => {
    // The backend returns the raw object or { data: ... }. We fetch it with api.get
    const res = await api.get<MembershipsSummaryResponse>('memberships/summary', {
      next: {
        tags: ['memberships-summary'],
        revalidate: 60, // Refresh every 60 seconds or adjust as needed
      },
    });

    return {
      error: false,
      data: res, // Assuming CANApiAdapter parses the body and returns it
      message: 'Resumen de membresías obtenido exitosamente',
    };
  });
};
