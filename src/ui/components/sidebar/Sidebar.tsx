import { IOrganization } from "@/modules/organizations";
import { Body } from "./Body";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";

interface Props {
  organization: IOrganization;
  items: NavItem[];
  urlBase?: string;
}
export const Sidebar = ({ organization, items, urlBase }: Props) => {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full flex-col py-6 bg-background w-20 lg:w-64 border-r-2 z-50 transition-all duration-300">
      <Header organization={organization} />
      <Body items={items} urlBase={urlBase} />
      <Footer />
    </aside>
  );
};
