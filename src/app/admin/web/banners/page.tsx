import { getBanners, AddBannerModal, TableBanners } from "@/modules/banners";
import { ErrorPage, HeaderPage } from "@/ui";
import {
  File01Icon,
  CheckmarkCircle02Icon,
  CancelCircleHalfDotIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { redirect } from "next/navigation";

export default async function BannersPage() {
  const bannersResponse = await getBanners();

  if (bannersResponse.error && bannersResponse.statusCode === 401) {
    redirect("/admin/login");
  }

  if (bannersResponse.error) {
    return <ErrorPage message={bannersResponse.message} />;
  }

  const bannersData = bannersResponse.data;
  
  // Stats calculations
  const activeCount = bannersData.filter(b => b.isActive).length;
  const inactiveCount = bannersData.filter(b => !b.isActive).length;
  const totalCount = bannersData.length;

  return (
    <>
      <div className="space-y-8">
        <HeaderPage
          title="Gestión de Banners"
          description="Administra los banners promocionales del carrusel principal."
          action={<AddBannerModal />}
        />
        
        {/* <!-- Filters Bento --> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-success" />
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
              <HugeiconsIcon icon={CancelCircleHalfDotIcon} className="text-default-400" />
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
        <TableBanners banners={bannersData} />
      </div>
    </>
  );
}
