"use client";
import { Button, Dropdown, Label, Selection } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { ISchoolOptions } from "@/modules/schools";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { iconMap } from "@/utils";

interface SelectSchoolProps {
  schools: ISchoolOptions[];
}
export const SelectSchool = ({ schools }: SelectSchoolProps) => {
  const router = useRouter();
  const pathname = usePathname();
  //   const [selected, setSelected] = useState<Selection>(new Set([schoolId]));
  //   const selectedItems = Array.from(selected);

  const schoolId = pathname.split("/")[3];

  return (
    <Dropdown>
      <Button aria-label="Menu" variant="secondary">
        <HugeiconsIcon
          icon={
            iconMap[
              schools.find((school) => school.id === schoolId)?.discipline.icon ||
                "default"
            ]
          }
        />
        {schools.find((school) => school.id === schoolId)?.name || "Seleccionar school"}
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          selectionMode="single"
          selectedKeys={[schoolId]}
          onSelectionChange={(e: any) => {
            if (!e.currentKey) return;
            const schoolId = Array.from(e)[0];
            router.push(`/admin/schools/${schoolId}/dashboard`);
          }}
        >
          {schools.map((school) => (
            <Dropdown.Item key={school.id} id={school.id} textValue={school.name}>
              <Label className="flex gap-2">
                <HugeiconsIcon icon={iconMap[school.discipline.icon]} />
                {school.name}
              </Label>
              <Dropdown.ItemIndicator />
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
