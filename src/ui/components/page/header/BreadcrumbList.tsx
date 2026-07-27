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
    <div className="hidden lg:flex items-center md:gap-2 text-outline text-[10px] md:mb-2 font-semibold tracking-wide uppercase">
      {breadcrumb.map((item, index) => (
        <div key={index} className="flex items-center md:gap-2">
          <Breadcrumb
            key={index}
            breadcrumb={item}
            urlBase={urlBase}
            isLast={index === breadcrumb.length - 1}
          />

          {index < breadcrumb.length - 1 && (
            <HugeiconsIcon icon={ChevronRight} size={16} />
          )}
        </div>
      ))}
    </div>
  );
};
