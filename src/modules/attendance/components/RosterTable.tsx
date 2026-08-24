"use client";

import { Table, Button, Chip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { IStudentMembership } from "@/modules/student-memberships";
import { ISessionBooking } from "@/modules/attendance/types";
import { useState } from "react";
import { createSessionBooking } from "../actions/create-session-booking";
import { deleteSessionBooking } from "../actions/delete-session-booking";
import { toast } from "sonner";

interface Props {
  sessionId: string;
  roster: IStudentMembership[];
  bookings: ISessionBooking[];
  onBookingsChange: () => void;
}

export const RosterTable = ({
  sessionId,
  roster,
  bookings,
  onBookingsChange,
}: Props) => {
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const handleCheckIn = async (studentId: string) => {
    setLoadingIds((prev) => [...prev, studentId]);
    try {
      const res = await createSessionBooking(sessionId, studentId);
      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        onBookingsChange();
      }
    } catch {
      toast.error("Ocurrió un error inesperado al registrar la asistencia.");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleDelete = async (bookingId: string, studentId: string) => {
    setLoadingIds((prev) => [...prev, studentId]);
    try {
      const res = await deleteSessionBooking(bookingId);
      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        onBookingsChange();
      }
    } catch {
      toast.error("Ocurrió un error inesperado al eliminar la asistencia.");
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== studentId));
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table aria-label="Roster de la sesión" className="w-full shadow-none border-t border-border">
        <Table.Header>
          <Table.Column>
            <span className="text-xs font-semibold uppercase tracking-wide">
              Estudiante
            </span>
          </Table.Column>
          <Table.Column>
            <span className="text-xs font-semibold uppercase tracking-wide">
              Ciclo
            </span>
          </Table.Column>
          <Table.Column className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wide">
              Asistencia
            </span>
          </Table.Column>
        </Table.Header>
        <Table.Body
          renderEmptyState={() => (
            <div className="py-10 text-center text-sm text-muted">
              No hay estudiantes inscritos para esta sesión.
            </div>
          )}
        >
          {roster.map((membership) => {
            const person = membership.student?.person;
            const cycle = membership.cycleEnrollments?.[0];
            const studentId = membership.studentId;
            const existingBooking = bookings.find(
              (b) => b.studentId === studentId
            );
            
            const isLoading = loadingIds.includes(studentId);
            const isConfirmed = cycle?.status === "CONFIRMED";
            const isPending = cycle?.status === "PENDING";

            return (
              <Table.Row
                key={membership.id}
                className="border-b border-border last:border-b-0 hover:bg-surface-secondary/40"
              >
                <Table.Cell className="py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">
                      {person?.name} {person?.lastName} {person?.secondLastName}
                    </span>
                  </div>
                </Table.Cell>

                <Table.Cell className="py-4">
                  {isConfirmed ? (
                    <Chip color="success" variant="soft" size="sm">
                      CONFIRMADO
                    </Chip>
                  ) : isPending ? (
                    <Chip color="warning" variant="soft" size="sm">
                      PENDIENTE DE PAGO
                    </Chip>
                  ) : (
                    <Chip color="danger" variant="soft" size="sm">
                      SIN CICLO VIGENTE
                    </Chip>
                  )}
                </Table.Cell>

                <Table.Cell className="py-4 text-center">
                  <div className="flex justify-center items-center gap-2">
                    {existingBooking ? (
                      <>
                        <Chip
                          color="success"
                          variant="soft"
                        >
                          <div className="flex items-center gap-1">
                            <HugeiconsIcon icon={CheckmarkBadge01Icon} size={16} />
                            Asistencia Registrada
                          </div>
                        </Chip>
                        <Button
                          isIconOnly
                          variant="danger-soft"
                          size="sm"
                          isDisabled={isLoading}
                          onPress={() => handleDelete(existingBooking.id, studentId)}
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={18} />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant={isConfirmed ? "primary" : "outline"}
                        size="sm"
                        isDisabled={!isConfirmed || isLoading}
                        onPress={() => handleCheckIn(studentId)}
                      >
                        {isLoading ? "Cargando..." : (isPending ? "Pendiente" : !isConfirmed ? "Sin Ciclo" : "Registrar Asistencia")}
                      </Button>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};
