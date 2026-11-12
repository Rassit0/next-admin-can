"use client";

import { useCallback, useId, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  NavigationIcon,
  NavigationIconKey,
} from "@/ui/components/navigation/IconRegistry";
import {
  isNavigationItemActive,
  resolveNavigationHref,
} from "@/ui/components/navigation/navigation-url";

interface Props {
  item: {
    label: string;
    href: string;
    icon?: string;
    highlight?: boolean;
  };
  index: number;
  urlBase?: string;
  isCollapsed?: boolean;
}

interface TooltipCoords {
  top: number;
  left: number;
}

export const Item = ({
  item,
  urlBase,
  isCollapsed = false,
}: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromContext = searchParams.get("from");
  const tooltipId = useId();
  const [tooltipCoords, setTooltipCoords] = useState<TooltipCoords | null>(
    null,
  );

  const resolvedHref = resolveNavigationHref(item.href, urlBase);
  const isActive = isNavigationItemActive(
    pathname,
    item.href,
    urlBase,
    fromContext,
  );

  const isHighlight = item.highlight;

  const showTooltip = useCallback(
    (target: HTMLElement) => {
      if (!isCollapsed) return;
      const rect = target.getBoundingClientRect();
      setTooltipCoords({
        top: rect.top + rect.height / 2,
        left: rect.right + 10,
      });
    },
    [isCollapsed],
  );

  const hideTooltip = useCallback(() => {
    setTooltipCoords(null);
  }, []);

  return (
    <>
      <Link
        aria-current={isActive ? "page" : undefined}
        aria-describedby={isCollapsed && tooltipCoords ? tooltipId : undefined}
        aria-label={isCollapsed ? item.label : undefined}
        className={clsx(
          "group relative flex items-center rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
          isCollapsed
            ? "justify-center px-0 py-2.5 w-full"
            : "justify-start gap-3 px-3 py-2.5",
          {
            "text-foreground/80 hover:text-foreground hover:bg-surface-secondary/80":
              !isActive && !isHighlight,
            "text-sky-700 dark:text-sky-400 font-semibold bg-surface-secondary":
              isActive && !isHighlight,
            "border-l-4 border-sky-600":
              isActive && !isHighlight && !isCollapsed,
            "ring-1 ring-sky-500/35 bg-sky-50/90 dark:bg-sky-950/50":
              isActive && !isHighlight && isCollapsed,

            // Highlight styles (Operaciones Rápidas)
            "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-100/80 dark:hover:bg-indigo-900/45":
              isHighlight && !isActive,
            "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 font-bold":
              isHighlight && isActive,
            "border-l-4 border-transparent hover:border-indigo-400":
              isHighlight && !isActive && !isCollapsed,
            "border-l-4 border-indigo-600":
              isHighlight && isActive && !isCollapsed,
            "ring-1 ring-indigo-500/40":
              isHighlight && isActive && isCollapsed,
          },
        )}
        href={resolvedHref}
        onBlur={hideTooltip}
        onClick={hideTooltip}
        onFocus={(e) => showTooltip(e.currentTarget)}
        onMouseEnter={(e) => showTooltip(e.currentTarget)}
        onMouseLeave={hideTooltip}
      >
        {item.icon && (
          <span
            className={clsx("shrink-0 transition-colors", {
              "text-foreground/75 group-hover:text-foreground":
                !isActive && !isHighlight,
              "text-sky-700 dark:text-sky-400": isActive && !isHighlight,
              "text-indigo-600 dark:text-indigo-300": isHighlight && !isActive,
              "text-indigo-700 dark:text-indigo-200": isHighlight && isActive,
            })}
          >
            <NavigationIcon iconKey={item.icon as NavigationIconKey} size={20} />
          </span>
        )}

        {!isCollapsed && (
          <span className="truncate text-sm font-medium select-none">
            {item.label}
          </span>
        )}
      </Link>

      {isCollapsed &&
        tooltipCoords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="pointer-events-none fixed z-70 -translate-y-1/2 rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-lg whitespace-nowrap dark:bg-surface-secondary dark:text-foreground dark:border dark:border-border"
            id={tooltipId}
            role="tooltip"
            style={{
              top: `${tooltipCoords.top}px`,
              left: `${tooltipCoords.left}px`,
            }}
          >
            {item.label}
          </div>,
          document.body,
        )}
    </>
  );
};
