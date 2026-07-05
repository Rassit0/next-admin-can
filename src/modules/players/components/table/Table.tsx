"use client";
import { Avatar, Button, Chip, Tab, Table, toast } from "@heroui/react";
import {
  Copy01Icon,
  Delete01Icon,
  EyeIcon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SortableColumnHeader } from "@/ui";
import { ButtonManage, IPlayer } from "@/modules/players";
import { TGender } from "@/modules/persons";
import { PlayerActions } from "./actions/PlayerActions";

interface Props {
  players: IPlayer[];
}

export const TablePlayers = ({ players }: Props) => {
  const statusColorMap: Record<string, "success" | "danger" | "warning"> = {
    Active: "success",
    Inactive: "danger",
    "On Leave": "warning",
  };

  const genderMap: Record<TGender, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
  };

  const genderClassMap: Record<TGender, string> = {
    MALE: "bg-blue-400 text-blue-50",
    FEMALE: "bg-pink-400 text-pink-50",
  };

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
              <SortableColumnHeader id="id">ID</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="image">
              IMAGEN
            </Table.Column>

            <Table.Column allowsSorting id="name">
              <SortableColumnHeader id="name">JUGADOR</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="lastName">
              <SortableColumnHeader id="lastName">
                Primer Apellido
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="secondLastName">
              <SortableColumnHeader id="secondLastName">
                Segundo Apellido
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="documentNumber">
              <SortableColumnHeader id="documentNumber">
                CI
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="birthDate">
              <SortableColumnHeader id="birthDate">
                FECHA NACIMIENTO
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column>EDAD</Table.Column>

            <Table.Column allowsSorting id="phone">
              <SortableColumnHeader id="phone">TELÉFONO</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="gender">
              <SortableColumnHeader id="gender">GENERO</SortableColumnHeader>
            </Table.Column>

            <Table.Column className="text-center">ACCIONES</Table.Column>
          </Table.Header>
          <Table.Body>
            {players.map((player) => (
              <Table.Row key={player.id} id={player.id}>
                <Table.Cell className="font-medium">
                  <div className="flex items-center gap-2">
                    {player.id}{" "}
                    <Button
                      isIconOnly
                      size="sm"
                      variant="ghost"
                      onPress={() => {
                        navigator.clipboard.writeText(player.id);
                        toast.success("ID copiado");
                      }}
                    >
                      <HugeiconsIcon icon={Copy01Icon} />
                    </Button>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Avatar size="sm">
                    <Avatar.Image src={player.person.imageUrl || undefined} />
                    <Avatar.Fallback>
                      {player.person.name.charAt(0)}
                      {player.person.lastName.charAt(0)}
                    </Avatar.Fallback>
                  </Avatar>
                </Table.Cell>
                <Table.Cell>
                  {player.person.name}
                  <HugeiconsIcon icon={LinkSquare02Icon} />
                </Table.Cell>
                <Table.Cell>{player.person.lastName}</Table.Cell>
                <Table.Cell>{player.person.secondLastName || "-"}</Table.Cell>
                <Table.Cell>{player.person.documentNumber}</Table.Cell>
                <Table.Cell>
                  {player.person.birthDate?.toLocaleDateString() || "-"}
                </Table.Cell>
                <Table.Cell>
                  {player.person.birthDate
                    ? new Date().getFullYear() -
                      player.person.birthDate.getFullYear()
                    : "-"}
                </Table.Cell>
                <Table.Cell>{player.person.phone || "-"}</Table.Cell>
                <Table.Cell className="min-w-25">
                  <Chip
                    size="sm"
                    variant="soft"
                    className={genderClassMap[player.person.gender]}
                  >
                    {genderMap[player.person.gender]}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <ButtonManage id={player.id} />
                  <PlayerActions player={player} />
                  {/* <div className="flex items-center justify-center gap-1">
                    <ButtonManagePasses id={player.id} />
                    <Button isIconOnly size="sm" variant="tertiary">
                      <HugeiconsIcon icon={EyeIcon} />
                    </Button>
                    <EditModal player={player} isIcon={true} />
                    <Button isIconOnly size="sm" variant="danger-soft">
                      <HugeiconsIcon icon={Delete01Icon} />
                    </Button>
                  </div> */}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
