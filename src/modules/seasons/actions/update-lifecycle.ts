"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISeason } from "../interfaces/season.interface";
import { updateTag } from "next/cache";

export type SeasonLifecycleAction = "extend" | "finish" | "cancel";

interface UpdateLifecycleParams {
  id: string;
  action: SeasonLifecycleAction;
  reason: string;
  newEndDate?: string;
}

export const updateSeasonLifecycle = async ({
  id,
  action,
  reason,
  newEndDate,
}: UpdateLifecycleParams): Promise<
  ServiceResponse<{ data: ISeason; message: string }>
> => {
  return handleServerAction(async () => {
    let payload: any = { reason };

    if (action === "extend") {
      payload.newEndDate = newEndDate;
    }

    const res = await api.patch<{ message: string; data: ISeason }>(
      `seasons/${id}/${action}`,
      payload,
      // {
      //   next: { tags: ["seasons"] }, // or revalidate tags
      // },
    );

    updateTag("seasons");

    return {
      error: false,
      data: {
        ...res,
        data: {
          ...res.data,
          startDate: new Date(res.data.startDate),
          endDate: new Date(res.data.endDate),
          createdAt: new Date(res.data.createdAt),
          updatedAt: new Date(res.data.updatedAt),
        },
      },
      message: res.message || "Acción ejecutada correctamente",
    };
  });
};
