"use client";
import { Avatar, Button, Checkbox, Chip, Table } from "@heroui/react";
import { EyeIcon , Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { ButtonGestion } from "./ButtonGestion";
import { EditModal } from "../modal/EditModal";
import { SortableColumnHeader } from "@/ui";
import { DeleteModal } from "../modal/DeleteModal";
import { iconMap } from "@/utils";
import { ICategory, IDisciplineOptions } from "@/modules/categories";

interface Props {
  categories: ICategory[];
  disciplinesOptions: IDisciplineOptions[];
}

export const TableCategories = ({ categories, disciplinesOptions }: Props) => {
  const [isClient, setIsClient] = useState(false);

  // Evitamos la hidratación fallida
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // O un esqueleto de carga (Skeleton)
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Table with custom cells"
          className="min-w-200"
        >
          <Table.Header>
            {/* <Table.Column
              allowsSorting
              isRowHeader
              className="after:hidden"
              id="id"
            >
              ID
            </Table.Column> */}

            <Table.Column isRowHeader allowsSorting id="name">
              <SortableColumnHeader id="name">CATEGORÍA</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="maxAge">
              <SortableColumnHeader id="maxAge">EDAD MAX</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="minAge">
              <SortableColumnHeader id="minAge">EDAD MIN</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="discipline">
              DISCIPLINA
            </Table.Column>
            <Table.Column allowsSorting id="description">
              DESCRIPCIÓN
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
            {categories.map((category) => (
              <Table.Row key={category.id} id={category.id}>
                {/* <Table.Cell>{category.id}</Table.Cell> */}
                <Table.Cell>{category.name}</Table.Cell>
                <Table.Cell>{category.maxAge}</Table.Cell>
                <Table.Cell>{category.minAge}</Table.Cell>
                <Table.Cell>{category.discipline.name}</Table.Cell>
                <Table.Cell>{category.description}</Table.Cell>
                <Table.Cell>
                  {category.createdAt.toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {category.updatedAt.toLocaleDateString()}
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <ButtonGestion
                      id={category.id}
                      clubId={category.discipline.id}
                    />
                    <Button isIconOnly size="sm" variant="tertiary">
                      <HugeiconsIcon icon={EyeIcon} />
                    </Button>
                    <EditModal
                      category={category}
                      disciplinesOptions={disciplinesOptions}
                      isIcon={true}
                    />
                    <DeleteModal category={category} isIcon={true} />
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
