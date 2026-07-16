import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { ISeasonSummaryResponse } from "@/modules/course-seasons";

interface SearchParams {
  id: string;
}

export const getCourseSeasonSummary = async ({
  id,
}: SearchParams): Promise<ServiceResponse<ISeasonSummaryResponse>> => {
  return handleServerAction(async () => {
    const res = await api.get<ISeasonSummaryResponse>(
      `course-seasons/${id}/summary`,
      {
        next: {
          tags: [
            "course-seasons",
            `course-season-summary-${id}`,
            "student-memberships",
            "payments",
            "charges",
          ],
          revalidate: 60,
        },
      },
    );

    return {
      error: false,
      data: res,
      message: res.message || "Resumen obtenido exitosamente",
    };
  });
};
