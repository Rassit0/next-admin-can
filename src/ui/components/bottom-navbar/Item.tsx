"use client";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface Props {
  item: NavItem;
  index: number;
  urlBase?: string;
}
export const Item = ({ item, index, urlBase }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromContext = searchParams.get("from");

  // Obtener el path despues de la urlBase si existe
  const currentPath = pathname.replace(urlBase ?? "", "");

  // Obtener el primer segmento del path
  const currentSegment = currentPath.split("/").filter(Boolean)[0] ?? "/";

  // Obtener el primer segmento del item
  const itemSegment = item.href.split("/").filter(Boolean)[0] ?? "/";

  // Si hay un parámetro 'from', sobreescribe el segmento actual para mantener el bottom navbar en contexto
  const effectiveSegment = fromContext || currentSegment;

  // Si el primer segmento efectivo es igual al primer segmento del item, el item esta activo
  const isActive = effectiveSegment === itemSegment;
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
