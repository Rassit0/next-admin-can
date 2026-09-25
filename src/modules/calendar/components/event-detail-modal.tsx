"use client";

import { useState } from "react";
import { Button, Modal } from "@heroui/react";
import { toast } from "sonner";
import { deleteMatch } from "../actions/delete-match.action";
import { EventApi } from "@fullcalendar/core";
import {
  ISessionCalendarMetadata,
  IMatchCalendarMetadata,
  IGeneralEventCalendarMetadata,
} from "../interfaces/calendar.interface";
import { SessionAttendanceDrawer } from "../../attendance/components/SessionAttendanceDrawer";
import { MatchCallUpsDrawer } from "./match-call-ups-drawer";
import { MatchLineupsDrawer } from "./match-lineups-drawer";
import { Select, ListBox, Label } from "@heroui/react";
import { deleteSession } from "../actions/delete-session.action";
import { deleteGeneralEvent } from "../actions/delete-general-event.action";
import {
  completeMatch,
  cancelMatch,
  reopenMatch,
  restoreMatch,
} from "../actions/match-lifecycle.actions";

interface Props {
  state: {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    close: () => void;
  };
  event: EventApi | null;
  onEditMatch?: () => void;
  onEditSession?: () => void;
  onEditGeneralEvent?: () => void;
  onDeleteSuccess?: () => void;
}

export const EventDetailModal = ({
  state,
  event,
  onEditMatch,
  onDeleteSuccess,
  onEditSession,
  onEditGeneralEvent,
}: Props) => {
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isCallUpsOpen, setIsCallUpsOpen] = useState(false);
  const [isLineupsOpen, setIsLineupsOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteScope, setDeleteScope] = useState<
    "single" | "following" | "all"
  >("single");

  const [confirmAction, setConfirmAction] = useState<
    "COMPLETE" | "CANCEL" | "REOPEN" | "RESTORE" | null
  >(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!event) return null;

  // Reset confirmation state when modal opens/closes
  if (!state.isOpen && confirmDelete) {
    setConfirmDelete(false);
  }
  if (!state.isOpen && confirmAction) {
    setConfirmAction(null);
  }

  const type = event.extendedProps.type;
  const metadata = event.extendedProps.metadata;
  const location = event.extendedProps.location;

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={state.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDelete(false);
            setConfirmAction(null);
          }
          state.setOpen(open);
        }}
      >
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Detalle del Evento</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-0 md:p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold">{event.title}</h3>
                  <p className="text-sm text-default-500">
                    {event.start?.toLocaleString()} -{" "}
                    {event.end?.toLocaleString()}
                  </p>
                </div>

                <div className="text-sm">
                  <strong>Tipo:</strong> {type} <br />
                  <strong>Ubicación:</strong>{" "}
                  {location ? location.name : "Por definir"} <br />
                  <strong>Estado:</strong> {event.extendedProps.status} <br />
                  {event.extendedProps.series && (
                    <span className="text-primary-500 mt-1 inline-block">
                      Serie Recurrente
                    </span>
                  )}
                </div>

                <div className="bg-default-100 p-3 rounded-md text-sm">
                  {type === "SESSION" && (
                    <>
                      <strong>Duración:</strong>{" "}
                      {(metadata as ISessionCalendarMetadata).durationMin} min{" "}
                      <br />
                      <strong>Equipos:</strong>{" "}
                      {(metadata as ISessionCalendarMetadata).teams
                        ?.map((t) => t.name)
                        .join(", ") || "N/A"}{" "}
                      <br />
                      <strong>Cursos:</strong>{" "}
                      {(metadata as ISessionCalendarMetadata).courses
                        ?.map((c) => c.name)
                        .join(", ") || "N/A"}
                    </>
                  )}
                  {type === "MATCH" && (
                    <>
                      <strong>Tipo de Partido:</strong>{" "}
                      {(metadata as IMatchCalendarMetadata).matchType} <br />
                      <strong>Partido:</strong>{" "}
                      {(metadata as IMatchCalendarMetadata).homeTeam?.name ||
                        "N/A"}{" "}
                      vs{" "}
                      {(metadata as IMatchCalendarMetadata).awayTeam?.name ||
                        "N/A"}{" "}
                      <br />
                      <strong>Marcador:</strong>{" "}
                      {(metadata as IMatchCalendarMetadata).homeScore ?? "-"} -{" "}
                      {(metadata as IMatchCalendarMetadata).awayScore ?? "-"}{" "}
                      <br />
                      <strong>Resultado CAN:</strong>{" "}
                      {(metadata as IMatchCalendarMetadata).result} <br />
                      <strong>Categorí­a:</strong>{" "}
                      {(metadata as IMatchCalendarMetadata).homeCategory?.id ===
                      (metadata as IMatchCalendarMetadata).awayCategory?.id
                        ? (metadata as IMatchCalendarMetadata).homeCategory
                            ?.name || "N/A"
                        : `${(metadata as IMatchCalendarMetadata).homeCategory?.name || "N/A"} (L) vs ${(metadata as IMatchCalendarMetadata).awayCategory?.name || "N/A"} (V)`}
                    </>
                  )}
                  {type === "GENERAL" && (
                    <>
                      <strong>Institución:</strong>{" "}
                      {(metadata as IGeneralEventCalendarMetadata)
                        .institutionId || "N/A"}
                    </>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="flex-wrap">
              {type === "MATCH" && !confirmDelete && !confirmAction && (
                <>
                  <Button
                    variant="danger-soft"
                    onPress={() => setConfirmDelete(true)}
                    isDisabled={isTransitioning}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="secondary"
                    onPress={onEditMatch}
                    isDisabled={isTransitioning}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="primary"
                    onPress={() => setIsCallUpsOpen(true)}
                    isDisabled={isTransitioning}
                  >
                    Convocados
                  </Button>
                  <Button
                    variant="primary"
                    onPress={() => setIsLineupsOpen(true)}
                    isDisabled={isTransitioning}
                  >
                    Plantilla
                  </Button>

                  {event.extendedProps.status === "SCHEDULED" && (
                    <>
                      <Button
                        variant="primary"
                        onPress={() => setConfirmAction("COMPLETE")}
                        isDisabled={isTransitioning}
                      >
                        Completar
                      </Button>
                      <Button
                        variant="danger-soft"
                        onPress={() => setConfirmAction("CANCEL")}
                        isDisabled={isTransitioning}
                      >
                        Cancelar Partido
                      </Button>
                    </>
                  )}
                  {event.extendedProps.status === "COMPLETED" && (
                    <Button
                      variant="secondary"
                      onPress={() => setConfirmAction("REOPEN")}
                      isDisabled={isTransitioning}
                    >
                      Reabrir
                    </Button>
                  )}
                  {event.extendedProps.status === "CANCELLED" && (
                    <Button
                      variant="secondary"
                      onPress={() => setConfirmAction("RESTORE")}
                      isDisabled={isTransitioning}
                    >
                      Restaurar
                    </Button>
                  )}
                </>
              )}
              {type === "SESSION" && !confirmDelete && !confirmAction && (
                <>
                  <Button
                    variant="danger-soft"
                    onPress={() => setConfirmDelete(true)}
                    isDisabled={isTransitioning}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="secondary"
                    onPress={onEditSession}
                    isDisabled={isTransitioning}
                  >
                    Editar
                  </Button>
                </>
              )}
              {type === "GENERAL" && !confirmDelete && !confirmAction && (
                <>
                  <Button
                    variant="danger-soft"
                    onPress={() => setConfirmDelete(true)}
                    isDisabled={isTransitioning}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="secondary"
                    onPress={onEditGeneralEvent}
                    isDisabled={isTransitioning}
                  >
                    Editar
                  </Button>
                </>
              )}
              {confirmDelete && (
                <div className="flex flex-col gap-3 w-full">
                  {(type === "SESSION" || type === "GENERAL") &&
                    event.extendedProps.series?.id && (
                      <div className="bg-warning/10 p-3 rounded-lg flex flex-col gap-2">
                        <p className="text-sm text-warning font-semibold">
                          {type === "SESSION"
                            ? "Esta sesión pertenece a una serie recurrente."
                            : "Este evento pertenece a una serie recurrente."}
                        </p>
                        <Select
                          variant="secondary"
                          selectedKey={deleteScope}
                          onSelectionChange={(k) =>
                            setDeleteScope(k as "single" | "following" | "all")
                          }
                        >
                          <Label className="text-sm">
                            ÃÂ¿Qué deseas eliminar?
                          </Label>
                          <Select.Trigger />
                          <Select.Popover>
                            <ListBox>
                              <ListBox.Item
                                id="single"
                                textValue={
                                  type === "SESSION"
                                    ? "Solo esta sesión"
                                    : "Solo este evento"
                                }
                              >
                                {type === "SESSION"
                                  ? "Solo esta sesión"
                                  : "Solo este evento"}
                              </ListBox.Item>
                              <ListBox.Item
                                id="following"
                                textValue="Esta y las siguientes"
                              >
                                Esta y las siguientes
                              </ListBox.Item>
                              <ListBox.Item id="all" textValue="Toda la serie">
                                Toda la serie
                              </ListBox.Item>
                            </ListBox>
                          </Select.Popover>
                        </Select>
                      </div>
                    )}
                  <div className="flex items-center gap-2 justify-end w-full">
                    <span className="text-sm text-danger font-semibold">
                      ÃÂ¿Seguro que deseas eliminar?
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => setConfirmDelete(false)}
                      isDisabled={isDeleting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      isPending={isDeleting}
                      onPress={async () => {
                        setIsDeleting(true);
                        let res;
                        if (type === "MATCH") {
                          res = await deleteMatch(event.id);
                        } else if (type === "SESSION") {
                          res = await deleteSession(
                            event.id,
                            event.extendedProps.series?.id
                              ? deleteScope
                              : "single",
                          );
                        } else if (type === "GENERAL") {
                          res = await deleteGeneralEvent(
                            event.id,
                            event.extendedProps.series?.id
                              ? deleteScope
                              : "single",
                          );
                        }
                        setIsDeleting(false);
                        if (res && res.error) {
                          toast.error(res.message);
                        } else if (res && !res.error) {
                          toast.success(
                            type === "MATCH"
                              ? "Partido eliminado con éxito"
                              : type === "SESSION"
                                ? "Sesión eliminada con éxito"
                                : "Evento eliminado con éxito",
                          );
                          setConfirmDelete(false);
                          state.setOpen(false);
                          if (onDeleteSuccess) onDeleteSuccess();
                        }
                      }}
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              )}
              {confirmAction && (
                <div className="flex flex-col gap-3 w-full">
                  <div className="bg-warning/10 p-3 rounded-lg flex flex-col gap-2">
                    <p className="text-sm text-warning font-semibold">
                      {confirmAction === "COMPLETE" &&
                        "Al completar el partido se bloquearán el resultado, la convocatoria y la planilla. Podrás corregirlo posteriormente reabriendo el partido. ÃÂ¿Deseas continuar?"}
                      {confirmAction === "CANCEL" &&
                        "El partido quedará cancelado y en modo solo lectura. Podrás restaurarlo posteriormente. ÃÂ¿Deseas continuar?"}
                      {confirmAction === "REOPEN" &&
                        "El partido volverá a estar programado y podrá editarse nuevamente. ÃÂ¿Deseas continuar?"}
                      {confirmAction === "RESTORE" &&
                        "El partido volverá a estar programado y podrá editarse nuevamente. ÃÂ¿Deseas continuar?"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 justify-end w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => setConfirmAction(null)}
                      isDisabled={isTransitioning}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      isPending={isTransitioning}
                      onPress={async () => {
                        setIsTransitioning(true);
                        let res;
                        if (confirmAction === "COMPLETE") {
                          res = await completeMatch(event.id);
                        } else if (confirmAction === "CANCEL") {
                          res = await cancelMatch(event.id);
                        } else if (confirmAction === "REOPEN") {
                          res = await reopenMatch(event.id);
                        } else if (confirmAction === "RESTORE") {
                          res = await restoreMatch(event.id);
                        }
                        setIsTransitioning(false);

                        if (res && res.error) {
                          toast.error(res.message);
                        } else if (res && !res.error) {
                          toast.success(res.message);
                          setConfirmAction(null);
                          state.setOpen(false);
                          if (onDeleteSuccess) onDeleteSuccess(); // We can reuse onDeleteSuccess to refresh calendar/data if needed
                        }
                      }}
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              )}
              {type === "SESSION" &&
                (metadata as ISessionCalendarMetadata).courses?.length > 0 &&
                !confirmAction &&
                !confirmDelete && (
                  <Button
                    variant="primary"
                    onPress={() => setIsAttendanceOpen(true)}
                  >
                    Asistencia
                  </Button>
                )}
              <Button
                variant="danger-soft"
                onPress={() => state.setOpen(false)}
                isDisabled={isTransitioning}
              >
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      {type === "SESSION" &&
        (metadata as ISessionCalendarMetadata).courses?.length > 0 &&
        event.start && (
          <SessionAttendanceDrawer
            isOpen={isAttendanceOpen}
            onOpenChange={setIsAttendanceOpen}
            sessionId={event.id}
            courseSeasonId={
              (metadata as ISessionCalendarMetadata).courses[0].id
            }
            sessionStartDate={event.start.toISOString()}
          />
        )}

      {type === "MATCH" && event.start && (
        <>
          <MatchCallUpsDrawer
            isOpen={isCallUpsOpen}
            onOpenChange={setIsCallUpsOpen}
            matchId={event.id}
            metadata={metadata as IMatchCalendarMetadata}
            startDate={event.start.toISOString()}
            status={event.extendedProps.status}
          />
          <MatchLineupsDrawer
            isOpen={isLineupsOpen}
            onOpenChange={setIsLineupsOpen}
            matchId={event.id}
            metadata={metadata as IMatchCalendarMetadata}
            startDate={event.start.toISOString()}
            status={event.extendedProps.status}
          />
        </>
      )}
    </Modal>
  );
};
