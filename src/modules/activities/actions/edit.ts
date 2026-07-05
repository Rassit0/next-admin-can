"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { AddActivityProps } from "../interfaces/post.activity,interface";
import { IActivity } from "../interfaces/activity.interface";

interface Props {
  id: number;
  data: AddActivityProps;
}

export const editActivity = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<IActivity>> => {
  const { categoryIds, disciplineIds, ...res } = data;
  return handleServerAction(async () => {
    const dataRequest = {
      ...res,
      categoryIds,
      disciplineIds,
    };
    const response = await api.patch<{ message: string; data: IActivity }>(
      `activities/${id}`,
      dataRequest,
    );

    updateTag("activities");

    return {
      error: false,
      data: response.data,
      message: response.message || "Actividad editada exitosamente",
    };
  });
};
