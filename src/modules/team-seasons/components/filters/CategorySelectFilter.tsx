"use client";

import { Key, Label, ListBox, Select } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CategorySelectFilterProps {
  categories: { id: string; name: string }[];
}

export const CategorySelectFilter = ({ categories }: CategorySelectFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("teamSeasonCategoryId") || "all";

  const allCategories = [{ id: "all", name: "Todas las categorías" }, ...categories];

  const handleSelectionChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1"); // Reset a página 1

    if (value && value !== "all") {
      params.set("teamSeasonCategoryId", value);
    } else {
      params.delete("teamSeasonCategoryId");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      aria-label="Filtro de categorías"
      variant="secondary"
      className="md:w-64 w-full"
      placeholder="Categoría"
      value={currentCategoryId as Key}
      onChange={(value) => handleSelectionChange(value?.toString() || "all")}
    >
      <Label>Categoría</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="bg-default">
        <ListBox>
          {allCategories.map((cat) => (
            <ListBox.Item
              key={cat.id}
              id={cat.id}
              textValue={cat.name}
              className="hover:bg-accent-soft"
            >
              {cat.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};
