import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IStudentMembership } from "@/modules/student-memberships";

interface SearchParams {
  id: string;
  callbackUrl?: string;
}

export const getStudentMembershipById = async ({
  id,
}: SearchParams): Promise<ServiceResponse<IStudentMembership>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: IStudentMembership }>(
      `student-memberships/${id}`,
      {
        next: {
          tags: ["student-memberships", "charges"],
          revalidate: 3600,
        },
      },
    );

    return {
      error: false,
      data: {
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      },
      message: "Membresía de jugador obtenida exitosamente",
    };
  });
};
