'use client'

import { Inicio } from '@/modules/web/home/components/inicio-screen'
import type { PublicFixture } from '../actions/fixture.action'
import type { PublicNews } from '@/modules/web/news/actions/news.action'
import type { PublicBanner } from '@/modules/web/banners/actions/banners.action'

interface PageContentProps {
  initialFixtures?: PublicFixture[];
  initialNews?: PublicNews[];
  initialBanners?: PublicBanner[];
}

export default function PageContent({ 
  initialFixtures = [],
  initialNews = [],
  initialBanners = [],
}: PageContentProps) {
  return (
    <Inicio 
      onNavigate={() => {}} 
      initialFixtures={initialFixtures} 
      initialNews={initialNews}
      initialBanners={initialBanners}
    />
  );
}
