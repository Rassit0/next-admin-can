export interface IHomeDiscipline {
  id: string;
  title: string;
  redirectTo: string | null;
  image4x3: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostHomeDisciplineInterface {
  title: string;
  redirectTo?: string;
  image4x3: File | Blob;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateHomeDisciplineInterface extends Partial<PostHomeDisciplineInterface> {}
