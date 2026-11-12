"use client";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  isNavigationItemActive,
  resolveNavigationHref,
} from "@/ui/components/navigation/navigation-url";

interface Props {
  item: NavItem;
  index: number;
  urlBase?: string;
}
export const Item = ({ item, index, urlBase }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromContext = searchParams.get("from");

  const resolvedHref = resolveNavigationHref(item.href, urlBase);
  const isActive = isNavigationItemActive(
    pathname,
    item.href,
    urlBase,
    fromContext,
  );
  return (
    <Link
      key={index}
      aria-current={isActive ? "page" : undefined}
      className={clsx(
        "flex flex-col items-center justify-center rounded-2xl px-4 py-1 active:scale-90 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
        isActive
          ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
          : "bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
      )}
      href={resolvedHref}
    >
      {item.icon}
      <span className="font-inter text-[11px] font-bold tracking-tighter uppercase mt-1">
        {item.label}
      </span>
    </Link>
  );
};
