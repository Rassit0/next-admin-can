"use client";

import clsx from "clsx";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";
import {
  NavigationIcon,
  NavigationIconKey,
} from "@/ui/components/navigation/IconRegistry";
import { resolveNavigationHref } from "@/ui/components/navigation/navigation-url";

interface Props {
  item: NavItem;
  urlBase?: string;
  isActive: boolean;
  onClick?: () => void;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 28,
};

export const MobileNavItem = ({ item, urlBase, isActive, onClick }: Props) => {
  const prefersReducedMotion = useReducedMotion();
  const displayLabel = item.shortLabel ?? item.label;

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className="flex h-full min-h-12 w-full justify-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      href={resolveNavigationHref(item.href, urlBase)}
      onClick={onClick}
    >
      <motion.div
        className={clsx(
          "relative flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-2xl px-1 py-1.5",
          item.highlight &&
            !isActive &&
            "bg-indigo-50/70 dark:bg-indigo-900/20",
        )}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
      >
        {isActive && (
          <motion.div
            className={clsx(
              "absolute inset-0 rounded-2xl",
              item.highlight
                ? "bg-indigo-500/15 dark:bg-indigo-500/30 shadow-[inset_0_0_12px_rgba(99,102,241,0.15)]"
                : "bg-sky-500/12 dark:bg-sky-500/25 shadow-[inset_0_0_12px_rgba(14,165,233,0.12)]",
            )}
            initial={false}
            layoutId="mobile-active-pill"
            transition={
              prefersReducedMotion ? { duration: 0.05 } : springTransition
            }
          />
        )}

        <div
          className={clsx(
            "relative z-10 flex w-full flex-col items-center justify-center transition-colors duration-200",
            item.highlight
              ? isActive
                ? "text-indigo-700 dark:text-indigo-300"
                : "text-indigo-600/90 dark:text-indigo-400/80 hover:text-indigo-700 dark:hover:text-indigo-300"
              : isActive
                ? "text-sky-600 dark:text-sky-400"
                : "text-foreground/65 hover:text-sky-600 dark:hover:text-sky-300",
          )}
        >
          <div className="flex h-5 items-center justify-center">
            {item.icon && (
              <NavigationIcon
                iconKey={item.icon as NavigationIconKey}
                size={20}
              />
            )}
          </div>
          {displayLabel && (
            <span className="mt-1 w-full truncate px-0.5 text-center text-[10px] sm:text-[11px] font-semibold leading-none tracking-tight">
              {displayLabel}
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
};
