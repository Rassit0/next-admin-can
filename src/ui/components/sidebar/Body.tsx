import { itemsNavigation } from "@/config";
import { Item } from "./Item";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";

interface Props {
  items: NavItem[];
  urlBase?: string;
}
export const Body = ({ items, urlBase }: Props) => {
  return (
    <nav className="flex-1 px-3 lg:px-4 space-y-1">
      {items.map((item, index) => (
        <Item key={index} item={item} index={index} urlBase={urlBase} />
      ))}
    </nav>
  );
};
