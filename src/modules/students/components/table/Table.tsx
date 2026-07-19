"use client";
import { Avatar, Button, Chip, Tab, Table, toast } from "@heroui/react";
import {
  Copy01Icon,
  Delete01Icon,
  EyeIcon,
  LinkSquare02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SortableColumnHeader } from "@/ui";
import { ButtonManage, IStudent } from "@/modules/students";
import { TGender } from "@/modules/persons";
import { StudentActions } from "./actions/StudentActions";

interface Props {
  students: IStudent[];
}

export const TableStudents = ({ students }: Props) => {
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
          <Table.Body
            renderEmptyState={() => (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-default-100 text-default-500">
                  <HugeiconsIcon icon={Search01Icon} className="size-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-medium font-medium">
                    No se encontraron estudiantes
                  </span>
                  <span className="text-sm text-default-400">
                    Intenta con otros términos de búsqueda o agrega un nuevo
                    estudiante.
                  </span>
                </div>
              </div>
            )}
          >
            {students.map((student) => (
              <Table.Row key={student.id} id={student.id}>
                <Table.Cell className="font-medium">
                  <div className="flex items-center gap-2">
                    {student.id}{" "}
                    <Button
                      isIconOnly
                      size="sm"
                      variant="ghost"
                      onPress={() => {
                        navigator.clipboard.writeText(student.id);
                        toast.success("ID copiado");
                      }}
                    >
                      <HugeiconsIcon icon={Copy01Icon} />
                    </Button>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Avatar size="sm">
                    <Avatar.Image src={student.person.imageUrl || undefined} />
                    <Avatar.Fallback>
                      {student.person.name.charAt(0)}
                      {student.person.lastName.charAt(0)}
                    </Avatar.Fallback>
                  </Avatar>
                </Table.Cell>
                <Table.Cell>
                  {student.person.name}
                  <HugeiconsIcon icon={LinkSquare02Icon} />
                </Table.Cell>
                <Table.Cell>{student.person.lastName}</Table.Cell>
                <Table.Cell>{student.person.secondLastName || "-"}</Table.Cell>
                <Table.Cell>{student.person.documentNumber}</Table.Cell>
                <Table.Cell>
                  {student.person.birthDate?.toLocaleDateString() || "-"}
                </Table.Cell>
                <Table.Cell>
                  {student.person.birthDate
                    ? new Date().getFullYear() -
                      student.person.birthDate.getFullYear()
                    : "-"}
                </Table.Cell>
                <Table.Cell>{student.person.phone || "-"}</Table.Cell>
                <Table.Cell className="min-w-25">
                  <Chip
                    size="sm"
                    variant="soft"
                    className={genderClassMap[student.person.gender]}
                  >
                    {genderMap[student.person.gender]}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <ButtonManage id={student.id} />
                  <StudentActions student={student} />
                  {/* <div className="flex items-center justify-center gap-1">
                    <ButtonManagePasses id={student.id} />
                    <Button isIconOnly size="sm" variant="tertiary">
                      <HugeiconsIcon icon={EyeIcon} />
                    </Button>
                    <EditModal student={student} isIcon={true} />
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
