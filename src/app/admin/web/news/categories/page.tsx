import { getNewsCategories } from "@/modules/cms/news-categories";
import { HeaderPage } from "@/ui";
import { resolvePageData } from "@/utils/resolvePageData";
import { TableNewsCategories } from "@/modules/cms/news-categories/components/table/TableNewsCategories";
import { AddNewsCategoryModal } from "@/modules/cms/news-categories/components/modal/AddNewsCategoryModal";

export default async function NewsCategoriesPage() {
  const [categoriesResponse] = await resolvePageData([getNewsCategories()]);

  const categories = categoriesResponse.data;

  return (
    <div className="space-y-8">
      <HeaderPage
        title="Categorías de Noticias"
        description="Administra las categorías para clasificar las noticias del portal."
        breadcrumb={[
          { label: "Noticias", href: `/admin/web/news` },
          { label: "Categorías" },
        ]}
        action={<AddNewsCategoryModal />}
      />

      <TableNewsCategories categories={categories} />
    </div>
  );
}
