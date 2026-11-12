import Link from "next/link";
import { resolveNavigationHref } from "@/ui/components/navigation/navigation-url";

interface BreadcrumbItem {
  label: string;
  href?: string; // opcional si quieres navegación
}

interface Props {
  breadcrumb?: BreadcrumbItem;
  isLast?: boolean;
  urlBase?: string;
}
export const Breadcrumb = ({ breadcrumb, isLast, urlBase }: Props) => {
  return breadcrumb?.href ? (
    <Link
      href={resolveNavigationHref(breadcrumb.href, urlBase)}
      aria-current={isLast ? "page" : undefined}
      className={`${isLast ? "text-foreground font-bold" : "text-foreground/50"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded`}
    >
      {breadcrumb.label}
    </Link>
  ) : (
    <span
      className={`${isLast ? "text-foreground font-bold" : "text-foreground/50"}`}
    >
      {breadcrumb?.label}
    </span>
  );
};
