"use server";

import { api } from "@/modules/portal/core/api/api";
import { handleServerAction, ServiceResponse } from "@/modules/portal/core/utils/handleServerAction";

export interface PublicFixture {
  id: string;
  category: string;
  locationName: string;
  date: string;
  homeTeam: {
    name: string;
    imageUrl: string | null;
  };
  awayTeam: {
    name: string;
    imageUrl: string | null;
  };
  homeScore: number | null;
  awayScore: number | null;
  status: "PENDING" | "PLAYED";
  discipline: string;
}

export const getPublicFixture = async (): Promise<ServiceResponse<PublicFixture[]>> => {
  return handleServerAction(async () => {
    const res = await api.get<{ message: string; data: PublicFixture[] }>(
      `public/matches/fixture`,
      {
        next: {
          tags: ["public-fixtures"],
          revalidate: 1800,
        },
      },
    );

    return {
      error: false,
      data: res.data || [],
      message: res.message || "Fixture público obtenido exitosamente",
    };
  });
};
