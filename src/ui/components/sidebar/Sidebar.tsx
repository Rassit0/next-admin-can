import { IOrganization } from "@/modules/organizations";
import { Body } from "./Body";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";
import { Item } from "./Item";
import { FlashIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface Props {
  organization: IOrganization;
  items: NavItem[];
  urlBase?: string;
}
export const Sidebar = ({ organization, items, urlBase }: Props) => {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full flex-col py-3 bg-background w-20 lg:w-64 border-r-2 z-50 transition-all duration-300">
      <div className="relative z-10 bg-background pb-4">
        <Header organization={organization} />
        <div className="px-3 lg:px-4 mt-2">
          <Item 
            item={{
              label: "Operaciones Rápidas",
              href: "quick-operations",
              icon: <HugeiconsIcon icon={FlashIcon} size={20} />,
              highlight: true,
            }}
            index={-1} 
            urlBase={urlBase} 
          />
        </div>
        <div className="absolute top-full left-0 w-full h-4 bg-linear-to-b from-background to-transparent pointer-events-none" />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pt-4">
        <Body items={items.filter((item) => !item.hiddenInSidebar)} urlBase={urlBase} />
        <Footer />
      </div>
    </aside>
  );
};
