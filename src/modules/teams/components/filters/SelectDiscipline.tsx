"use client";
import { ComboBox, FieldError, Input, Label, ListBox } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { IDisciplineOptions } from "@/modules/teams";

interface Props {
  disciplineOptions: IDisciplineOptions[];
  urlBase: string;
  disciplineId?: string;
}

export const SelectDisciplineOptions = ({
  disciplineOptions,
  urlBase,
  disciplineId,
}: Props) => {
  const router = useRouter();

  return (
    <ComboBox
      variant="secondary"
      className="w-full"
      name="disciplineId"
      value={disciplineId || null}
      onChange={(key) => {
        if (key === disciplineId) return;
        router.push(`${urlBase}/${key}`);
      }}
    >
      <Label>Disciplina</Label>
      <ComboBox.InputGroup>
        <Input placeholder="Buscar disciplina..." />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {disciplineOptions.map((discipline) => (
            <ListBox.Item
              key={discipline.id}
              id={discipline.id}
              textValue={discipline.name}
            >
              {discipline.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
};
