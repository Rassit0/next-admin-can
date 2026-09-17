import {
  getPromotions,
  AddPromotionModal,
  TablePromotions,
} from "@/modules/cms/promotions";
import { HeaderPage } from "@/ui";
import { resolvePageData } from "@/utils/resolvePageData";
import {
  File01Icon,
  CheckmarkCircle02Icon,
  CancelCircleHalfDotIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default async function PromotionsPage() {
  const [promotionsResponse] = await resolvePageData([getPromotions()]);

  const promotionsData = promotionsResponse.data;

  // Stats calculations
  const activeCount = promotionsData.filter((b) => b.isActive).length;
  const inactiveCount = promotionsData.filter((b) => !b.isActive).length;
  const totalCount = promotionsData.length;

  return (
    <>
      <div className="space-y-8">
        <HeaderPage
          title="Gestión de Promociones"
          description="Administra las promociones PROMO_1 y PROMO_2 del Home."
          action={
            <>
              <AddPromotionModal />
            </>
          }
        />

        {/* <!-- Filters Bento --> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="text-success"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
                Activos
              </p>
              <p className="text-xl font-black font-headline text-default-foreground">
                {activeCount}
              </p>
            </div>
          </div>
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon
                icon={CancelCircleHalfDotIcon}
                className="text-default-400"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
                Inactivos
              </p>
              <p className="text-xl font-black font-headline text-default-foreground">
                {inactiveCount}
              </p>
            </div>
          </div>
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={File01Icon} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
                Total
              </p>
              <p className="text-xl font-black font-headline text-default-foreground">
                {totalCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-3 mt-8">
        <TablePromotions promotions={promotionsData} />
      </div>
    </>
  );
}
