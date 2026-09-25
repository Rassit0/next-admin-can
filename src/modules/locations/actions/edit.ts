"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { ApiError } from "@/utils/api/errors/ApiError";
import { updateTag } from "next/cache";
import { ILocation } from "../interfaces/location.interface";
import { handleServerAction } from "@/utils";

interface Props {
  id: number;
  data: {
    name: string;
    address: string;
    description: string;
    // isActive: boolean;
    isRentable: boolean;
    isInternal: boolean;
  };
}

export const editLocation = async ({
  id,
  data,
}: Props): Promise<ServiceResponse<ILocation>> => {
  return handleServerAction(async () => {
    const res = await api.patch<{ message: string; data: ILocation }>(
      `locations/${id}`,
      data,
    );

    updateTag("locations");

    return {
      error: false,
      data: res.data,
      message: res.message || "Instalación editada exitosamente",
    };
  });
};
