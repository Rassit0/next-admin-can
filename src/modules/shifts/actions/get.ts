"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IShiftResponse } from "@/modules/shifts";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  institutionId?: string;
}

export const getShifts = async ({
  search,
  per_page = "5",
  page = "1",
  institutionId,
}: SearchParams): Promise<ServiceResponse<IShiftResponse>> => {
  const session = await auth();

  if (!session?.user) return { error: true, statusCode: 401, message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente." } as any;

  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (institutionId) params.set("institutionId", institutionId);

    const res = await api.get<IShiftResponse>(
      `shifts?${params.toString()}`,
      {
        next: {
          tags: ["shifts"],
          revalidate: 3600,
        },
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      },
    );

    const data = res.data.map((shift) => ({
      ...shift,
      createdAt: new Date(shift.createdAt),
      updatedAt: new Date(shift.updatedAt),
    }));

    return {
      error: false,
      data: {
        ...res,
        data,
      },
      message: res.message || "Turnos obtenidos exitosamente",
    };
  });
};

