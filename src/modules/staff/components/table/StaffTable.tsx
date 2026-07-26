"use client";
import {
  Avatar,
  Button,
  Chip,
  Table,
  toast,
} from "@heroui/react";
import {
  Copy01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SortableColumnHeader } from "@/ui";
import { IStaff } from "@/modules/staff";
import { TGender } from "@/modules/persons";

interface Props {
  staffs: IStaff[];
}

export const StaffTable = ({ staffs }: Props) => {
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
              <SortableColumnHeader id="name">PERSONAL</SortableColumnHeader>
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

            <Table.Column allowsSorting id="gender">
              <SortableColumnHeader id="gender">GENERO</SortableColumnHeader>
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
                    No se encontró personal
                  </span>
                  <span className="text-sm text-default-400">
                    Intenta con otros términos de búsqueda o agrega nuevo
                    personal.
                  </span>
                </div>
              </div>
            )}
          >
            {staffs.map((staff) => (
              <Table.Row key={staff.id} id={staff.id}>
                <Table.Cell className="font-medium">
                  <div className="flex items-center gap-2">
                    {staff.id}{" "}
                    <Button
                      isIconOnly
                      size="sm"
                      variant="ghost"
                      onPress={() => {
                        navigator.clipboard.writeText(staff.id);
                        toast.success("ID copiado");
                      }}
                    >
                      <HugeiconsIcon icon={Copy01Icon} />
                    </Button>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Avatar size="sm">
                    <Avatar.Image src={staff.person.imageUrl || undefined} />
                    <Avatar.Fallback>
                      {staff.person.name.charAt(0)}
                      {staff.person.lastName.charAt(0)}
                    </Avatar.Fallback>
                  </Avatar>
                </Table.Cell>
                <Table.Cell>
                  {staff.person.name}
                </Table.Cell>
                <Table.Cell>{staff.person.lastName}</Table.Cell>
                <Table.Cell>{staff.person.secondLastName || "-"}</Table.Cell>
                <Table.Cell>{staff.person.documentNumber}</Table.Cell>
                <Table.Cell>
                  {staff.person.birthDate?.toLocaleDateString() || "-"}
                </Table.Cell>
                <Table.Cell>
                  {staff.person.birthDate
                    ? new Date().getFullYear() -
                      staff.person.birthDate.getFullYear()
                    : "-"}
                </Table.Cell>
                <Table.Cell className="min-w-25">
                  <Chip
                    size="sm"
                    variant="soft"
                    className={genderClassMap[staff.person.gender as TGender]}
                  >
                    {genderMap[staff.person.gender as TGender]}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-center gap-2">
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
