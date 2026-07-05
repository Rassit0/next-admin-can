import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { IActivity } from "../interfaces/activity.interface";
import { handleServerAction } from "@/utils";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getActivityById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<IActivity>> => {
  return handleServerAction(async () => {
    const res = await api.get<IActivity>(`activities/${id}`, {
      next: {
        tags: ["activities", "categories", "disciplines"],
        revalidate: 3600,
      },
    });

    const data = {
      ...res,
      startDate: new Date(res.startDate),
      endDate: new Date(res.endDate),
    };

    return {
      error: false,
      data,
      message: "Actividad obtenida exitosamente",
    };
  });
};
