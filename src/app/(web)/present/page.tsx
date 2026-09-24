import { CinematicLoader } from "@/modules/portal/home/components/cinematic-loader";
import { SiteHeader } from "@/modules/portal/shared/components/site-header";
import { ParticlesBackground } from "@/modules/portal/home/components/particles-background";
import NoticiasContent from "@/modules/portal/news/components/noticias-content";
import {
  getPublicNews,
  getPublicNewsCategories,
} from "@/modules/portal/news/actions/news.action";

export const metadata = {
  title: "Central de Anuncios y Noticias | Club Atli©tico Nacional",
  description:
    "iltimas noticias, anuncios y resultados del Club Atli©tico Nacional.",
  openGraph: {
    images: ["/logo.png"],
  },
};

interface Props {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

export default async function NoticiasPage({ searchParams }: Props) {
  const { categoryId } = await searchParams;
  // Obtenemos todas las noticias y categorías activas
  const [newsResponse, categoriesResponse] = await Promise.all([
    getPublicNews(undefined, categoryId), // Filtramos por categoryId en el backend si viene en los params (o removemos param para client-side)
    getPublicNewsCategories(),
  ]);

  const initialNews = newsResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  return (
    <NoticiasContent
      initialNews={initialNews}
      categories={categories}
      initialCategoryId={categoryId}
    />
  );
}
