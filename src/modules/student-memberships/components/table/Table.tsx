"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Avatar, Table } from "@heroui/react";
import { useEffect, useState } from "react";
import { SortableColumnHeader } from "@/ui";
import { ICourseSeason } from "@/modules/course-seasons";
import { IStudentMembership } from "@/modules/student-memberships";
import { StatusChip } from "@/modules/student-memberships/components/status/StatusChip";
import { MembershipActions } from "@/modules/student-memberships/components/actions/MembershipActions";
import {
  formatCurrency,
} from "@/modules/student-memberships/helpers/initial-charges";

interface Props {
  memberships: IStudentMembership[];
  courseSeason?: ICourseSeason;
  showCourseSeasonDetail?: boolean;
  showStudentDetail?: boolean;
  origin?: string;
}

const initials = (name: string, lastName: string) =>
  `${name?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

export const TableMemberships = ({
  memberships,
  courseSeason,
  showCourseSeasonDetail = true,
  showStudentDetail = true,
  origin,
}: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Membresías de estudiantes" className="min-w-200">
          <Table.Header className="bg-surface-secondary">
            {showStudentDetail && (
              <Table.Column isRowHeader allowsSorting id="name">
                <SortableColumnHeader id="name">
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Estudiante
                  </span>
                </SortableColumnHeader>
              </Table.Column>
            )}
            {showCourseSeasonDetail && (
              <Table.Column allowsSorting id="courseSeason">
                <SortableColumnHeader id="courseSeason">
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Curso / Categoría
                  </span>
                </SortableColumnHeader>
              </Table.Column>
            )}
            <Table.Column allowsSorting id="paymentPlan">
              <SortableColumnHeader id="paymentPlan">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Plan de Pago
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column id="totalPendingAmount" className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Pendiente
              </span>
            </Table.Column>
            <Table.Column id="totalPaidAmount" className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Pagado
              </span>
            </Table.Column>
            <Table.Column allowsSorting id="startedAt">
              <SortableColumnHeader id="startedAt">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Inicio
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="status">
              <SortableColumnHeader id="status">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Estado
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
                Aún no hay estudiantes inscritos en esta temporada.
              </div>
            )}
          >
            {memberships.map((membership) => {
              const person = membership.student?.person;
              return (
                <Table.Row
                  key={membership.id}
                  id={membership.id}
                  className="border-b border-border last:border-b-0 hover:bg-surface-secondary/40"
                >
                  {showStudentDetail && (
                    <Table.Cell className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <Avatar.Image
                            alt={person?.name ?? "Estudiante"}
                            src={person?.imageUrl ?? undefined}
                            loading="lazy"
                          />
                          <Avatar.Fallback className="bg-accent-soft text-accent">
                            {person
                              ? initials(person.name, person.lastName)
                              : "ES"}
                          </Avatar.Fallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-foreground truncate">
                            {person
                              ? [person.lastName, person.secondLastName, person.name].filter(Boolean).join(" ")
                              : "Estudiante"}
                          </span>
                          {person ? (
                            <span className="text-xs text-muted truncate">
                              {person.documentType} {person.documentNumber}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </Table.Cell>
                  )}
                  {showCourseSeasonDetail && (
                    <Table.Cell className="py-3">
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-foreground truncate">
                          {courseSeason?.course?.name ?? "—"}
                        </span>
                        <span className="text-xs text-muted truncate">
                          {Array.from(new Set(courseSeason?.shifts?.map((s) => s.category?.name).filter(Boolean))).join(' · ') || "—"} •{" "}
                          {courseSeason?.season?.name ?? "—"}
                        </span>
                      </div>
                    </Table.Cell>
                  )}
                  <Table.Cell className="py-3">
                    <span className="font-medium text-foreground">
                      {membership.paymentPlan?.name ?? "—"}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right">
                    <span className="font-semibold tabular-nums text-warning">
                      {formatCurrency(membership.totalPendingAmount, "BOB")}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right">
                    <span className="font-semibold tabular-nums text-success">
                      {formatCurrency(membership.totalPaidAmount, "BOB")}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-sm">
                    {membership.startedAt.toLocaleDateString("es-BO")}
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <StatusChip status={membership.status} />
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <div className="flex items-center justify-center">
                      <MembershipActions
                        membership={membership}
                        origin={origin}
                      />
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
