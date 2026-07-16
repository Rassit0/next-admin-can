"use client";
import { ComboBox, FieldError, Input, Label, ListBox } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ISchoolOptions } from "@/modules/courses";

interface Props {
  schoolOptions: ISchoolOptions[];
  urlBase: string;
  schoolId?: string;
}

export const SelectSchoolOptions = ({ schoolOptions, urlBase, schoolId }: Props) => {
  const router = useRouter();

  return (
    <ComboBox
      variant="secondary"
      className="w-full"
      name="schoolId"
      value={schoolId || null}
      onChange={(key) => {
        if (key === schoolId) return;
        router.push(`${urlBase}/${key}`);
      }}
    >
      <Label>School</Label>
      <ComboBox.InputGroup>
        <Input placeholder="Buscar school..." />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {schoolOptions.map((school) => (
            <ListBox.Item key={school.id} id={school.id} textValue={school.name}>
              {school.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
};
