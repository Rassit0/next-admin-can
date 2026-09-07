"use client";
import React, { useEffect, useState } from "react";
import { Drawer, Spinner } from "@heroui/react";
import { IPersonOption } from "@/common/actions/get-persons-options";
import { getPersonMembershipHistory } from "../../actions/get-person-membership-history";
import { IMembershipHistoryItem } from "../../interfaces/membership-history.interface";
import {
  StatusChip as PlayerStatusChip,
  PlayerMembershipStatus,
} from "@/modules/player-memberships";
import {
  StatusChip as StudentStatusChip,
  StudentMembershipStatus,
} from "@/modules/student-memberships";
import { ParticipationChip } from "@/modules/student-memberships/components/status/ParticipationChip";
import { formatCurrency } from "@/utils";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  person: IPersonOption | null;
  playerId?: string;
  studentId?: string;
}

export const MembershipHistoryDrawer = ({
  isOpen,
  onOpenChange,
  person,
  playerId,
  studentId,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<IMembershipHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && person?.id) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [isOpen, person?.id, playerId, studentId]);

  const fetchHistory = async () => {
    if (!person?.id) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await getPersonMembershipHistory({
        personId: person.id,
        playerId,
        studentId,
      });

      if (res.error) {
        setError(res.message);
      } else {
        setHistory(res.data || []);
      }
    } catch (err) {
      setError("Ocurri� un error al cargar el Historial de Membresías.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      // Usamos getUTC* methods para no tener desplazamiento de d�a por zona horaria local
      const d = new Date(dateString);
      return `${d.getUTCDate().toString().padStart(2, "0")}/${(d.getUTCMonth() + 1).toString().padStart(2, "0")}/${d.getUTCFullYear()}`;
    } catch {
      return dateString;
    }
  };

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog
          aria-label="Historial de Membresías"
          className="w-full sm:max-w-md overflow-y-hidden flex flex-col h-full bg-surface"
        >
          <Drawer.CloseTrigger />
          <Drawer.Header className="border-b border-border shrink-0">
            <Drawer.Heading className="text-xl font-bold flex items-center gap-2">
              <i className="ri-history-line text-default-500"></i> Historial de
              Membresías
            </Drawer.Heading>
            <p className="text-sm text-default-500">
              Mostrando el historial completo de{" "}
              <span className="font-semibold text-foreground">
                {person?.fullName}
              </span>
            </p>
          </Drawer.Header>

          <Drawer.Body className="p-0 flex-1 overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col h-full bg-surface-secondary/20 p-4 overflow-y-auto">
              {isLoading && history.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 py-12">
                  <Spinner size="lg" />
                  <p className="mt-4 text-default-500">Cargando historial...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center flex-1 text-danger py-12">
                  <i className="ri-error-warning-line text-4xl mb-2"></i>
                  <p>{error}</p>
                </div>
              ) : history.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 py-12 text-default-500">
                  <i className="ri-inbox-line text-4xl mb-2"></i>
                  <p>Sin Historial de Membresías</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-2 relative shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-sm font-semibold text-default-600 mb-1">
                          {item.type === "team" ? (
                            <>
                              <i className="ri-trophy-line text-primary"></i>{" "}
                              Equipo
                            </>
                          ) : (
                            <>
                              <i className="ri-graduation-cap-line text-secondary"></i>{" "}
                              Curso
                            </>
                          )}
                        </div>
                        {item.type === "team" ? (
                          <div className="flex flex-col items-end gap-1">
                            <PlayerStatusChip
                              status={item.status as PlayerMembershipStatus}
                            />
                            {item.status !== "CANCELLED" &&
                              item.status !== "WITHDRAWN" &&
                              item.totalPendingAmount !== undefined &&
                              (item.totalPendingAmount > 0 ? (
                                <div className="text-[10px] font-medium bg-warning-50 text-warning-600 px-1.5 py-0.5 rounded border border-warning-200">
                                  Deuda:{" "}
                                  {formatCurrency(item.totalPendingAmount)}
                                </div>
                              ) : (
                                <div className="text-[10px] font-medium bg-success-50 text-success-600 px-1.5 py-0.5 rounded border border-success-200">
                                  Al día
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-end gap-1">
                            <StudentStatusChip
                              status={item.status as StudentMembershipStatus}
                            />
                            {item.cycleEnrollments &&
                              item.status !== "CANCELLED" &&
                              item.status !== "WITHDRAWN" && (
                                <ParticipationChip
                                  membership={item as any}
                                  size="sm"
                                />
                              )}
                          </div>
                        )}
                      </div>

                      {item.type === "team" ? (
                        <>
                          {item.teamName && (
                            <p className="font-semibold text-foreground">
                              {item.teamName}
                            </p>
                          )}
                          {item.seasonName && (
                            <p className="text-sm text-default-600">
                              {item.seasonName}
                            </p>
                          )}
                          {item.categoryName && (
                            <p className="text-sm text-default-500">
                              Categoría {item.categoryName}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          {item.courseName && (
                            <p className="font-semibold text-foreground">
                              {item.courseName}
                            </p>
                          )}
                          {item.seasonName && (
                            <p className="text-sm text-default-600">
                              {item.seasonName}
                            </p>
                          )}
                          {item.shiftName && (
                            <p className="text-sm text-default-500">
                              Turno: {item.shiftName}
                            </p>
                          )}
                        </>
                      )}

                      <div className="mt-2 text-xs text-default-500 flex flex-col gap-1 border-t border-border pt-2">
                        {item.startedAt && (
                          <p>Inicio: {formatDate(item.startedAt)}</p>
                        )}
                        {item.endedAt && <p>Fin: {formatDate(item.endedAt)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
