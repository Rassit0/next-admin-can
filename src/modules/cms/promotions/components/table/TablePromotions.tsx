"use client";
import { Avatar, Chip, Table } from "@heroui/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SortableColumnHeader } from "@/ui";
import { IPromotion } from "../../interfaces/promotions.interface";
import { PromotionActions } from "./actions/PromotionActions";

interface Props {
  promotions: IPromotion[];
}

export const TablePromotions = ({ promotions }: Props) => {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Promotions" className="min-w-200">
          <Table.Header>
            <Table.Column id="image" isRowHeader>
              PORTADA
            </Table.Column>
            <Table.Column allowsSorting id="title">
              <SortableColumnHeader id="title">Título</SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="position">
              <SortableColumnHeader id="position">
                Posicón
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="isActive">
              <SortableColumnHeader id="isActive">Estado</SortableColumnHeader>
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
                    No se encontraron promotions
                  </span>
                  <span className="text-sm text-default-400">
                    Crea un nuevo promotion para empezar.
                  </span>
                </div>
              </div>
            )}
          >
            {promotions.map((item) => (
              <Table.Row key={item.id} id={item.id}>
                <Table.Cell>
                  <Avatar size="sm">
                    <Avatar.Image src={item.image16x9} />
                    <Avatar.Fallback>
                      {item.title.charAt(0).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar>
                </Table.Cell>
                <Table.Cell className="font-medium max-w-75 truncate">
                  {item.title}
                </Table.Cell>
                <Table.Cell>
                  {item.position === "PROMO_1" ? "Promo 1" : "Promo 2"}
                </Table.Cell>
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
                  <PromotionActions item={item} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
