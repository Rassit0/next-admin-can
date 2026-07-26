"use client";
import { Button, Table } from "@heroui/react";
import { EyeIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { EditModal } from "../modal/EditModal";
import { SortableColumnHeader } from "@/ui";
import { DeleteModal } from "../modal/DeleteModal";
import { IShift } from "@/modules/shifts";

interface Props {
  shifts: IShift[];
}

export const TableShifts = ({ shifts }: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Table with shifts"
          className="min-w-200"
        >
          <Table.Header>
            <Table.Column isRowHeader allowsSorting id="name">
              <SortableColumnHeader id="name">TURNO</SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="createdAt">
              <SortableColumnHeader id="createdAt">
                CREADO EN
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="updatedAt">
              <SortableColumnHeader id="updatedAt">
                ACTUALIZADO EN
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column className="text-center">ACCIONES</Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-default-100 text-default-500">
                  <HugeiconsIcon icon={Search01Icon} className="size-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-medium font-medium">
                    No se encontraron registros
                  </span>
                  <span className="text-sm text-default-400">
                    Intenta con otros términos de búsqueda o agrega uno nuevo.
                  </span>
                </div>
              </div>
            )}
          >
            {shifts.map((shift) => (
              <Table.Row key={shift.id} id={shift.id}>
                <Table.Cell>{shift.name}</Table.Cell>
                <Table.Cell>
                  {shift.createdAt.toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {shift.updatedAt.toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <Button isIconOnly size="sm" variant="tertiary">
                      <HugeiconsIcon icon={EyeIcon} />
                    </Button>
                    <EditModal shift={shift} />
                    <DeleteModal id={shift.id} />
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
