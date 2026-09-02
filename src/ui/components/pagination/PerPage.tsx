"use client";
import { Key, Label, ListBox, Select } from "@heroui/react";
import { PER_PAGE } from "@/utils/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const PerPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPerPage = searchParams.get("per_page") || "5";

  const handlePerPageChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("per_page", value);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <Select
      variant="secondary"
      className="md:w-20"
      placeholder="Ver"
      selectedKey={currentPerPage}
      onSelectionChange={(key) => handlePerPageChange(key?.toString() || "5")}
    >
      <Label>Ver</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="bg-default">
        <ListBox items={PER_PAGE}>
          {(item) => (
            <ListBox.Item
              key={item.value}
              id={item.value}
              textValue={item.label}
              className="hover:bg-accent-soft"
            >
              {item.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          )}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};
