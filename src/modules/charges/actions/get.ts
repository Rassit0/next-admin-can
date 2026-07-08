import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ICharge, IChargesResponse } from "@/modules/charges";

interface SearchParams {
  search?: string;
  per_page?: string;
  page?: string;
  playerMembershipId: string;
}

const parseCharge = (charge: ICharge): ICharge => ({
  ...charge,
  dueDate: charge.dueDate ? new Date(charge.dueDate) : new Date(),
  createdAt: charge.createdAt ? new Date(charge.createdAt) : new Date(),
  updatedAt: charge.updatedAt ? new Date(charge.updatedAt) : new Date(),
});

export const getCharges = async ({
  search,
  per_page = "10",
  page = "1",
  playerMembershipId,
}: SearchParams): Promise<ServiceResponse<IChargesResponse>> => {
  return handleServerAction(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (per_page) params.set("per_page", per_page);
    if (page) params.set("page", page);
    if (playerMembershipId)
      params.set("playerMembershipId", playerMembershipId);

    const res = await api.get<IChargesResponse>(
      `charges?${params.toString()}`,
      {
        next: {
          tags: ["charges"],
          revalidate: 3600,
        },
      },
    );

    const data = (res.data ?? []).map(parseCharge);

    return {
      error: false,
      data: { ...res, data },
      message: res.message || "Cargos obtenidos exitosamente",
    };
  });
};
