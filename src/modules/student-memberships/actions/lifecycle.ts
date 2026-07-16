"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { updateTag } from "next/cache";
import { handleServerAction } from "@/utils";
import { IStudentMembership } from "@/modules/student-memberships";

export type MembershipLifecycleAction =
  | "finish"
  | "suspend"
  | "withdraw"
  | "reactivate"
  | "activate";

const messages: Record<MembershipLifecycleAction, string> = {
  finish: "Membresía finalizada exitosamente",
  suspend: "Membresía suspendida exitosamente",
  withdraw: "Atleta dado de baja exitosamente",
  reactivate: "Membresía reactivada exitosamente",
  activate: "Membresía activada exitosamente",
};

export const updateMembershipLifecycle = async ({
  id,
  action,
  reason,
}: {
  id: string;
  action: MembershipLifecycleAction;
  reason?: string;
}): Promise<ServiceResponse<IStudentMembership>> => {
  return handleServerAction(async () => {
    const response = await api.post<{
      message: string;
      data: IStudentMembership;
    }>(`student-memberships/${action}/${id}`, reason ? { reason } : {});

    updateTag("student-memberships");
    return {
      error: false,
      data: response.data,
      message: response.message || messages[action],
    };
  });
};
