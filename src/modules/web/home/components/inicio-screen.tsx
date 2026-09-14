"use client";

import { AdCarousel } from "@/modules/web/home/components/ad-carousel";
import { type NavItem } from "@/modules/web/core/constants/data";
import { EquiposEscuelaSection } from "@/modules/web/home/components/equipos-escuela-section";
import { PromoBanner } from "@/modules/web/home/components/promo-banner";
import { ActualidadSection } from "@/modules/web/home/components/actualidad-section";
import { FixtureSection } from "@/modules/web/home/components/fixture-section";
import { SponsorsSection } from "@/modules/web/home/components/sponsors-section";

import type { PublicFixture } from "../actions/fixture.action";
import type { PublicNews } from "@/modules/web/news/actions/news.action";
import type { PublicBanner } from "@/modules/web/banners/actions/banners.action";

interface InicioProps {
  onNavigate: (item: NavItem) => void;
  initialFixtures?: PublicFixture[];
  initialNews?: PublicNews[];
  initialBanners?: PublicBanner[];
}

export function Inicio({ 
  onNavigate, 
  initialFixtures = [],
  initialNews = [],
  initialBanners = [],
}: InicioProps) {
  const handleCarouselSlideChange = (slide: PublicBanner) => {
    // Optional: track analytics or update UI based on carousel changes
  };

  return (
    <div className="flex flex-col">
      {/* 1. Web carrousel (Ad Carousel) */}
      <section className="relative mx-auto w-full max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8">
        <AdCarousel banners={initialBanners} onSlideChange={handleCarouselSlideChange} />
      </section>

      {/* 2. Equipos y escuela */}
      <EquiposEscuelaSection />

      {/* 3. Banner promocional 1 */}
      <PromoBanner 
        title="Escuela CAN"
        subtitle="Aprende Básquetbol o Voleibol con los mejores profesionales."
        image="/hero-athletes.png" // Placeholder
        ctaText="Inscríbete ahora"
        ctaHref="/schools"
      />

      {/* 4. Actualidad (Noticias) */}
      <ActualidadSection news={initialNews} />

      {/* 5. Fixture (Básquetbol y Voleibol) */}
      <FixtureSection initialFixtures={initialFixtures} />

      {/* 6. Banner promocional 2 */}
      <PromoBanner 
        title="Gran Final Campeonato 2026"
        subtitle="Domingo 14 de julio 19:00 Hrs."
        image="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop"
        className="pb-16"
      />

      {/* 7. Sponsors */}
      <SponsorsSection />
    </div>
  );
}
