"use server";

import { api } from "@/modules/web/core/api/api";
import { handleServerAction, ServiceResponse } from "@/modules/web/core/utils/handleServerAction";

export interface PublicNews {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  category: string | null;
  publishedAt: string;
}

export interface PublicNewsDetail extends PublicNews {
  content: string;
  tags: string[];
  authorName: string | null;
}

export async function getPublicNews(): Promise<ServiceResponse<PublicNews[]>> {
  return handleServerAction(async () => {
    const data = await api.get<PublicNews[]>("public/news", {
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
