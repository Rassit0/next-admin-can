"use client";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  item: NavItem;
  index: number;
  urlBase?: string;
}
export const Item = ({ item, index, urlBase }: Props) => {
  const pathname = usePathname();

  // Obtener el path despues de la urlBase si existe
  const currentPath = pathname.replace(urlBase ?? "", "");

  // Obtener el primer segmento del path
  const currentSegment = currentPath.split("/").filter(Boolean)[0] ?? "/";

  // Obtener el primer segmento del item
  const itemSegment = item.href.split("/").filter(Boolean)[0] ?? "/";

  // Si el primer segmento del path es igual al primer segmento del item, entonces el item esta activo
  const isActive = currentSegment === itemSegment;
  return (
    <Link
      key={index}
      className={clsx(
        "flex flex-col items-center justify-center rounded-2xl px-4 py-1 active:scale-90 transition-all duration-300",
        isActive
          ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
          : "bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
      )}
      href={urlBase ? `${urlBase}/${item.href}` : item.href}
    >
      {item.icon}
      <span className="font-inter text-[11px] font-bold tracking-tighter uppercase mt-1">
        {item.label}
      </span>
    </Link>
  );
};
