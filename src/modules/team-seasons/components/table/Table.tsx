"use client";
import { Avatar, Button, Checkbox, Chip, Table } from "@heroui/react";
import { EyeIcon , Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { ButtonGestion } from "./ButtonGestion";
import { SortableColumnHeader } from "@/ui";
import { DeleteModal } from "../modal/DeleteModal";
import { iconMap } from "@/utils";
import { ButtonOfferings, ITeamSeason } from "@/modules/team-seasons";

interface Props {
  teamSeasons: ITeamSeason[];
  urlBase: string;
}

export const TableTeamSeasons = ({ teamSeasons, urlBase }: Props) => {
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

            <Table.Column isRowHeader allowsSorting id="seasonName">
              <SortableColumnHeader id="seasonName">
                TEMPORADA
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column isRowHeader allowsSorting id="startDate">
              <SortableColumnHeader id="startDate">
                FECHA INICIO
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column isRowHeader allowsSorting id="endDate">
              <SortableColumnHeader id="endDate">
                FECHA FIN
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="categories">
              CATEGORÍAS
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
            {teamSeasons.map((teamSeason) => (
              <Table.Row key={teamSeason.id} id={teamSeason.id}>
                {/* <Table.Cell>{category.id}</Table.Cell> */}
                <Table.Cell>{teamSeason.season.name}</Table.Cell>
                <Table.Cell>
                  {teamSeason.season.startDate.toLocaleDateString("es-BO", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Table.Cell>
                <Table.Cell>
                  {teamSeason.season.endDate.toLocaleDateString("es-BO", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Table.Cell>
                <Table.Cell>
                  <Chip size="sm" variant="tertiary">
                    {teamSeason.categories?.length || 0}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  {teamSeason.createdAt.toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {teamSeason.updatedAt.toLocaleDateString()}
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <ButtonOfferings
                      urlBase={urlBase}
                      teamSeasonId={teamSeason.id}
                    />
                    {/* <ButtonGestion
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
                    <DeleteModal category={category} isIcon={true} /> */}
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
