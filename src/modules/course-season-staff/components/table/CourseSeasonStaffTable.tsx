"use client";
import { Avatar, Table, Button, toast, Popover } from "@heroui/react";
import { useEffect, useState } from "react";
import { SortableColumnHeader } from "@/ui";
import { ICourseSeason } from "@/modules/course-seasons";
import {
  ICourseSeasonStaff,
  removeCourseSeasonStaff,
} from "@/modules/course-season-staff";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";

interface Props {
  staffList: ICourseSeasonStaff[];
  courseSeason: ICourseSeason;
}

const formatRole = (role: string, customRole?: string | null) => {
  const roles: Record<string, string> = {
    HEAD_COACH: "Profesor Principal",
    ASSISTANT_COACH: "Profesor Asistente",
    ASSISTANT: "Auxiliar / Asistente",
    DELEGATE: "Delegado",
    VOLUNTEER: "Voluntario",
    OTHER: customRole || "Otro",
  };
  return roles[role] || role;
};

const initials = (name: string, lastName: string) =>
  `${name?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

export const CourseSeasonStaffTable = ({ staffList, courseSeason }: Props) => {
  const [isClient, setIsClient] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRemove = async (id: string) => {
    if (!confirm("¿Está seguro de remover a este profesor/personal?")) return;

    setLoadingId(id);
    const res = await removeCourseSeasonStaff(id);
    setLoadingId(null);

    if (res.error) {
      toast.danger("Error", { description: res.message });
      return;
    }
    toast.success("Personal removido", { description: res.message });
  };

  if (!isClient) {
    return null;
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Personal del curso" className="min-w-200">
          <Table.Header className="bg-surface-secondary">
            <Table.Column isRowHeader allowsSorting id="name">
              <SortableColumnHeader id="name">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Profesor / Personal
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column id="document">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Documento
              </span>
            </Table.Column>
            <Table.Column allowsSorting id="role">
              <SortableColumnHeader id="role">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Rol
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="startedAt">
              <SortableColumnHeader id="startedAt">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Fecha de Inicio
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Acciones
              </span>
            </Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <div className="py-10 text-center text-sm text-muted">
                Aún no hay personal asignado a esta temporada.
              </div>
            )}
          >
            {staffList.map((item) => {
              const person = item.staff?.person;
              if (!person) return null;

              return (
                <Table.Row
                  key={item.id}
                  id={item.id}
                  className="hover:bg-surface-secondary/50 border-b border-border/50 transition-colors"
                >
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        size="sm"
                        className="shrink-0 bg-primary/10 text-primary"
                      >
                        <Avatar.Image alt={person.name} src={undefined} />
                        <Avatar.Fallback>
                          {initials(person.name, person.lastName)}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {person.name} {person.lastName}{" "}
                          {person.secondLastName || ""}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {person.email || "Sin correo"}
                          </span>
                          {item.isPrimary && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              Principal
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-muted-foreground">
                      {person.documentType} {person.documentNumber || "N/A"}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm font-medium text-foreground">
                      {formatRole(item.role, item.customRole)}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm font-medium text-foreground">
                      {new Date(item.startedAt).toLocaleDateString()}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        isIconOnly
                        variant="danger-soft"
                        size="sm"
                        onPress={() => handleRemove(item.id)}
                        isPending={loadingId === item.id}
                        aria-label="Remover personal"
                      >
                        <HugeiconsIcon icon={Delete01Icon} size={16} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
