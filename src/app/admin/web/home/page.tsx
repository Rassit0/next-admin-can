import { HeaderPage, ButtonRedirect } from "@/ui";
import { getHeroBanners } from "@/modules/cms/hero-banners/actions/get";
import { getHomeDisciplines } from "@/modules/cms/home-disciplines/actions/get";
import { getNews } from "@/modules/cms/news/actions/get";
import { getPromotions } from "@/modules/cms/promotions/actions/get";
import { getPublicFixture } from "@/modules/portal/home/actions/fixture.action";
import { resolvePageData } from "@/utils/resolvePageData";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Image01Icon,
  Structure04Icon,
  Tag01Icon,
  NewsIcon,
  Calendar03Icon,
  Megaphone01Icon,
  FavouriteIcon,
  LayoutBottomIcon,
} from "@hugeicons/core-free-icons";

export default async function AdminHomeDashboard() {
  const [heroBannersRes, homeDisciplinesRes, newsRes, promotionsRes] =
    await resolvePageData([
      getHeroBanners(),
      getHomeDisciplines(),
      getNews(),
      getPromotions(),
    ]);

  const fixtureRes = await getPublicFixture();

  const heroBanners = heroBannersRes.data || [];
  const disciplineBanners = homeDisciplinesRes.data || [];
  const allNews = newsRes.data || [];
  const allMatches = fixtureRes.data || [];
  const allPromotions = promotionsRes.data || [];

  // HERO
  const activeHero = heroBanners.filter((b) => b.isActive).length;

  // EQUIPOS / ESCUELA
  const activeDisciplines = disciplineBanners.filter((b) => b.isActive).length;

  // PROMO 1
  const promo1 = allPromotions.find((p) => p.position === "PROMO_1");
  const activePromo1 = promo1?.isActive ? 1 : 0;

  // ACTUALIDAD
  const publishedNews = allNews.filter((n) => n.status === "PUBLISHED");
  const homeNewsCount = Math.min(publishedNews.length, 4);

  // FIXTURE
  const totalMatches = allMatches.length;

  // PROMO 2
  const promo2 = allPromotions.find((p) => p.position === "PROMO_2");
  const activePromo2 = promo2?.isActive ? 1 : 0;

  return (
    <div className="space-y-8">
      <HeaderPage
        title="Dashboard de Inicio"
        description="Gestión centralizada del contenido de la pi¡gina Home."
        breadcrumb={[{ label: "Web Piºblica" }, { label: "Inicio" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* HERO */}
        <div className="bg-default/50 border border-default-200 rounded-xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon
                icon={Image01Icon}
                className="text-primary size-6"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">Hero / Carousel</h3>
              <p className="text-sm text-default-500">
                Carrusel principal 16:9
              </p>
            </div>
          </div>
          <div className="py-2">
            <p className="text-sm">
              <span className="font-bold text-lg">{heroBanners.length}</span>{" "}
              banners en total
            </p>
            <p className="text-sm text-default-500">
              {activeHero} activo{activeHero !== 1 && "s"}
            </p>
          </div>
          <ButtonRedirect
            href="/admin/web/hero-banners"
            label="Gestionar banners"
            className="w-full"
            variant="secondary"
          />
        </div>

        {/* EQUIPOS / ESCUELA */}
        <div className="bg-default/50 border border-default-200 rounded-xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon
                icon={Structure04Icon}
                className="text-secondary size-6"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">Equipos y Escuela</h3>
              <p className="text-sm text-default-500">Bloques 4:3</p>
            </div>
          </div>
          <div className="py-2">
            <p className="text-sm">
              <span className="font-bold text-lg">{activeDisciplines}</span>{" "}
              elemento{activeDisciplines !== 1 && "s"} activo
              {activeDisciplines !== 1 && "s"}
            </p>
            {activeDisciplines > 0 && (
              <p className="text-xs text-default-500 mt-1 line-clamp-2">
                {disciplineBanners
                  .filter((b) => b.isActive)
                  .map((b) => b.title)
                  .join(", ")}
              </p>
            )}
          </div>
          <ButtonRedirect
            href="/admin/web/home-disciplines"
            label="Gestionar bloques"
            className="w-full"
            variant="secondary"
          />
        </div>

        {/* PROMO 1 */}
        <div className="bg-default/50 border border-default-200 rounded-xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={Tag01Icon} className="text-warning size-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Promo 1</h3>
              <p className="text-sm text-default-500">Promoción posición 1</p>
            </div>
          </div>
          <div className="py-2">
            <p className="text-sm">
              Estado:{" "}
              <span className="font-semibold">
                {activePromo1 > 0
                  ? "Configurado (Activo)"
                  : "Vaci­o o Inactivo"}
              </span>
            </p>
          </div>
          <ButtonRedirect
            href="/admin/web/promotions"
            label="Gestionar Promo 1"
            className="w-full"
            variant="secondary"
          />
        </div>

        {/* ACTUALIDAD */}
        <div className="bg-default/50 border border-default-200 rounded-xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={NewsIcon} className="text-success size-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Actualidad</h3>
              <p className="text-sm text-default-500">Noticias publicadas</p>
            </div>
          </div>
          <div className="py-2">
            <p className="text-sm">
              <span className="font-bold text-lg">{homeNewsCount}</span> noticia
              {homeNewsCount !== 1 && "s"} en portada
            </p>
            <p className="text-sm text-default-500">
              ({publishedNews.length} publicadas en total)
            </p>
          </div>
          <ButtonRedirect
            href="/admin/web/news"
            label="Gestionar noticias"
            className="w-full"
            variant="secondary"
          />
        </div>

        {/* FIXTURE */}
        <div className="bg-default/10 border border-default-200 rounded-xl p-6 flex flex-col justify-between gap-4 relative overflow-hidden">
          <div className="flex items-start gap-4 opacity-80">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon
                icon={Calendar03Icon}
                className="text-default-500 size-6"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">Fixture</h3>
              <p className="text-sm text-default-500">Datos deportivos</p>
            </div>
          </div>
          <div className="py-2 opacity-80">
            <p className="text-sm">
              <span className="font-bold text-lg">{totalMatches}</span> partido
              {totalMatches !== 1 && "s"} piºblico{totalMatches !== 1 && "s"}
            </p>
            <p className="text-xs text-default-500 mt-1 uppercase tracking-wider font-semibold">
              Solo lectura
            </p>
          </div>
          <div className="w-full pt-2">
            <ButtonRedirect
              href="/admin/calendar"
              label="Gestionar partidos"
              className="w-full"
              variant="secondary"
            />
          </div>
        </div>

        {/* PROMO 2 */}
        <div className="bg-default/50 border border-default-200 rounded-xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon
                icon={Megaphone01Icon}
                className="text-warning size-6"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">Promo 2</h3>
              <p className="text-sm text-default-500">Promoción posición 2</p>
            </div>
          </div>
          <div className="py-2">
            <p className="text-sm">
              Estado:{" "}
              <span className="font-semibold">
                {activePromo2 > 0
                  ? "Configurado (Activo)"
                  : "Vaci­o o Inactivo"}
              </span>
            </p>
          </div>
          <ButtonRedirect
            href="/admin/web/promotions"
            label="Gestionar Promo 2"
            className="w-full"
            variant="secondary"
          />
        </div>

        {/* SPONSORS */}
        <div className="bg-default/10 border border-default-200 rounded-xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-4 opacity-70">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon
                icon={FavouriteIcon}
                className="text-default-400 size-6"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">Sponsors</h3>
              <p className="text-sm text-default-500">Contenido del sitio</p>
            </div>
          </div>
          <div className="py-2 opacity-70">
            <p className="text-xs text-default-500 uppercase tracking-wider font-semibold">
              Contenido esti¡tico
            </p>
          </div>
          <div className="w-full pt-2"></div>
        </div>

        {/* FOOTER */}
        <div className="bg-default/10 border border-default-200 rounded-xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-start gap-4 opacity-70">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon
                icon={LayoutBottomIcon}
                className="text-default-400 size-6"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">Footer</h3>
              <p className="text-sm text-default-500">Pie de pi¡gina global</p>
            </div>
          </div>
          <div className="py-2 opacity-70">
            <p className="text-xs text-default-500 uppercase tracking-wider font-semibold">
              Contenido esti¡tico
            </p>
          </div>
          <div className="w-full pt-2"></div>
        </div>
      </div>
    </div>
  );
}
