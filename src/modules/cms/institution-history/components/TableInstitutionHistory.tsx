"use client";

import { InstitutionHistoryItem } from "../services";
import { Table, Chip } from "@heroui/react";
import { EditInstitutionHistoryItemModal } from "./EditInstitutionHistoryItemModal";
import { ConfirmDeleteHistoryItemModal } from "./ConfirmDeleteHistoryItemModal";

export const TableInstitutionHistory = ({
  items,
}: {
  items: InstitutionHistoryItem[];
}) => {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Li­nea de tiempo">
          <Table.Header>
            <Table.Column isRowHeader>AiO</Table.Column>
            <Table.Column>TiTULO</Table.Column>
            <Table.Column>ORDEN</Table.Column>
            <Table.Column>ESTADO</Table.Column>
            <Table.Column className="text-right">ACCIONES</Table.Column>
          </Table.Header>
          <Table.Body items={items}>
            {items.map((item) => (
              <Table.Row key={item.id} id={item.id}>
                <Table.Cell className="font-bold">{item.year}</Table.Cell>
                <Table.Cell>{item.title}</Table.Cell>
                <Table.Cell>{item.sortOrder}</Table.Cell>
                <Table.Cell>
                  {item.isActive ? (
                    <Chip color="success" variant="soft" size="sm">
                      Activo
                    </Chip>
                  ) : (
                    <Chip color="default" variant="soft" size="sm">
                      Oculto
                    </Chip>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2 justify-end">
                    <EditInstitutionHistoryItemModal item={item} />
                    <ConfirmDeleteHistoryItemModal item={item} />
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
