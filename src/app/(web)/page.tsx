import { CinematicLoader } from "@/modules/web/home/components/cinematic-loader";
import { SiteHeader } from "@/modules/web/shared/components/site-header";
import { ParticlesBackground } from "@/modules/web/home/components/particles-background";
import PageContent from "@/modules/web/home/components/home-content";
import { getPublicFixture } from "@/modules/web/home/actions/fixture.action";
import { getPublicNews } from "@/modules/web/news/actions/news.action";
import { getPublicBanners } from "@/modules/web/banners/actions/banners.action";

export const metadata = {
  title: "Inicio | Club Atlético Nacional",
  description:
    "Portal institucional del Club Atlético Nacional - Más de 1000 deportistas activos.",
  openGraph: {
    images: ["/logo.png"],
  },
};

export default async function Page() {
  const [fixturesResponse, newsResponse, bannersResponse] = await Promise.all([
    getPublicFixture(),
    getPublicNews(),
    getPublicBanners(),
  ]);

  const initialFixtures = fixturesResponse?.data || [];
  const initialNews = newsResponse?.data || [];
  const initialBanners = bannersResponse?.data || [];

  return (
    <PageContent 
      initialFixtures={initialFixtures} 
      initialNews={initialNews} 
      initialBanners={initialBanners} 
    />
  );
}
