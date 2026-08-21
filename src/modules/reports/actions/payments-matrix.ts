'use server';

import { api } from '@/utils/api';
import { ServiceResponse } from '@/types/api';
import { handleServerAction } from '@/utils';
import { PaymentsMatrixResponse } from '../types/payments-matrix.type';

export const getCourseSeasonShiftMatrix = async (shiftId: string): Promise<ServiceResponse<PaymentsMatrixResponse>> => {
  return handleServerAction(async () => {
    const res = await api.get<PaymentsMatrixResponse>(`reports/payments-matrix/course-season-shifts/${shiftId}`, {
      cache: 'no-store'
    });
    
    return {
      error: false,
      data: res,
      message: "Matriz obtenida exitosamente",
    };
  });
};

export const getTeamSeasonMatrix = async (teamSeasonId: string): Promise<ServiceResponse<PaymentsMatrixResponse>> => {
  return handleServerAction(async () => {
    const res = await api.get<PaymentsMatrixResponse>(`reports/payments-matrix/team-seasons/${teamSeasonId}`, {
      cache: 'no-store'
    });
    
    return {
      error: false,
      data: res,
      message: "Matriz obtenida exitosamente",
    };
  });
};
