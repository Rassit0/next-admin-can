"use client";
import { Avatar, Button, Checkbox, Chip, Table } from "@heroui/react";
import { EyeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { ButtonGestion } from "./ButtonGestion";
import { EditModal } from "../modal/EditModal";
import { SortableColumnHeader } from "@/ui";
import { DeleteModal } from "../modal/DeleteModal";
import { iconMap } from "@/utils";
import { ITeam } from "@/modules/teams";

interface Props {
  teams: ITeam[];
  urlBase: string;
}

export const TableTeams = ({ teams, urlBase }: Props) => {
  const [isClient, setIsClient] = useState(false);

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
            <Table.Column
              allowsSorting
              isRowHeader
              className="after:hidden"
              id="id"
            >
              ID
            </Table.Column>

            <Table.Column allowsSorting id="name">
              <SortableColumnHeader id="name">EQUIPO</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="description">
              DESCRIPCIÓN
            </Table.Column>

            <Table.Column className="text-center">ACCIONES</Table.Column>
          </Table.Header>
          <Table.Body>
            {teams.map((team) => (
              <Table.Row key={team.id} id={team.id}>
                <Table.Cell>{team.id}</Table.Cell>
                <Table.Cell>{team.name}</Table.Cell>
                <Table.Cell>{team.description}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <ButtonGestion teamId={team.id} urlBase={urlBase} />
                    <Button isIconOnly size="sm" variant="tertiary">
                      <HugeiconsIcon icon={EyeIcon} />
                    </Button>
                    <EditModal
                      team={team}
                      clubId={team.club.id}
                      isIcon={true}
                    />
                    <DeleteModal team={team} isIcon={true} />
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
