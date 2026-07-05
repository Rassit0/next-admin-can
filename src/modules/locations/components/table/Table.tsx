"use client";
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
import { useEffect, useState } from "react";
import { ButtonGestion } from "./ButtonGestion";
import { EditModal } from "../modal/EditModal";
import { SortableColumnHeader } from "@/ui";
import { DeleteModal } from "../modal/DeleteModal";
import { ILocation } from "../../interfaces/location.interface";

interface Props {
  locations: ILocation[];
}

export const TableLocations = ({ locations }: Props) => {
  const [isClient, setIsClient] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "id",
    direction: "ascending",
  });

  // Evitamos la hidratación fallida
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // O un esqueleto de carga (Skeleton)
  }

  const statusColorMap: Record<string, "success" | "danger"> = {
    Active: "success",
    Inactive: "danger",
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
              <SortableColumnHeader id="name">INSTALACIÓN</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="address">
              <SortableColumnHeader id="address">
                DIRECCIÓN
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="description">
              <SortableColumnHeader id="description">
                DESCRIPCIÓN
              </SortableColumnHeader>
            </Table.Column>

            {/* <Table.Column allowsSorting id="status">
              <SortableColumnHeader id="status" >
                ESTADO
              </SortableColumnHeader>
            </Table.Column> */}

            <Table.Column allowsSorting id="isInternal">
              <SortableColumnHeader id="isInternal">
                ¿ES INTERNO?
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="isRentable">
              <SortableColumnHeader id="isRentable">
                ¿SE PUEDE ALQUILAR?
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column className="text-center">ACCIONES</Table.Column>
          </Table.Header>
          <Table.Body>
            {locations.map((location) => (
              <Table.Row key={location.id} id={location.id}>
                <Table.Cell>{location.id}</Table.Cell>
                <Table.Cell>{location.name}</Table.Cell>
                <Table.Cell>{location.address}</Table.Cell>
                <Table.Cell>{location.description || "-"}</Table.Cell>
                {/* <Table.Cell>
                  <Chip
                    color={
                      statusColorMap[location.isActive ? "Active" : "Inactive"]
                    }
                    size="sm"
                    variant="soft"
                  >
                    {location.isActive ? "Activo" : "Inactivo"}
                  </Chip>
                </Table.Cell> */}
                <Table.Cell>
                  <Chip
                    color={
                      statusColorMap[
                        location.isInternal ? "Active" : "Inactive"
                      ]
                    }
                    size="sm"
                    variant="soft"
                  >
                    {location.isInternal ? "Sí" : "No"}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <Chip
                    color={
                      statusColorMap[
                        location.isRentable ? "Active" : "Inactive"
                      ]
                    }
                    size="sm"
                    variant="soft"
                  >
                    {location.isRentable ? "Sí" : "No"}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <ButtonGestion id={location.id} />
                    <Button isIconOnly size="sm" variant="tertiary">
                      <HugeiconsIcon icon={EyeIcon} />
                    </Button>
                    <EditModal location={location} isIcon={true} />
                    <DeleteModal location={location} isIcon={true} />
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
