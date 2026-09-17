"use client";

import { useState } from "react";
import { Button, Modal } from "@heroui/react";
import { toast } from "sonner";
import { deleteMatch } from "../actions/delete-match.action";
import { EventApi } from "@fullcalendar/core";
import { ISessionCalendarMetadata, IMatchCalendarMetadata, IGeneralEventCalendarMetadata } from "../interfaces/calendar.interface";
import { SessionAttendanceDrawer } from "../../attendance/components/SessionAttendanceDrawer";
import { Select, ListBox, Label } from "@heroui/react";
import { deleteSession } from "../actions/delete-session.action";
import { deleteGeneralEvent } from "../actions/delete-general-event.action";

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

export const EventDetailModal = ({ state, event, onEditMatch, onDeleteSuccess, onEditSession, onEditGeneralEvent }: Props) => {
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteScope, setDeleteScope] = useState<"single" | "following" | "all">("single");

  if (!event) return null;

  // Reset confirmation state when modal opens/closes
  if (!state.isOpen && confirmDelete) {
    setConfirmDelete(false);
  }

  const type = event.extendedProps.type;
  const metadata = event.extendedProps.metadata;
  const location = event.extendedProps.location;

  return (
    <Modal>
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={(open) => {
        if (!open) setConfirmDelete(false);
        state.setOpen(open);
      }}>
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
                    {event.start?.toLocaleString()} - {event.end?.toLocaleString()}
                  </p>
                </div>
                
                <div className="text-sm">
                  <strong>Tipo:</strong> {type} <br/>
                  <strong>Ubicación:</strong> {location ? location.name : "Por definir"} <br/>
                  <strong>Estado:</strong> {event.extendedProps.status} <br/>
                  {event.extendedProps.series && (
                    <span className="text-primary-500 mt-1 inline-block">
                      Serie Recurrente
                    </span>
                  )}
                </div>

                <div className="bg-default-100 p-3 rounded-md text-sm">
                  {type === "SESSION" && (
                    <>
                      <strong>Duración:</strong> {(metadata as ISessionCalendarMetadata).durationMin} min <br/>
                      <strong>Equipos:</strong> {(metadata as ISessionCalendarMetadata).teams?.map(t => t.name).join(", ") || "N/A"} <br/>
                      <strong>Cursos:</strong> {(metadata as ISessionCalendarMetadata).courses?.map(c => c.name).join(", ") || "N/A"}
                    </>
                  )}
                  {type === "MATCH" && (
                    <>
                      <strong>Tipo de Partido:</strong> {(metadata as IMatchCalendarMetadata).matchType} <br/>
                      <strong>Partido:</strong> {(metadata as IMatchCalendarMetadata).homeTeam?.name || "N/A"} vs {(metadata as IMatchCalendarMetadata).awayTeam?.name || "N/A"} <br/>
                      <strong>Marcador:</strong> {(metadata as IMatchCalendarMetadata).homeScore ?? "-"} - {(metadata as IMatchCalendarMetadata).awayScore ?? "-"} <br/>
                      <strong>Resultado CAN:</strong> {(metadata as IMatchCalendarMetadata).result} <br/>
                      <strong>Categoría:</strong> {(metadata as IMatchCalendarMetadata).category?.name || "N/A"}
                    </>
                  )}
                  {type === "GENERAL" && (
                    <>
                      <strong>Institución:</strong> {(metadata as IGeneralEventCalendarMetadata).institutionId || "N/A"}
                    </>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {type === "MATCH" && !confirmDelete && (
                <>
                  <Button variant="danger-soft" onPress={() => setConfirmDelete(true)}>
                    Eliminar
                  </Button>
                  <Button variant="secondary" onPress={onEditMatch}>
                    Editar
                  </Button>
                </>
              )}
              {type === "SESSION" && !confirmDelete && (
                <>
                  <Button variant="danger-soft" onPress={() => setConfirmDelete(true)}>
                    Eliminar
                  </Button>
                  <Button variant="secondary" onPress={onEditSession}>
                    Editar
                  </Button>
                </>
              )}
              {type === "GENERAL" && !confirmDelete && (
                <>
                  <Button variant="danger-soft" onPress={() => setConfirmDelete(true)}>
                    Eliminar
                  </Button>
                  <Button variant="secondary" onPress={onEditGeneralEvent}>
                    Editar
                  </Button>
                </>
              )}
              {confirmDelete && (
                <div className="flex flex-col gap-3 w-full">
                  {(type === "SESSION" || type === "GENERAL") && event.extendedProps.series?.id && (
                    <div className="bg-warning/10 p-3 rounded-lg flex flex-col gap-2">
                      <p className="text-sm text-warning font-semibold">
                        {type === "SESSION" ? "Esta sesión pertenece a una serie recurrente." : "Este evento pertenece a una serie recurrente."}
                      </p>
                      <Select
                        variant="secondary"
                        selectedKey={deleteScope}
                        onSelectionChange={(k) => setDeleteScope(k as "single" | "following" | "all")}
                      >
                        <Label className="text-sm">¿Qué deseas eliminar?</Label>
                        <Select.Trigger />
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="single" textValue={type === "SESSION" ? "Solo esta sesión" : "Solo este evento"}>
                              {type === "SESSION" ? "Solo esta sesión" : "Solo este evento"}
                            </ListBox.Item>
                            <ListBox.Item id="following" textValue="Esta y las siguientes">Esta y las siguientes</ListBox.Item>
                            <ListBox.Item id="all" textValue="Toda la serie">Toda la serie</ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                  )}
                  <div className="flex items-center gap-2 justify-end w-full">
                    <span className="text-sm text-danger font-semibold">¿Seguro que deseas eliminar?</span>
                    <Button variant="ghost" size="sm" onPress={() => setConfirmDelete(false)} isDisabled={isDeleting}>
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
                          res = await deleteSession(event.id, event.extendedProps.series?.id ? deleteScope : "single");
                        } else if (type === "GENERAL") {
                          res = await deleteGeneralEvent(event.id, event.extendedProps.series?.id ? deleteScope : "single");
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
                              : "Evento eliminado con éxito"
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
              {type === "SESSION" && (metadata as ISessionCalendarMetadata).courses?.length > 0 && (
                <Button variant="primary" onPress={() => setIsAttendanceOpen(true)}>
                  Asistencia
                </Button>
              )}
              <Button variant="danger-soft" onPress={() => state.setOpen(false)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      {type === "SESSION" && (metadata as ISessionCalendarMetadata).courses?.length > 0 && event.start && (
        <SessionAttendanceDrawer
          isOpen={isAttendanceOpen}
          onOpenChange={setIsAttendanceOpen}
          sessionId={event.id}
          courseSeasonId={(metadata as ISessionCalendarMetadata).courses[0].id}
          sessionStartDate={event.start.toISOString()}
        />
      )}
    </Modal>
  );
};
