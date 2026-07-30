"use client";
import { Button, Chip, Table, Popover } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete01Icon,
  Edit02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { SortableColumnHeader } from "@/ui";
import { IAccountCategory } from "../../interfaces/category.interface";

interface Props {
  categories: IAccountCategory[];
  onEdit: (category: IAccountCategory) => void;
  onDelete: (category: IAccountCategory) => void;
}

export const AccountCategoriesTable = ({
  categories,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Categorías" className="min-w-200">
          <Table.Header>
            <Table.Column allowsSorting id="name" isRowHeader>
              <SortableColumnHeader id="name">Nombre</SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="description">
              <SortableColumnHeader id="description">
                Descripción
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="type">
              <SortableColumnHeader id="type">Tipo</SortableColumnHeader>
            </Table.Column>
            <Table.Column className="text-center">Acciones</Table.Column>
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
                    Registra una nueva categoría para organizar tus
                    transacciones.
                  </span>
                </div>
              </div>
            )}
          >
            {categories.map((category) => (
              <Table.Row key={category.id} id={category.id}>
                <Table.Cell className="font-medium">{category.name}</Table.Cell>
                <Table.Cell className="text-default-500 max-w-[300px] truncate">
                  {category.description || "-"}
                </Table.Cell>
                <Table.Cell>
                  <Chip
                    size="sm"
                    variant="soft"
                    color={
                      category.type === "RECEIVABLE" ? "success" : "danger"
                    }
                  >
                    {category.type === "RECEIVABLE" ? "Ingreso" : "Egreso"}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-center gap-2">
                    {onEdit && (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        onPress={() => onEdit(category)}
                      >
                        <HugeiconsIcon
                          icon={Edit02Icon}
                          size={18}
                          className="text-default-500"
                        />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="danger-soft"
                        onPress={() => onDelete(category)}
                      >
                        <HugeiconsIcon icon={Delete01Icon} size={18} />
                      </Button>
                    )}
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
