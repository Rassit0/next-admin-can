"use client";
import { EditModal, IPerson } from "@/modules/persons";
import { Avatar, Button, Checkbox, Chip, Table } from "@heroui/react";
import {
  ChevronUp,
  Copy01Icon,
  Delete01Icon,
  Edit03Icon,
  EyeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import clsx from "clsx";
import { useState } from "react";
import { ButtonGestion } from "./ButtonGestion";
import { SortableColumnHeader } from "@/ui";

interface Props {
  persons: IPerson[];
}

export const TablePersons = ({ persons }: Props) => {
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "id",
    direction: "ascending",
  });

  const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
    Active: "success",
    Inactive: "danger",
    "On Leave": "warning",
  };

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Table with custom cells"
          className="min-w-200"
          //   selectedKeys={selectedKeys}
          //   selectionMode="multiple"

          //   onSelectionChange={setSelectedKeys}
          onSortChange={(sd) =>
            setSortDescriptor({
              column: sd.column.toString(),
              direction: sd.direction,
            })
          }
        >
          <Table.Header>
            <Table.Column
              allowsSorting
              isRowHeader
              className="after:hidden"
              id="id"
            >
              <SortableColumnHeader id="id">ID</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="name">
              <SortableColumnHeader id="name">PERSONA</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="ci">
              <SortableColumnHeader id="ci">CI</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="role">
              <SortableColumnHeader id="role">DISCIPLINA</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="phone">
              <SortableColumnHeader id="phone">TELÉFONO</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="status">
              <SortableColumnHeader id="status">ESTADO</SortableColumnHeader>
            </Table.Column>
            <Table.Column className="text-center">ACCIONES</Table.Column>
          </Table.Header>
          <Table.Body>
            {persons.map((person) => (
              <Table.Row key={person.id} id={person.id}>
                <Table.Cell className="font-medium">
                  <div className="flex items-center gap-2">
                    #{person.id.toString()}{" "}
                    <Button isIconOnly size="sm" variant="ghost">
                      <HugeiconsIcon icon={Copy01Icon} />
                    </Button>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <Avatar size="sm">
                      <Avatar.Image src={person.imageUrl || undefined} />
                      <Avatar.Fallback>
                        {(
                          person.name +
                          " " +
                          person.lastName +
                          (person.secondLastName
                            ? " " + person.secondLastName
                            : "")
                        )
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-xs">
                        {person.name +
                          " " +
                          person.lastName +
                          (person.secondLastName
                            ? " " + person.secondLastName
                            : "")}
                      </span>
                      <span className="text-xs text-muted">{person.email}</span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>{person.documentNumber}</Table.Cell>
                <Table.Cell>Jugador</Table.Cell>
                <Table.Cell>{person.phone || "-"}</Table.Cell>
                <Table.Cell className="min-w-25">
                  <Chip
                    color={statusColorMap["Active"]}
                    size="sm"
                    variant="soft"
                  >
                    Activo
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <ButtonGestion id={person.id} />
                    <Button isIconOnly size="sm" variant="tertiary">
                      <HugeiconsIcon icon={EyeIcon} />
                    </Button>
                    <EditModal person={person} isIcon={true} />
                    <Button isIconOnly size="sm" variant="danger-soft">
                      <HugeiconsIcon icon={Delete01Icon} />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
