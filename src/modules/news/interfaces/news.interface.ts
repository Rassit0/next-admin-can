export type NewsStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface INews {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  category: string | null;
  tags: string[];
  authorName: string | null;
  status: NewsStatus;
  publishedAt: string | null; // o Date si se parsea
  createdAt: string;
  updatedAt: string;
}

export interface PostNewsInterface {
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  authorName?: string;
  status?: NewsStatus;
  publishedAt?: string;
}

export interface UpdateNewsInterface extends Partial<PostNewsInterface> {}
