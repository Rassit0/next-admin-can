"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";
import {
  findActiveNavGroup,
  groupNavigationItems,
} from "@/ui/components/navigation/navigation-groups";
import { isNavigationItemActive } from "@/ui/components/navigation/navigation-url";
import { Item } from "./Item";
import { useSidebarOpenGroups } from "./useSidebarPrefs";

interface Props {
  items: NavItem[];
  urlBase?: string;
  isCollapsed?: boolean;
}

export const Body = ({ items, urlBase, isCollapsed = false }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromContext = searchParams.get("from");
  const { manualOpenGroups, toggleGroup } = useSidebarOpenGroups();

  const sections = groupNavigationItems(items);
  const activeGroup = findActiveNavGroup(sections, (item) =>
    isNavigationItemActive(pathname, item.href, urlBase, fromContext),
  );

  return (
    <nav
      aria-label="Menú principal"
      className={clsx(
        "flex-1",
        isCollapsed ? "px-2.5 space-y-2" : "px-3 space-y-2",
      )}
    >
      {sections.map((section, sectionIndex) => {
        if (section.key === "ungrouped" || section.label === null) {
          return (
            <div key={section.key} className="space-y-1">
              {section.items.map((item, index) => (
                <Item
                  key={item.id || `${item.href}-${index}`}
                  index={index}
                  isCollapsed={isCollapsed}
                  item={item}
                  urlBase={urlBase}
                />
              ))}
            </div>
          );
        }

        const groupKey = section.key;
        const isActiveGroup = activeGroup === groupKey;
        const isManuallyOpen = manualOpenGroups.includes(groupKey);
        const isSectionOpen = isCollapsed
          ? true
          : isActiveGroup || isManuallyOpen;
        const groupPanelId = `sidebar-group-${groupKey}`;

        return (
          <div key={groupKey} className="space-y-1">
            {isCollapsed ? (
              sectionIndex > 0 && (
                <div
                  aria-hidden="true"
                  className="mx-2 my-2 border-t border-border/70"
                />
              )
            ) : (
              <button
                aria-controls={groupPanelId}
                aria-expanded={isSectionOpen}
                className={clsx(
                  "group flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-[11px] font-bold uppercase tracking-wider transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100",
                  isActiveGroup
                    ? "bg-sky-500/8 text-sky-700 dark:text-sky-400 cursor-default"
                    : isSectionOpen
                      ? "bg-surface-secondary/60 text-foreground/85 hover:bg-surface-secondary"
                      : "text-foreground/60 hover:bg-surface-secondary/50 hover:text-foreground",
                )}
                title={
                  isActiveGroup
                    ? "Sección activa (permanece abierta mientras estás en esta ruta)"
                    : undefined
                }
                type="button"
                onClick={() => {
                  if (!isActiveGroup) {
                    toggleGroup(groupKey);
                  }
                }}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                      isActiveGroup
                        ? "bg-sky-600 dark:bg-sky-400"
                        : isSectionOpen
                          ? "bg-foreground/45"
                          : "bg-foreground/25 group-hover:bg-foreground/45",
                    )}
                  />
                  <span className="truncate">{section.label}</span>
                </span>

                <ChevronDown
                  aria-hidden="true"
                  className={clsx(
                    "h-3.5 w-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
                    isSectionOpen ? "rotate-0" : "-rotate-90",
                    isActiveGroup
                      ? "text-sky-600 dark:text-sky-400"
                      : "text-foreground/45 group-hover:text-foreground/75",
                  )}
                />
              </button>
            )}

            {isSectionOpen && (
              <div
                className={clsx(
                  "space-y-0.5",
                  !isCollapsed &&
                    "ml-2.5 border-l border-border/65 pl-2 pt-0.5 pb-1",
                )}
                id={groupPanelId}
              >
                {section.items.map((item, index) => (
                  <Item
                    key={item.id || `${item.href}-${index}`}
                    index={index}
                    isCollapsed={isCollapsed}
                    item={item}
                    urlBase={urlBase}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
