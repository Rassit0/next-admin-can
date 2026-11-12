"use client";

import { ChevronRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Breadcrumb } from "./Breadcrumb";
import { BreadcrumbItem } from "./Header";
import { useSearchParams } from "next/navigation";

interface Props {
  breadcrumb?: BreadcrumbItem[];
  urlBase?: string;
}

export const BreadcrumbList = ({ breadcrumb, urlBase }: Props) => {
  const searchParams = useSearchParams();
  const fromContext = searchParams.get("from");

  if (fromContext || !breadcrumb || breadcrumb.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Ruta de navegación"
      className="hidden sm:flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-muted text-[11px] mb-1 font-semibold tracking-wide uppercase"
    >
      {breadcrumb.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <Breadcrumb
            breadcrumb={item}
            urlBase={urlBase}
            isLast={index === breadcrumb.length - 1}
          />

          {index < breadcrumb.length - 1 && (
            <span aria-hidden="true" className="inline-flex text-muted/70">
              <HugeiconsIcon icon={ChevronRight} size={14} />
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};
