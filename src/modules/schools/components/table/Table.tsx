"use client";
import { Avatar, Button, Checkbox, Chip, Table } from "@heroui/react";
import { EyeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { ButtonGestion } from "./ButtonGestion";
import { EditModal } from "../modal/EditModal";
import { SortableColumnHeader } from "@/ui";
import { DeleteModal } from "../modal/DeleteModal";
import { ISchool } from "../../interfaces/school.interface";
import { IDisciplineOptions } from "../../interfaces/options.school.interface";
import { iconMap } from "@/utils";
import { EditModalActionTable } from "./EditModalActionTable";

interface Props {
  schools: ISchool[];
  disciplineId: string;
}

export const TableSchools = ({ schools, disciplineId }: Props) => {
  const [isClient, setIsClient] = useState(false);

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
              <SortableColumnHeader id="name">SCHOOL</SortableColumnHeader>
            </Table.Column>

            <Table.Column className="text-center">ACCIONES</Table.Column>
          </Table.Header>
          <Table.Body>
            {schools.map((school) => (
              <Table.Row key={school.id} id={school.id}>
                <Table.Cell>{school.id}</Table.Cell>
                <Table.Cell>{school.name}</Table.Cell>

                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    {/* <ButtonGestion id={school.id} /> */}
                    <Button isIconOnly size="sm" variant="tertiary">
                      <HugeiconsIcon icon={EyeIcon} />
                    </Button>
                    <EditModalActionTable
                      school={school}
                      disciplineId={disciplineId}
                    />
                    <DeleteModal school={school} isIcon={true} />
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
