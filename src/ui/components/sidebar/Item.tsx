"use client";

import clsx from "clsx";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";

interface Props {
  item: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  index: number;
  urlBase?: string;
}
export const Item = ({ item, index, urlBase }: Props) => {
  const pathname = usePathname();
  const params = useParams();

  // Obtener el path despues de la urlBase si existe
  const currentPath = pathname.replace(urlBase ?? "", "");

  const searchParams = useSearchParams();
  const fromContext = searchParams.get("from");

  // Obtener el primer segmento del path
  const currentSegment = currentPath.split("/").filter(Boolean)[0] ?? "/";

  // Obtener el primer segmento del item
  const itemSegment = item.href.split("/").filter(Boolean)[0] ?? "/";

  // Si hay un parámetro 'from', sobreescribe el segmento actual para mantener el sidebar en contexto
  const effectiveSegment = fromContext || currentSegment;

  // Si el primer segmento efectivo es igual al primer segmento del item, el item esta activo
  const isActive = effectiveSegment === itemSegment;
  return (
    <Link
      key={index}
      className={clsx(
        "flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-all duration-150",
        {
          " hover:bg-background-tertiary": !isActive,
          "text-sky-700 dark:text-sky-400 font-bold border-l-4 border-sky-600 bg-background-tertiary":
            isActive,
        },
      )}
      href={urlBase ? `${urlBase}/${item.href}` : item.href}
    >
      {item.icon && (
        <span
          className={clsx({
            "text-foreground/80": pathname !== item.href,
          })}
        >
          {item.icon}
        </span>
      )}
      <span className="text-sm font-semibold hidden lg:block nav-text select-none">
        {item.label}
      </span>
    </Link>
  );
};
