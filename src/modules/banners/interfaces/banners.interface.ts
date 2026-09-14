export interface IBanner {
  id: string;
  title: string;
  ctaText: string | null;
  redirectTo: string | null;
  image16x9: string;
  image1x1: string | null;
  image3x4: string | null;
  category: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostBannerInterface {
  title: string;
  ctaText?: string;
  redirectTo?: string;
  image16x9: string;
  image1x1?: string;
  image3x4?: string;
  category?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateBannerInterface extends Partial<PostBannerInterface> {}
