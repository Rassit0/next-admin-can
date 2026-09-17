"use client";

import { Noticias } from "@/modules/portal/news/components/noticias-screen";
import type { PublicNews, PublicNewsCategory } from "@/modules/portal/news/actions/news.action";

interface NoticiasContentProps {
  initialNews?: PublicNews[];
  categories?: PublicNewsCategory[];
  initialCategoryId?: string;
}

export default function NoticiasContent({ initialNews = [], categories = [], initialCategoryId }: NoticiasContentProps) {
  return <Noticias initialNews={initialNews} categories={categories} initialCategoryId={initialCategoryId} />;
}
