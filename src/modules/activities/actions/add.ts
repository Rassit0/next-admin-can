"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IActivity } from "../interfaces/activity.interface";
import { handleServerAction } from "@/utils";
import { AddActivityProps } from "../interfaces/post.activity,interface";

export const addActivity = async (
  data: AddActivityProps,
): Promise<ServiceResponse<IActivity>> => {
  const { startDate, endDate, categoryIds, disciplineIds, ...res } = data;
  return handleServerAction(async () => {
    const dataRequest = {
      ...res,
      startDate,
      endDate,
      categoryIds,
      disciplineIds,
    };
    console.log(dataRequest);
    const response = await api.post<{ message: string; data: IActivity }>(
      `activities`,
      dataRequest,
    );

    updateTag("activities");
    return {
      error: false,
      data: response.data,
      message: response.message || "Actividad agregada exitosamente",
    };
  });
};
