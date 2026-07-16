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
import { ICourse } from "@/modules/courses";

interface Props {
  courses: ICourse[];
  urlBase: string;
}

export const TableCourses = ({ courses, urlBase }: Props) => {
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
            {courses.map((course) => (
              <Table.Row key={course.id} id={course.id}>
                <Table.Cell>{course.id}</Table.Cell>
                <Table.Cell>{course.name}</Table.Cell>
                <Table.Cell>{course.description}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <ButtonGestion courseId={course.id} urlBase={urlBase} />
                    <Button isIconOnly size="sm" variant="tertiary">
                      <HugeiconsIcon icon={EyeIcon} />
                    </Button>
                    <EditModal
                      course={course}
                      schoolId={course.school.id}
                      isIcon={true}
                    />
                    <DeleteModal course={course} isIcon={true} />
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
