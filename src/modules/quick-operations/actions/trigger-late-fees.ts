"use server";
import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { updateTag } from "next/cache";

export const triggerLateFeesAction = async (): Promise<
  ServiceResponse<void>
> => {
  return handleServerAction(async () => {
    // We execute the club engine
    await api.post("membership-charges/apply-mass", undefined);

    // Invalidate the cache so the UI updates
    updateTag("charges");
    updateTag("player-memberships");

    return {
      error: false,
      data: undefined,
      message:
        "Motor de moras ejecutado exitosamente. Los recargos se han sincronizado.",
    };
  });
};
