"use client";
import { Button, Dropdown, Label, Selection } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { IClubOptions } from "@/modules/clubs";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { iconMap } from "@/utils";

interface SelectClubProps {
  clubs: IClubOptions[];
}
export const SelectClub = ({ clubs }: SelectClubProps) => {
  const router = useRouter();
  const pathname = usePathname();
  //   const [selected, setSelected] = useState<Selection>(new Set([clubId]));
  //   const selectedItems = Array.from(selected);

  const clubId = pathname.split("/")[3];

  return (
    <Dropdown>
      <Button aria-label="Menu" variant="secondary">
        <HugeiconsIcon
          icon={
            iconMap[
              clubs.find((club) => club.id === clubId)?.discipline.icon ||
                "default"
            ]
          }
        />
        {clubs.find((club) => club.id === clubId)?.name || "Seleccionar club"}
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          selectionMode="single"
          selectedKeys={[clubId]}
          onSelectionChange={(e: any) => {
            if (!e.currentKey) return;
            const clubId = Array.from(e)[0];
            router.push(`/admin/clubs/${clubId}/dashboard`);
          }}
        >
          {clubs.map((club) => (
            <Dropdown.Item key={club.id} id={club.id} textValue={club.name}>
              <Label className="flex gap-2">
                <HugeiconsIcon icon={iconMap[club.discipline.icon]} />
                {club.name}
              </Label>
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
