export interface IPromotion {
  id: string;
  title: string;
  ctaText: string | null;
  redirectTo: string | null;
  image16x9: string;
  image1x1: string | null;
  image3x4: string | null;
  position: 'PROMO_1' | 'PROMO_2';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostPromotionInterface {
  title: string;
  ctaText?: string;
  redirectTo?: string;
  image16x9: string;
  image1x1?: string;
  image3x4?: string;
  position: 'PROMO_1' | 'PROMO_2';
  isActive?: boolean;
}

export interface UpdatePromotionInterface extends Partial<PostPromotionInterface> {}
