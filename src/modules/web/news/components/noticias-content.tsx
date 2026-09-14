"use client";

import { Noticias } from "@/modules/web/news/components/noticias-screen";
import type { PublicNews } from "@/modules/web/news/actions/news.action";

interface NoticiasContentProps {
  initialNews?: PublicNews[];
}

export default function NoticiasContent({ initialNews = [] }: NoticiasContentProps) {
  return <Noticias initialNews={initialNews} />;
}
