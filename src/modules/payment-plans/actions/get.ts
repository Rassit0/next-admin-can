import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IPaymentPlanResponse } from "@/modules/payment-plans";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  teamSeasonId: string;
  callbackUrl?: string;
}

export const getPaymentPlans = async ({
  search,
  per_page = "5",
  page = "1",
  teamSeasonId,
}: SearchParams): Promise<ServiceResponse<IPaymentPlanResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    params.set("teamSeasonId", teamSeasonId);

    const res = await api.get<IPaymentPlanResponse>(
      `payment-plans?${params.toString()}`,
      {
        next: {
          tags: ["payment-plans"],
          revalidate: 3600,
        },
      },
    );

    const data = res.data.map((category) => ({
      ...category,
      createdAt: new Date(category.createdAt),
      updatedAt: new Date(category.updatedAt),
    }));

    return {
      error: false,
      data: {
        ...res,
        data,
      },
      message: res.message || "Planes de pago obtenidos exitosamente",
    };
  });
};
