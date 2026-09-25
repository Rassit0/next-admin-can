import Link from "next/link";

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
      href={urlBase ? `${urlBase}/${breadcrumb.href}` : breadcrumb.href}
      className={`${isLast ? "text-foreground font-bold" : "text-foreground/50"}`}
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
