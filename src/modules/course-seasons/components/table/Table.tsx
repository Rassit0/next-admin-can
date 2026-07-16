"use client";
import { Avatar, Button, Checkbox, Chip, Table } from "@heroui/react";
import { EyeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { ButtonGestion } from "./ButtonGestion";
import { SortableColumnHeader } from "@/ui";
import { DeleteModal } from "../modal/DeleteModal";
import { iconMap } from "@/utils";
import { ButtonOfferings, Gender, ICourseSeason } from "@/modules/course-seasons";

interface Props {
  courseSeasons: ICourseSeason[];
  urlBase: string;
}

export const TableCourseSeasons = ({ courseSeasons, urlBase }: Props) => {
  const [isClient, setIsClient] = useState(false);

  // Evitamos la hidratación fallida
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // O un esqueleto de carga (Skeleton)
  }

  const genderMap: Record<Gender, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
    MIXED: "Mixto",
  };

  const genderClassMap: Record<Gender, string> = {
    MALE: "bg-blue-400 text-blue-50",
    FEMALE: "bg-pink-400 text-pink-50",
    MIXED: "bg-orange-400 text-orange-50",
  };

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

            <Table.Column allowsSorting id="categoryName">
              <SortableColumnHeader id="categoryName">
                CATEGORÍA
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="gender">
              GÉNERO
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
          <Table.Body>
            {courseSeasons.map((courseSeason) => (
              <Table.Row key={courseSeason.id} id={courseSeason.id}>
                {/* <Table.Cell>{category.id}</Table.Cell> */}
                <Table.Cell>{courseSeason.season.name}</Table.Cell>
                <Table.Cell>
                  {courseSeason.season.startDate.toLocaleDateString("es-BO", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Table.Cell>
                <Table.Cell>
                  {courseSeason.season.endDate.toLocaleDateString("es-BO", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Table.Cell>
                <Table.Cell>{courseSeason.category.name}</Table.Cell>
                <Table.Cell>
                  <Chip size="sm" className={genderClassMap[courseSeason.gender]}>
                    {genderMap[courseSeason.gender]}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  {courseSeason.createdAt.toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {courseSeason.updatedAt.toLocaleDateString()}
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center justify-center gap-1">
                    <ButtonOfferings
                      urlBase={urlBase}
                      courseSeasonId={courseSeason.id}
                    />
                    {/* <ButtonGestion
                      id={category.id}
                      schoolId={category.discipline.id}
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
