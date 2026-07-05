"use client";
import { ComboBox, FieldError, Input, Label, ListBox } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { IClubOptions } from "@/modules/teams";

interface Props {
  clubOptions: IClubOptions[];
  urlBase: string;
  clubId?: string;
}

export const SelectClubOptions = ({ clubOptions, urlBase, clubId }: Props) => {
  const router = useRouter();

  return (
    <ComboBox
      variant="secondary"
      className="w-full"
      name="clubId"
      value={clubId || null}
      onChange={(key) => {
        if (key === clubId) return;
        router.push(`${urlBase}/${key}`);
      }}
    >
      <Label>Club</Label>
      <ComboBox.InputGroup>
        <Input placeholder="Buscar club..." />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {clubOptions.map((club) => (
            <ListBox.Item key={club.id} id={club.id} textValue={club.name}>
              {club.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
};
