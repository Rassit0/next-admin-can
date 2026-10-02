export interface ISponsor {
  id: string;
  name: string;
  websiteUrl: string | null;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
