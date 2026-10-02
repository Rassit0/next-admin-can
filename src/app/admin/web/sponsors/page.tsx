import {
  getSponsors,
  AddSponsorModal,
  TableSponsors,
} from "@/modules/cms/sponsors";
import { HeaderPage } from "@/ui";
import { resolvePageData } from "@/utils/resolvePageData";
import {
  File01Icon,
  CheckmarkCircle02Icon,
  CancelCircleHalfDotIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default async function SponsorsPage() {
  const [sponsorsResponse] = await resolvePageData([getSponsors()]);

  const sponsorsData = sponsorsResponse.data || [];

  // Stats calculations
  const activeCount = sponsorsData.filter((s) => s.isActive).length;
  const inactiveCount = sponsorsData.filter((s) => !s.isActive).length;
  const totalCount = sponsorsData.length;

  return (
    <>
      <div className="space-y-8">
        <HeaderPage
          title="Gestión de Auspiciadores"
          description="Administra los sponsors y partners oficiales que se muestran en el portal público."
          action={<AddSponsorModal buttonFloatingMobile />}
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
        <TableSponsors sponsors={sponsorsData} />
      </div>
    </>
  );
}
