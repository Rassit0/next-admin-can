"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { IPerson, PostPersonInterface } from "@/modules/persons";
import { handleServerAction } from "@/utils";

interface Props {
  data: PostPersonInterface;
}

export const addPerson = async ({
  data,
}: Props): Promise<ServiceResponse<IPerson>> => {
  return handleServerAction(async () => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("lastName", data.lastName);
    formData.append("secondLastName", data.secondLastName || "");
    formData.append("gender", data.gender);
    formData.append("documentType", data.documentType);
    formData.append("documentNumber", data.documentNumber);
    if (data.email) formData.append("email", data.email);
    if (data.phone) formData.append("phone", data.phone);
    if (data.address) formData.append("address", data.address);
    if (data.image) formData.append("image", data.image);
    if (data.birthDate)
      formData.append("birthDate", data.birthDate.toISOString());

    const res = await api.post<{ message: string; data: IPerson }>(
      `persons`,
      formData,
    );

    updateTag("persons");
    return {
      error: false,
      data: res.data,
      message: res.message || "Persona agregada exitosamente",
    };
  });
};
