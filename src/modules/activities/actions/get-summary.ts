import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import {
  ActivityType,
  IActivitiesResponse,
  IActivitySummary,
} from "../interfaces/activity.interface";
import { handleServerAction } from "@/utils";

interface SearchParams {
  organizationId?: number;
  callbackUrl?: string;
}

export const getActivitiesSummary = async ({
  organizationId,
}: SearchParams): Promise<ServiceResponse<IActivitySummary>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (organizationId) params.set("organizationId", organizationId.toString());
    const res = await api.get<IActivitySummary>(
      `activities/summary?${params.toString()}`,
      {
        next: {
          tags: ["activities", "categories", "disciplines"],
          revalidate: 3600,
        },
      },
    );

    return {
      error: false,
      data: res,
      message: "Resumen de actividades obtenido exitosamente",
    };
  });
};
