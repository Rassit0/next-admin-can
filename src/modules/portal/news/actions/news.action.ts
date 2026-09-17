"use server";

import { api } from "@/modules/portal/core/api/api";
import { handleServerAction, ServiceResponse } from "@/modules/portal/core/utils/handleServerAction";

export interface PublicNews {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  category: string | null;
  categoryId: string | null;
  publishedAt: string;
}

export interface PublicNewsDetail extends PublicNews {
  content: string;
  tags: string[];
  authorName: string | null;
}

export interface PublicNewsCategory {
  id: string;
  name: string;
  slug: string;
}

export async function getPublicNewsCategories(): Promise<ServiceResponse<PublicNewsCategory[]>> {
  return handleServerAction(async () => {
    const data = await api.get<PublicNewsCategory[]>("public/news-categories", {
      next: {
        revalidate: 3600,
        tags: ["public-news-categories"],
      },
    });
    return { data };
  });
}

export async function getPublicNews(limit?: number, categoryId?: string): Promise<ServiceResponse<PublicNews[]>> {
  return handleServerAction(async () => {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append("limit", limit.toString());
    if (categoryId) queryParams.append("categoryId", categoryId);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const data = await api.get<PublicNews[]>(`public/news${query}`, {
      next: {
        revalidate: 60,
        tags: ["public-news"],
      },
    });
    return { data };
  });
}

export async function getPublicNewsBySlug(slug: string): Promise<ServiceResponse<PublicNewsDetail>> {
  return handleServerAction(async () => {
    const data = await api.get<PublicNewsDetail>(`public/news/${slug}`, {
      next: {
        revalidate: 60,
        tags: [`public-news-detail-${slug}`],
      },
    });
    return { data };
  });
}
