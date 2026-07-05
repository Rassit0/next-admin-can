"use client";

import { Table, Avatar } from "@heroui/react";
import { motion } from "framer-motion";
import { SortableColumnHeader } from "@/ui";
import { HugeiconsIcon } from "@hugeicons/react";
import { IMemberTeamSeasonAssignment } from "@/modules/membresias/types";
import { ASSIGNMENT_STATUS_CONFIG } from "@/modules/membresias/constants/status";
import { AssignmentActions } from "./AssignmentActions";

interface AssignmentTableProps {
  assignments: IMemberTeamSeasonAssignment[];
  isLoading?: boolean;
  onStatusChange?: () => void;
}

const initials = (firstName: string, lastName: string) =>
  `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

const formatCurrency = (amount: number, currency: string = "BOB") =>
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency,
  }).format(amount);

const formatDate = (date: Date | null | undefined) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-BO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const AssignmentTable = ({
  assignments,
  isLoading,
  onStatusChange,
}: AssignmentTableProps) => {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Asignaciones de miembros a temporadas"
          className="min-w-200"
        >
          <Table.Header className="bg-surface-secondary">
            <Table.Column isRowHeader allowsSorting id="member">
              <SortableColumnHeader id="member">
                <span className="text-xs font-semibold uppercase tracking-wide">Miembro</span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="enrolledAt">
              <SortableColumnHeader id="enrolledAt">
                <span className="text-xs font-semibold uppercase tracking-wide">Inscrito</span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column id="charges" className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wide">Cargos Iniciales</span>
            </Table.Column>
            <Table.Column allowsSorting id="status">
              <SortableColumnHeader id="status">
                <span className="text-xs font-semibold uppercase tracking-wide">Estado</span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wide">Acciones</span>
            </Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <div className="py-10 text-center text-sm text-muted">
                No hay asignaciones para esta temporada aún.
              </div>
            )}
          >
            {assignments.map((assignment, idx) => {
              const person = assignment.member?.person;
              const statusConfig = ASSIGNMENT_STATUS_CONFIG[assignment.status];

              return (
                <motion.tr
                  key={assignment.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: idx * 0.05,
                  }}
                  className="border-b border-border hover:bg-surface-secondary/40"
                >
                  <Table.Cell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <Avatar.Image
                          alt={person?.name ?? "Miembro"}
                          src={person?.imageUrl ?? undefined}
                          loading="lazy"
                        />
                        <Avatar.Fallback className="bg-accent/10 text-accent">
                          {person
                            ? initials(person.name, person.lastName)
                            : "MB"}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-foreground truncate">
                          {person ? `${person.name} ${person.lastName}` : "Miembro"}
                        </span>
                        {person?.documentNumber && (
                          <span className="text-xs text-muted truncate">
                            {person.documentType} {person.documentNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-sm">
                    {formatDate(assignment.enrolledAt)}
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right">
                    <span className="font-semibold tabular-nums text-accent">
                      {formatCurrency(assignment.totalInitialCharges)}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <div title={`${statusConfig.label} desde ${formatDate(
                        assignment[
                          {
                            active: "enrolledAt",
                            suspended: "suspendedAt",
                            completed: "completedAt",
                            withdrawn: "withdrawnAt",
                          }[assignment.status] as keyof IMemberTeamSeasonAssignment
                        ] as Date
                      )}`} className={`flex w-fit items-center gap-1.5 rounded-lg ${statusConfig.bgColor} px-2.5 py-1.5`}>
                        <HugeiconsIcon
                          icon={statusConfig.icon}
                          size={14}
                          className={statusConfig.textColor}
                        />
                        <span className={`text-xs font-semibold ${statusConfig.textColor}`}>
                          {statusConfig.label}
                        </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <div className="flex items-center justify-center">
                      <AssignmentActions
                        assignment={assignment}
                        onStatusChange={onStatusChange}
                      />
                    </div>
                  </Table.Cell>
                </motion.tr>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
