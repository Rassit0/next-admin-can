"use client";
import {
  Avatar,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  Table,
} from "@heroui/react";
import {
  CheckmarkCircle01Icon,
  ChevronUp,
  Copy01Icon,
  Delete01Icon,
  Edit03Icon,
  EyeIcon,
  UserAdd02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { ButtonGestion } from "./ButtonGestion";
import { EditModal } from "../modal/EditModal";
import { SortableColumnHeader } from "@/ui";
import { DeleteModal } from "../modal/DeleteModal";
import {
  ActivityStatus,
  ActivityType,
  ButtonEdit,
  colorBgTextStatusActivity,
  IActivity,
  textStatusActivity,
} from "@/modules/activities";
import { formatCurrency, iconBgColorMap, iconColorMap, iconMap } from "@/utils";

interface Props {
  activities: IActivity[];
}

const typeMap: Record<ActivityType, string> = {
  TRAINING: "Entrenamiento",
  MATCH: "Partido",
  EDUCATIONAL: "Educativo",
  EVENT: "Evento",
  TEAM: "Equipo",
};

export const TableActivities = ({ activities }: Props) => {
  const [isClient, setIsClient] = useState(false);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string;
    direction: "ascending" | "descending";
  }>({
    column: "id",
    direction: "ascending",
  });

  // Evitamos la hidratación fallida
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // O un esqueleto de carga (Skeleton)
  }

  const statusColorMap: Record<
    ActivityStatus,
    "success" | "danger" | "accent" | "warning"
  > = {
    DRAFT: "warning",
    PUBLISHED: "accent",
    FINISHED: "success",
    CANCELLED: "danger",
  };

  return (
    <Table variant="secondary">
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
              id="name"
            >
              <SortableColumnHeader id="name">
                NOMBRE DE ACTIVIDAD
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="type">
              <SortableColumnHeader id="type">TIPO</SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="category">
              <SortableColumnHeader id="category">
                CATEGORÍA
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="description">
              <SortableColumnHeader id="description">
                VIGENCIA
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="registrationFee">
              <SortableColumnHeader id="registrationFee">
                MATRÍCULA
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="monthlyPrice">
              <SortableColumnHeader id="monthlyPrice">
                MENSUALIDAD
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column allowsSorting id="totalPrice">
              <SortableColumnHeader id="totalPrice">
                PRECIO TOTAL
              </SortableColumnHeader>
            </Table.Column>

            <Table.Column>ESTADO</Table.Column>

            <Table.Column className="text-center">ACCIONES</Table.Column>
          </Table.Header>
          <Table.Body>
            {activities.map((activity) => (
              <Table.Row key={activity.id} id={activity.id}>
                <Table.Cell>
                  <div className="flex items-center">
                    <div
                      className={`rounded-lg ${iconBgColorMap[activity.type]} flex items-center justify-center mr-3 p-1`}
                    >
                      <HugeiconsIcon
                        icon={iconMap[activity.type]}
                        className={iconColorMap[activity.type]}
                      />
                    </div>
                    <div>
                      <div className="font-bold text-on-surface text-sm">
                        {activity.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        ID: {activity.id}
                      </div>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Chip
                    size="sm"
                    className={`${iconBgColorMap[activity.type]} ${iconColorMap[activity.type]}`}
                  >
                    {typeMap[activity.type]}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  {activity.activityCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-0.5">
                      {activity.activityCategories.map((item) => (
                        <Chip key={item.category.id}>{item.category.name}</Chip>
                      ))}
                    </div>
                  ) : (
                    "Todos"
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-col gap-1">
                    {/* Lógica de Fechas */}
                    <span className="font-medium">
                      {activity.startDate.toDateString() ===
                      activity.endDate.toDateString() ? (
                        // Si es el mismo día: Solo una fecha
                        activity.startDate.toLocaleDateString()
                      ) : (
                        // Si son días diferentes: Rango de fechas
                        <span className="text-accent">
                          {`${activity.startDate.toLocaleDateString()} - ${activity.endDate.toLocaleDateString()}`}
                        </span>
                      )}
                    </span>

                    {/* Rango de Horarios en un span aparte */}
                    <span className="text-xs text-muted-foreground bg-surface-container-low px-2 py-0.5 rounded-full w-fit">
                      {activity.startDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -
                      {activity.endDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-right font-mono font-medium">
                  {formatCurrency(
                    isNaN(+activity.registrationFee)
                      ? 0
                      : +activity.registrationFee,
                  )}
                </Table.Cell>
                <Table.Cell className="text-right font-mono font-medium">
                  {formatCurrency(
                    isNaN(+activity.monthlyPrice) ? 0 : +activity.monthlyPrice,
                  )}
                </Table.Cell>
                <Table.Cell className="text-right font-mono font-medium">
                  {formatCurrency(
                    isNaN(+activity.totalPrice) ? 0 : +activity.totalPrice,
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Chip
                    size="sm"
                    className={colorBgTextStatusActivity[activity.status]}
                  >
                    {textStatusActivity[activity.status]}
                  </Chip>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center">
                    <Button
                      isIconOnly
                      variant="ghost"
                      isDisabled={activity.status !== "PUBLISHED"}
                    >
                      <HugeiconsIcon icon={UserAdd02Icon} />
                    </Button>
                    <Button
                      isIconOnly
                      variant="ghost"
                      isDisabled={activity.status !== "PUBLISHED"}
                    >
                      <HugeiconsIcon icon={CheckmarkCircle01Icon} />
                    </Button>
                    <ButtonEdit
                      id={activity.id}
                      isDisabled={false}
                      organizationId={activity.organizationId || undefined}
                    />
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
