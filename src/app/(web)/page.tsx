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
import { getPublicSponsors } from "@/modules/cms/sponsors/actions/get";

export const metadata = {
  title: "Inicio | Club Atlético Nacional",
  description:
    "Portal institucional del Club Atlético Nacional - Más de 1000 deportistas activos.",
  openGraph: {
    images: ["/logo.png"],
  },
};

import { parseDate, today } from "@internationalized/date";

export default async function Page(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const view = (searchParams.view as string) || "today";
  let fromParam = searchParams.from as string | undefined;
  let toParam = searchParams.to as string | undefined;

  let fromIso: string | undefined;
  let toIso: string | undefined;

  if (view === "today") {
    const t = today("America/La_Paz");
    fromIso = t.toDate("America/La_Paz").toISOString();
    toIso = t.add({ days: 1 }).toDate("America/La_Paz").toISOString();
  } else if (view === "played") {
    try {
      if (fromParam && toParam) {
        const fromDate = parseDate(fromParam);
        const toDate = parseDate(toParam);
        fromIso = fromDate.toDate("America/La_Paz").toISOString();
        toIso = toDate.add({ days: 1 }).toDate("America/La_Paz").toISOString();
      }
    } catch {
      // Ignore parsing errors
    }
  }

  const [
    fixturesGlobalResponse,
    fixturesViewResponse,
    newsResponse,
    heroBannersResponse,
    homeDisciplinesResponse,
    promotionsResponse,
    sponsorsResponse,
  ] = await Promise.all([
    getPublicFixture(),
    (view === "today" || view === "played") && fromIso && toIso
      ? getPublicFixture({ from: fromIso, to: toIso }) 
      : Promise.resolve(null),
    getPublicNews(4), // Solicitando exactamente 4 noticias
    getPublicHeroBanners(),
    getPublicHomeDisciplines(),
    getPublicPromotions(),
    getPublicSponsors(),
  ]);

  const globalMatches = fixturesGlobalResponse?.data || [];
  const viewMatches = fixturesViewResponse?.data || globalMatches;
  const news = newsResponse?.data || [];
  const heroBanners = heroBannersResponse?.data || [];
  const disciplineBanners = homeDisciplinesResponse?.data || [];
  const promotions = promotionsResponse?.data || { promo1: null, promo2: null };
  const sponsors = sponsorsResponse?.data || [];

  // Promociones
  const promo1Banners = promotions.promo1 ? [promotions.promo1] : [];
  const promo2Banners = promotions.promo2 ? [promotions.promo2] : [];

  // Transformación de Fixture
  // Obtenemos disciplinas únicas de la respuesta global
  const uniqueDisciplines = Array.from(
    new Set(globalMatches.map((m) => m.discipline).filter(Boolean)),
  );

  return (
    <Inicio
      heroBanners={heroBanners as any}
      promo1Banners={promo1Banners}
      promo2Banners={promo2Banners}
      disciplineBanners={disciplineBanners as any}
      news={news}
      globalMatches={globalMatches}
      viewMatches={viewMatches}
      sponsors={sponsors as any}
      view={view}
      fromDate={fromParam}
      toDate={toParam}
    />
  );
}
