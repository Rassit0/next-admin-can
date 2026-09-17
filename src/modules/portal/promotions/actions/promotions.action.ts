"use server";

import { api } from "@/modules/portal/core/api/api";
import { handleServerAction, ServiceResponse } from "@/modules/portal/core/utils/handleServerAction";

export interface PublicPromotion {
  id: string;
  title: string;
  ctaText: string | null;
  redirectTo: string | null;
  image16x9: string;
  image1x1: string | null;
  image3x4: string | null;
  position: 'PROMO_1' | 'PROMO_2';
}

export interface PublicPromotionsResponse {
  promo1: PublicPromotion | null;
  promo2: PublicPromotion | null;
}

export async function getPublicPromotions(): Promise<ServiceResponse<PublicPromotionsResponse>> {
  return handleServerAction(async () => {
    const data = await api.get<PublicPromotionsResponse>("public/promotions", {
      next: {
        revalidate: 3600,
        tags: ["public-promotions"],
      },
    });
    return { data };
  });
}
