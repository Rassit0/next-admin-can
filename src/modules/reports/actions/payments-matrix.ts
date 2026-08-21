'use server';

import { api } from '@/utils/api';
import { PaymentsMatrixResponse } from '../types/payments-matrix.type';

export async function getCourseSeasonShiftMatrix(shiftId: string): Promise<PaymentsMatrixResponse> {
  return await api.get<PaymentsMatrixResponse>(`reports/payments-matrix/course-season-shifts/${shiftId}`);
}

export async function getTeamSeasonMatrix(teamSeasonId: string): Promise<PaymentsMatrixResponse> {
  return await api.get<PaymentsMatrixResponse>(`reports/payments-matrix/team-seasons/${teamSeasonId}`);
}
