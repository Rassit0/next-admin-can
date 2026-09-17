export interface INewsCategory {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostNewsCategoryInterface {
  name: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateNewsCategoryInterface extends Partial<PostNewsCategoryInterface> {}
