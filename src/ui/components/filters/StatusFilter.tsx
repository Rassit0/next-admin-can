"use client";

import type { Key } from "@heroui/react";
import { ListBox, Select } from "@heroui/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface StatusOption {
  id: string;
  name: string;
}

interface Props {
  options: StatusOption[];
  defaultSelected?: string;
  label?: string;
  className?: string;
}

export function StatusFilter({
  options,
  defaultSelected,
  label = "Estado",
  className = "w-50",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [state, setState] = useState<Key | null>(null);

  useEffect(() => {
    const currentStatus =
      searchParams.get("status") || defaultSelected || options[0]?.id;
    setState(currentStatus);
  }, [searchParams, defaultSelected, options]);

  const handleChange = (value: Key | null) => {
    setState(value);

    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== defaultSelected) {
      params.set("status", value.toString());
    } else {
      params.delete("status");
    }

    // Al cambiar filtros, reseteamos a la página 1
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={className}>
      <Select
        className="w-full"
        placeholder="Seleccionar estado"
        value={state}
        onChange={handleChange}
        aria-label={label}
        variant="secondary"
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox items={options}>
            {(opt) => (
              <ListBox.Item key={opt.id} id={opt.id} textValue={opt.name}>
                {opt.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
