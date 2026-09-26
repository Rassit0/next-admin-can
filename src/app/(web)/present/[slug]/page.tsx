import { notFound } from "next/navigation";
import { NewsDetailClient } from "./news-detail-client";
import { getPublicNewsBySlug } from "@/modules/portal/news/actions/news.action";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const newsResponse = await getPublicNewsBySlug(slug);

  if (!newsResponse || newsResponse.error) {
    if (newsResponse?.statusCode === 404) {
      notFound();
    }

    // For 500 or network errors, show a simple error state
    return (
      <div className="mx-auto max-w-5xl px-4 py-32 sm:px-6 lg:px-8 text-center">
        <h1 className="font-oswald text-4xl font-bold text-primary mb-4">
          Servicio no disponible
        </h1>
        <p className="text-primary/70 text-lg">
          No fue posible cargar esta noticia en este momento. Por favor, intenta
          mi¡s tarde.
        </p>
      </div>
    );
  }

  if (!newsResponse.data) {
    notFound();
  }

  return <NewsDetailClient article={newsResponse.data} />;
}
