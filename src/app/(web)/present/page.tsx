import { CinematicLoader } from "@/modules/web/home/components/cinematic-loader";
import { SiteHeader } from "@/modules/web/shared/components/site-header";
import { ParticlesBackground } from "@/modules/web/home/components/particles-background";
import NoticiasContent from "@/modules/web/news/components/noticias-content";
import { getPublicNews } from "@/modules/web/news/actions/news.action";

export const metadata = {
  title: "Central de Anuncios y Noticias | Club Atlético Nacional",
  description:
    "Últimas noticias, anuncios y resultados del Club Atlético Nacional.",
  openGraph: {
    images: ["/logo.png"],
  },
};

export default async function NoticiasPage() {
  const newsResponse = await getPublicNews();
  const initialNews = newsResponse?.data || [];

  return (
    <NoticiasContent initialNews={initialNews} />
  );
}
