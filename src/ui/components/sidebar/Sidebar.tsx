"use client";

import clsx from "clsx";
import { IOrganization } from "@/modules/organizations";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";
import { Body } from "./Body";
import { Header } from "./Header";
import { Item } from "./Item";
import { useSidebarCollapsed } from "./useSidebarPrefs";

interface Props {
  organization: Partial<IOrganization>;
  items: NavItem[];
  urlBase?: string;
}

export const Sidebar = ({ organization, items, urlBase }: Props) => {
  const { isCollapsed, toggleCollapsed } = useSidebarCollapsed();
  const highlightedItems = items.filter((item) => item.highlight);
  const bodyItems = items.filter((item) => !item.hiddenInSidebar);

  return (
    <aside
      aria-label="Navegación lateral"
      className={clsx(
        "hidden lg:flex fixed left-0 top-0 h-full flex-col py-3 bg-background border-r border-border z-50 transition-[width] duration-300 motion-reduce:transition-none",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="relative z-10 bg-background pb-3">
        <Header
          isCollapsed={isCollapsed}
          organization={organization}
          onToggleCollapse={toggleCollapsed}
        />

        {highlightedItems.length > 0 && (
          <div className={clsx("mt-3", isCollapsed ? "px-2.5" : "px-3")}>
            {highlightedItems.map((item, index) => (
              <Item
                key={item.id || `highlight-${index}`}
                index={-1}
                isCollapsed={isCollapsed}
                item={item}
                urlBase={urlBase}
              />
            ))}
          </div>
        )}

        <div className="absolute top-full left-0 w-full h-3 bg-linear-to-b from-background to-transparent pointer-events-none" />
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pt-2 pb-4">
        <Body
          isCollapsed={isCollapsed}
          items={bodyItems}
          urlBase={urlBase}
        />
      </div>
    </aside>
  );
};
