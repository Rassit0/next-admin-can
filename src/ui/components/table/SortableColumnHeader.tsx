"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import clsx from "clsx";
import { ChevronUp } from "@hugeicons/core-free-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  children: React.ReactNode;
  id: string;
}

export const SortableColumnHeader = ({ children, id }: Props) => {
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortDescriptor = {
    column: searchParams.get("sortField") || "",
    direction: (searchParams.get("orderBy") || "asc") as "asc" | "desc",
  };

  const isSorted = sortDescriptor.column === id;
  const sortDirection = sortDescriptor.direction;

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());

    const currentField = params.get("sortField");
    const currentOrder = params.get("orderBy");

    let nextOrder: "asc" | "desc" = "asc";

    // Si ya está ordenado por esta columna
    if (currentField === id) {
      nextOrder = currentOrder === "asc" ? "desc" : "asc";
    }

    params.set("sortField", id);
    params.set("orderBy", nextOrder);

    // Reset pagination
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <button
      type="button"
      onClick={handleSort}
      className={clsx(
        "group flex items-center gap-1 select-none transition-colors",
        "hover:text-primary",
      )}
    >
      <span>{children}</span>

      <HugeiconsIcon
        icon={ChevronUp}
        className={clsx(
          "size-3 transition-all duration-150 ease-out",
          isSorted ? "opacity-100" : "opacity-0 group-hover:opacity-40",
          sortDirection === "desc" && "rotate-180",
        )}
      />
    </button>
  );
};
