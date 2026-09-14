"use server";

import { api } from "@/modules/web/core/api/api";
import { handleServerAction, ServiceResponse } from "@/modules/web/core/utils/handleServerAction";

export interface PublicBanner {
  id: string;
  title: string;
  ctaText: string | null;
  redirectTo: string | null;
  image16x9: string;
  image1x1: string | null;
  image3x4: string | null;
  category: string | null;
  sortOrder: number;
}

export async function getPublicBanners(): Promise<ServiceResponse<PublicBanner[]>> {
  return handleServerAction(async () => {
    const data = await api.get<PublicBanner[]>("public/banners", {
      next: {
        revalidate: 3600,
        tags: ["public-banners"],
      },
    });
    return { data };
  });
}
