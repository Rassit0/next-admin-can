import { AdCarousel } from "@/modules/portal/home/components/ad-carousel";
import { EquiposEscuelaSection } from "@/modules/portal/home/components/equipos-escuela-section";
import { PromoBanner } from "@/modules/portal/home/components/promo-banner";
import { ActualidadSection } from "@/modules/portal/home/components/actualidad-section";
import { FixtureSection } from "@/modules/portal/home/components/fixture-section";
import { SponsorsSection } from "@/modules/portal/home/components/sponsors-section";

import type { PublicFixture } from "../actions/fixture.action";
import type { PublicNews } from "@/modules/portal/news/actions/news.action";
import type { IHeroBanner } from "@/modules/cms/hero-banners";
import type { IHomeDiscipline } from "@/modules/cms/home-disciplines";
import type { PublicPromotion } from "@/modules/portal/promotions/actions/promotions.action";

interface InicioProps {
  heroBanners?: IHeroBanner[];
  promo1Banners?: PublicPromotion[];
  promo2Banners?: PublicPromotion[];
  disciplineBanners?: IHomeDiscipline[];
  news?: PublicNews[];
  matches?: PublicFixture[];
  disciplines?: string[];
}

export function Inicio({
  heroBanners = [],
  promo1Banners = [],
  promo2Banners = [],
  disciplineBanners = [],
  news = [],
  matches = [],
  disciplines = [],
}: InicioProps) {
  const promo1 = promo1Banners[0];
  const promo2 = promo2Banners[0];

  return (
    <div className="flex flex-col">
      {/* 1. Web carrousel (Ad Carousel) */}
      <section className="relative w-full pt-16">
        <AdCarousel banners={heroBanners} fullWidth={true} />
      </section>

      {/* 2. Equipos y escuela */}
      <EquiposEscuelaSection disciplineBanners={disciplineBanners} />

      {/* 3. Banner promocional 1 */}
      {promo1 && (
        <PromoBanner
          title={promo1.title}
          subtitle={"Promocón Especial"}
          image={promo1.image16x9}
          ctaText={promo1.ctaText || "Ver más"}
          ctaHref={promo1.redirectTo || "#"}
          fullWidth
        />
      )}

      {/* 4. Actualidad (Noticias) */}
      <ActualidadSection news={news} />

      {/* 5. Fixture (Básquetbol y Voleibol) */}
      <FixtureSection initialFixtures={matches} />

      {/* 6. Banner promocional 2 */}
      {promo2 && (
        <PromoBanner
          title={promo2.title}
          subtitle={"Promocón Especial"}
          image={promo2.image16x9}
          className="pb-16"
          fullWidth={true}
          ctaText={promo2.ctaText || "Ver más"}
          ctaHref={promo2.redirectTo || "#"}
        />
      )}

      {/* 7. Sponsors */}
      <SponsorsSection />
    </div>
  );
}
