"use client";
import { Avatar, Button, Checkbox, Chip, Table } from "@heroui/react";
import {
  EyeIcon,
  Search01Icon,
  Calendar02Icon,
  Edit03Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { EditModal } from "../modal/EditModal";
import { SortableColumnHeader, TableActions, ActionDef } from "@/ui";
import { DeleteModal } from "../modal/DeleteModal";
import { iconMap } from "@/utils";
import { ITeam } from "@/modules/teams";

interface Props {
  teams: ITeam[];
  urlBase: string;
}

export const TableTeams = ({ teams, urlBase }: Props) => {
  const [isClient, setIsClient] = useState(false);

  // Estado para los modales centralizados
  const [selectedTeam, setSelectedTeam] = useState<ITeam | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Evitamos la hidratación fallida
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // O un esqueleto de carga (Skeleton)
  }

  // const genderClassMap: Record<Gender, string> = {
  //   MALE: "bg-blue-500",
  //   FEMALE: "bg-pink-500",
  //   MIXED: "bg-yellow-500",
  // };

  // const genderTextMap: Record<Gender, string> = {
  //   MALE: "Masculino",
  //   FEMALE: "Femenino",
  //   MIXED: "Mixto",
  // };

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

            <Table.Column allowsSorting isRowHeader id="name">
              <SortableColumnHeader id="name">EQUIPO</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="description">
              DESCRIPCIÓN
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
            {teams.map((team) => {
              const rowActions: ActionDef[] = [
                {
                  key: "gestion",
                  label: "Gestionar temporadas",
                  icon: Calendar02Icon,
                  href: `${urlBase}/${team.id}/team-seasons`,
                },
                {
                  key: "details",
                  label: "Detalles",
                  icon: EyeIcon,
                },
                {
                  key: "edit",
                  label: "Editar",
                  icon: Edit03Icon,
                  onPress: () => {
                    setSelectedTeam(team);
                    setIsEditOpen(true);
                  },
                },
                {
                  key: "delete",
                  label: "Eliminar",
                  icon: Delete01Icon,
                  danger: true,
                  onPress: () => {
                    setSelectedTeam(team);
                    setIsDeleteOpen(true);
                  },
                },
              ];

              return (
                <Table.Row key={team.id} id={team.id}>
                  {/* <Table.Cell>{team.id}</Table.Cell> */}
                  <Table.Cell>{team.name}</Table.Cell>
                  <Table.Cell>{team.description}</Table.Cell>
                  <Table.Cell className="text-center">
                    <TableActions actions={rowActions} />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>

      {/* Modales centralizados (mejor rendimiento, 1 sola instancia en el DOM) */}
      {selectedTeam && (
        <>
          <EditModal
            team={selectedTeam}
            clubId={selectedTeam.club.id}
            showButton={false}
            isOpen={isEditOpen}
            onOpenChange={setIsEditOpen}
          />
          <DeleteModal
            team={selectedTeam}
            showButton={false}
            isOpen={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
          />
        </>
      )}
    </Table>
  );
};
