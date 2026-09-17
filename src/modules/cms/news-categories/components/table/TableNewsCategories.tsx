"use client";
import { Chip, Table } from "@heroui/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SortableColumnHeader } from "@/ui";
import { INewsCategory } from "../../interfaces/news-categories.interface";
import { NewsCategoryActions } from "./actions/NewsCategoryActions";

interface Props {
  categories: INewsCategory[];
}

export const TableNewsCategories = ({ categories }: Props) => {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Categorías de Noticias"
          className="min-w-200"
        >
          <Table.Header>
            <Table.Column allowsSorting isRowHeader id="name">
              <SortableColumnHeader id="name">Nombre</SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="slug">
              <SortableColumnHeader id="slug">Slug</SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="sortOrder">
              <SortableColumnHeader id="sortOrder">Orden</SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="isActive">
              <SortableColumnHeader id="isActive">Estado</SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="createdAt">
              <SortableColumnHeader id="createdAt">
                Fecha de Creación
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
                    No se encontraron categorías
                  </span>
                  <span className="text-sm text-default-400">
                    Crea una nueva categoría para empezar.
                  </span>
                </div>
              </div>
            )}
          >
            {categories.map((item) => (
              <Table.Row key={item.id} id={item.id}>
                <Table.Cell className="font-medium">{item.name}</Table.Cell>
                <Table.Cell className="text-default-500">
                  {item.slug}
                </Table.Cell>
                <Table.Cell>{item.sortOrder}</Table.Cell>
                <Table.Cell>
                  <Chip
                    size="sm"
                    variant="soft"
                    color={item.isActive ? "success" : "default"}
                  >
                    {item.isActive ? "Activo" : "Inactivo"}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "-"}
                </Table.Cell>
                <Table.Cell>
                  <NewsCategoryActions item={item} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
