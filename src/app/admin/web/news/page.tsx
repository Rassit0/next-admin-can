import { getNews, AddNewsModal, TableNews } from "@/modules/news";
import { ErrorPage, HeaderPage } from "@/ui";
import {
  File01Icon,
  CheckmarkCircle02Icon,
  Archive02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { redirect } from "next/navigation";

export default async function NewsPage() {
  const newsResponse = await getNews();

  if (newsResponse.error && newsResponse.statusCode === 401) {
    redirect("/admin/login");
  }

  if (newsResponse.error) {
    return <ErrorPage message={newsResponse.message} />;
  }

  const newsData = newsResponse.data;
  
  // Stats calculations
  const publishedCount = newsData.filter(n => n.status === "PUBLISHED").length;
  const draftCount = newsData.filter(n => n.status === "DRAFT").length;
  const archivedCount = newsData.filter(n => n.status === "ARCHIVED").length;
  const totalCount = newsData.length;

  return (
    <>
      <div className="space-y-8">
        <HeaderPage
          title="Gestión de Noticias"
          description="Administra los artículos y comunicados del portal web."
          action={<AddNewsModal buttonFloatingMobile />}
        />
        
        {/* <!-- Filters Bento --> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-success" />
            </div>
            <div>
              <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
                Publicadas
              </p>
              <p className="text-xl font-black font-headline text-default-foreground">
                {publishedCount}
              </p>
            </div>
          </div>
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={File01Icon} className="text-warning" />
            </div>
            <div>
              <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
                Borradores
              </p>
              <p className="text-xl font-black font-headline text-default-foreground">
                {draftCount}
              </p>
            </div>
          </div>
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={Archive02Icon} className="text-danger" />
            </div>
            <div>
              <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
                Archivadas
              </p>
              <p className="text-xl font-black font-headline text-default-foreground">
                {archivedCount}
              </p>
            </div>
          </div>
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={UserGroupIcon} className="text-sky-500" />
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
        <TableNews news={newsData} />
      </div>
    </>
  );
}
