"use client";

import { Key, Label, ListBox, Select } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ShiftSelectFilterProps {
  shifts: { id: string; name: string }[];
}

export const ShiftSelectFilter = ({ shifts }: ShiftSelectFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentShiftId = searchParams.get("shiftId") || "all";

  const allShifts = [{ id: "all", name: "Todos los turnos" }, ...shifts];

  const handleSelectionChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1"); // Reset a página 1

    if (value && value !== "all") {
      params.set("shiftId", value);
    } else {
      params.delete("shiftId");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      aria-label="Filtro de turnos"
      variant="secondary"
      className="md:w-64 w-full"
      placeholder="Turno"
      value={currentShiftId as Key}
      onChange={(value) => handleSelectionChange(value?.toString() || "all")}
    >
      <Label>Turno</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover className="bg-default">
        <ListBox>
          {allShifts.map((shift) => (
            <ListBox.Item
              key={shift.id}
              id={shift.id}
              textValue={shift.name}
              className="hover:bg-accent-soft"
            >
              {shift.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};


