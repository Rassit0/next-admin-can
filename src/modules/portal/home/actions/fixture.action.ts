"use server";

import { api } from "@/modules/portal/core/api/api";
import {
  handleServerAction,
  ServiceResponse,
} from "@/modules/portal/core/utils/handleServerAction";

export interface PublicFixture {
  id: string;
  homeCategoryName: string | null;
  awayCategoryName: string | null;
  locationName: string | null;
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

export interface GetPublicFixtureParams {
  from?: string;
  to?: string;
}

export const getPublicFixture = async (
  params?: GetPublicFixtureParams,
): Promise<ServiceResponse<PublicFixture[]>> => {
  return handleServerAction(async () => {
    let url = `public/matches/fixture`;
    if (params?.from && params?.to) {
      const searchParams = new URLSearchParams();
      searchParams.set("from", params.from);
      searchParams.set("to", params.to);
      url += `?${searchParams.toString()}`;
    }

    const res = await api.get<{ message: string; data: PublicFixture[] }>(url, {
      next: {
        tags: ["public-fixtures"],
        revalidate: 1800,
      },
    });

    return {
      error: false,
      data: res.data || [],
      message: res.message || "Fixture piºblico obtenido exitosamente",
    };
  });
};
