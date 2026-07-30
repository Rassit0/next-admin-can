"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { InternalTransfer, InternalTransfersResponse } from '../interfaces/internal-transfer.interface';

interface SearchParams {
  page?: string;
  per_page?: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
  startDate?: string;
  endDate?: string;
}

export const getInternalTransfers = async ({
  page = "1",
  per_page = "10",
  sourceAccountId,
  destinationAccountId,
  startDate,
  endDate,
}: SearchParams = {}): Promise<ServiceResponse<InternalTransfersResponse>> => {
  return handleServerAction(async () => {
    const queryParams = new URLSearchParams({
      page,
      per_page,
    });

    if (sourceAccountId) queryParams.append("sourceAccountId", sourceAccountId);
    if (destinationAccountId) queryParams.append("destinationAccountId", destinationAccountId);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    const res = await api.get<InternalTransfersResponse>(`internal-transfers?${queryParams.toString()}`, {
      next: {
        tags: ["internal-transfers"],
        revalidate: 3600,
      },
    });

    return {
      error: false,
      data: res || {
        data: [],
        meta: {
          totalItems: 0,
          itemsPerPage: Number(per_page),
          totalPages: 0,
          currentPage: Number(page),
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: null,
          prevPage: null,
        },
      },
      message: "Transferencias obtenidas exitosamente",
    };
  });
};
