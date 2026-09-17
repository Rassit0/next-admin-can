export interface IHeroBanner {
  id: string;
  title: string;
  ctaText: string | null;
  redirectTo: string | null;
  image16x9: string;
  image1x1: string | null;
  image3x4: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostHeroBannerInterface {
  title: string;
  ctaText?: string;
  redirectTo?: string;
  image16x9: File | Blob;
  image1x1?: File | Blob;
  image3x4?: File | Blob;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateHeroBannerInterface extends Partial<PostHeroBannerInterface> {
  removeImage1x1?: boolean;
  removeImage3x4?: boolean;
}
