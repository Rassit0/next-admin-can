"use client";
import { Avatar, Button, Checkbox, Chip, Table } from "@heroui/react";
import { EyeIcon , Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { ButtonGestion } from "./ButtonGestion";
import { EditModal } from "../modal/EditModal";
import { SortableColumnHeader } from "@/ui";
import { DeleteModal } from "../modal/DeleteModal";
import { ISeason, SeasonStatus } from "../../interfaces/season.interface";
import { SeasonActions } from "../actions/SeasonActions";

interface Props {
  seasons: ISeason[];
  institutionId: string;
  disciplineId: string;
}

export const TableSeasons = ({
  seasons,
  institutionId,
  disciplineId,
}: Props) => {
  const [isClient, setIsClient] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "name",
    direction: "ascending",
  });

  // Evitamos la hidratación fallida
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // O un esqueleto de carga (Skeleton)
  }

  const statusBgMap: Record<SeasonStatus, string> = {
    ACTIVE: "bg-success-soft text-success",
    CANCELLED: "bg-danger-soft text-danger",
    FINISHED: "bg-primary-soft text-primary",
  };

  const statusTextMap: Record<SeasonStatus, string> = {
    ACTIVE: "Activa",
    CANCELLED: "Cancelada",
    FINISHED: "Finalizada",
  };

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Table with custom cells"
          className="min-w-200"
          //   selectedKeys={selectedKeys}
          //   selectionMode="multiple"
          sortDescriptor={sortDescriptor}
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
              ID
            </Table.Column>

            <Table.Column allowsSorting id="name">
              <SortableColumnHeader id="name">TEMPORADA</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="startDate">
              FECHA INICIO
            </Table.Column>

            <Table.Column allowsSorting id="endDate">
              FECHA FIN
            </Table.Column>

            <Table.Column allowsSorting id="status">
              ESTADO
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
            {seasons.map((season) => (
              <Table.Row key={season.id} id={season.id}>
                <Table.Cell>{season.id}</Table.Cell>
                <Table.Cell>{season.name}</Table.Cell>
                <Table.Cell>{season.startDate.toLocaleDateString()}</Table.Cell>
                <Table.Cell>{season.endDate.toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <Chip
                    className={statusBgMap[season.status]}
                    size="sm"
                  >
                    {statusTextMap[season.status]}
                  </Chip>
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    {/* <ButtonGestion id={season.id} /> */}
                    <Button isIconOnly size="sm" variant="tertiary">
                      <HugeiconsIcon icon={EyeIcon} />
                    </Button>
                    <EditModal
                      institutionId={institutionId}
                      disciplineId={disciplineId}
                      season={season}
                      isIcon={true}
                    />
                    <DeleteModal season={season} isIcon={true} />
                    <SeasonActions season={season} />
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
