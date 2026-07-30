"use client";

import { Button, Modal } from "@heroui/react";
import { EventApi } from "@fullcalendar/core";
import { 
  ISessionCalendarMetadata, 
  IMatchCalendarMetadata, 
  IGeneralEventCalendarMetadata 
} from "../interfaces/calendar.interface";

interface Props {
  state: {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
  };
  event: EventApi | null;
}

export const EventDetailModal = ({ state, event }: Props) => {
  if (!event) return null;

  const type = event.extendedProps.type;
  const metadata = event.extendedProps.metadata;
  const location = event.extendedProps.location;

  return (
    <Modal>
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
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
                      <strong>Rival:</strong> {(metadata as IMatchCalendarMetadata).opponentName} <br/>
                      <strong>Resultado:</strong> {(metadata as IMatchCalendarMetadata).result} <br/>
                      <strong>Equipo Propio:</strong> {(metadata as IMatchCalendarMetadata).team?.name || "N/A"}
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
              <Button variant="danger-soft" onPress={() => state.setOpen(false)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
