import { CinematicLoader } from "@/modules/portal/home/components/cinematic-loader";
import { SiteHeader } from "@/modules/portal/shared/components/site-header";
import { ParticlesBackground } from "@/modules/portal/home/components/particles-background";
import { Inicio } from "@/modules/portal/home/components/inicio-screen";
import {
  getPublicFixture,
  PublicFixture,
} from "@/modules/portal/home/actions/fixture.action";
import { getPublicNews } from "@/modules/portal/news/actions/news.action";
import { getPublicHeroBanners } from "@/modules/portal/hero-banners/actions/hero-banners.action";
import { getPublicHomeDisciplines } from "@/modules/portal/home-disciplines/actions/home-disciplines.action";
import { getPublicPromotions } from "@/modules/portal/promotions/actions/promotions.action";

export const metadata = {
  title: "Inicio | Club Atli©tico Nacional",
  description:
    "Portal institucional del Club Atli©tico Nacional - Mi¡s de 1000 deportistas activos.",
  openGraph: {
    images: ["/logo.png"],
  },
};
export default async function Page() {
  const [
    fixturesResponse,
    newsResponse,
    heroBannersResponse,
    homeDisciplinesResponse,
    promotionsResponse,
  ] = await Promise.all([
    getPublicFixture(),

    getPublicNews(4), // Solicitando exactamente 4 noticias
    getPublicHeroBanners(),
    getPublicHomeDisciplines(),
    getPublicPromotions(),
  ]);

  const matches = fixturesResponse?.data || [];
  const news = newsResponse?.data || [];
  const heroBanners = heroBannersResponse?.data || [];
  const disciplineBanners = homeDisciplinesResponse?.data || [];
  const promotions = promotionsResponse?.data || { promo1: null, promo2: null };

  // Promociones
  const promo1Banners = promotions.promo1 ? [promotions.promo1] : [];
  const promo2Banners = promotions.promo2 ? [promotions.promo2] : [];

  // Transformación de Fixture
  // Obtenemos disciplinas iºnicas del fixture
  const uniqueDisciplines = Array.from(
    new Set(matches.map((m) => m.discipline).filter(Boolean)),
  );

  return (
    <Inicio
      heroBanners={heroBanners as any}
      promo1Banners={promo1Banners}
      promo2Banners={promo2Banners}
      disciplineBanners={disciplineBanners as any}
      news={news}
      matches={matches}
      disciplines={uniqueDisciplines}
    />
  );
}
