"use client";

import { useState, useRef, useCallback, startTransition } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventApi, PluginDef } from "@fullcalendar/core";

import { useOverlayState } from "@heroui/react";
import { toast } from "sonner";
import { getCalendarEventsAction } from "../actions/get-calendar-events";
import { mapBackendToCalendarEvent } from "../utils/calendar.mapper";
import { EventDetailModal } from "./event-detail-modal";
import { MatchFormModal } from "./match-form-modal";
import { SessionFormModal } from "./session-form-modal";
import { GeneralEventFormModal } from "./general-event-form-modal";
import {
  IMatchCalendarMetadata,
  ISessionCalendarMetadata,
  IGeneralEventCalendarMetadata,
} from "../interfaces/calendar.interface";
import esLocale from "@fullcalendar/core/locales/es";

export const CalendarView = () => {
  const calendarRef = useRef<any>(null);
  const modalState = useOverlayState();
  const createModalState = useOverlayState();
  const editModalState = useOverlayState();
  const sessionCreateModalState = useOverlayState();
  const sessionEditModalState = useOverlayState();
  const generalEventCreateModalState = useOverlayState();
  const generalEventEditModalState = useOverlayState();
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [matchInitialData, setMatchInitialData] = useState<any>(null);
  const [sessionInitialData, setSessionInitialData] = useState<any>(null);
  const [generalEventInitialData, setGeneralEventInitialData] =
    useState<any>(null);

  // FullCalendar pass fetchInfo to events function
  const fetchEvents = useCallback(
    (
      fetchInfo: { startStr: string; endStr: string },
      successCallback: (events: any[]) => void,
      failureCallback: (error: Error) => void,
    ) => {
      // Detach from React's render phase to prevent Server Action warnings
      setTimeout(() => {
        startTransition(() => {
          getCalendarEventsAction(fetchInfo.startStr, fetchInfo.endStr)
            .then((response) => {
              if (response.error) {
                toast.error(response.message);
                failureCallback(new Error(response.message));
                return;
              }
              const events = response.data.map(mapBackendToCalendarEvent);
              successCallback(events);
            })
            .catch((error) => {
              toast.error("Error al cargar el calendario");
              failureCallback(error as Error);
            });
        });
      }, 0);
    },
    [],
  );

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event as EventApi);
    modalState.setOpen(true);
  };

  const plugins: PluginDef[] = [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
  ];

  return (
    <div className="w-full calendar-wrapper bg-content1 p-4 rounded-xl shadow-sm border border-divider text-foreground">
      <FullCalendar
        ref={calendarRef}
        plugins={plugins as any}
        initialView="dayGridMonth"
        customButtons={{
          createEvent: {
            text: "Crear Partido",
            click: function () {
              createModalState.setOpen(true);
            },
          },
          createSession: {
            text: "Crear Sesón",
            click: function () {
              sessionCreateModalState.setOpen(true);
            },
          },
          createGeneralEvent: {
            text: "Crear Evento",
            click: function () {
              generalEventCreateModalState.setOpen(true);
            },
          },
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right:
            "createGeneralEvent createSession createEvent dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={fetchEvents}
        eventClick={handleEventClick}
        height="auto"
        locales={[esLocale]}
        locale="es"
        firstDay={1} // Lunes
      />
      <EventDetailModal
        state={modalState}
        event={selectedEvent}
        onDeleteSuccess={() => {
          calendarRef.current?.getApi().refetchEvents();
        }}
        onEditMatch={() => {
          if (selectedEvent && selectedEvent.extendedProps.type === "MATCH") {
            const meta = selectedEvent.extendedProps
              .metadata as IMatchCalendarMetadata;
            setMatchInitialData({
              id: meta.matchId || selectedEvent.id,
              homeTeamId: meta.homeTeam.id,
              awayTeamId: meta.awayTeam.id,
              homeTeamSeasonCategoryId: meta.homeCategory?.id || "",
              awayTeamSeasonCategoryId: meta.awayCategory?.id || "",
              locationId: selectedEvent.extendedProps.location?.id || null,
              startDate: selectedEvent.start?.toISOString() || "",
              endDate: selectedEvent.end?.toISOString() || "",
              type: meta.matchType,
              homeScore: meta.homeScore,
              awayScore: meta.awayScore,
            });
            modalState.setOpen(false);
            editModalState.setOpen(true);
          }
        }}
        onEditSession={() => {
          if (selectedEvent) {
            const meta = selectedEvent.extendedProps
              .metadata as ISessionCalendarMetadata;
            setSessionInitialData({
              id: meta.sessionId || selectedEvent.id,
              title: selectedEvent.title,
              locationId: selectedEvent.extendedProps.location?.id,
              startDate: selectedEvent.startStr,
              durationMin: meta.durationMin,
              teamSeasonCategoryIds: meta.teams?.map((t: any) => t.id) || [],
              courseSeasonShiftIds: meta.courses?.map((c: any) => c.id) || [],
              seriesId: selectedEvent.extendedProps.series?.id,
              recurrenceRule: selectedEvent.extendedProps.series?.isRecurring
                ? "yes"
                : undefined,
            });
            modalState.setOpen(false);
            sessionEditModalState.setOpen(true);
          }
        }}
        onEditGeneralEvent={() => {
          if (selectedEvent) {
            const meta = selectedEvent.extendedProps
              .metadata as IGeneralEventCalendarMetadata;
            setGeneralEventInitialData({
              id: meta.generalEventId || selectedEvent.id,
              title: selectedEvent.title,
              description: meta.description,
              locationId: selectedEvent.extendedProps.location?.id,
              startDate: selectedEvent.startStr,
              endDate: selectedEvent.endStr || selectedEvent.startStr,
              institutionId: meta.institutionId,
              teamSeasonCategoryId: meta.teamSeasonCategoryId,
              courseSeasonId: meta.courseSeasonId,
              courseSeasonShiftId: meta.courseSeasonShiftId,
              seriesId: selectedEvent.extendedProps.series?.id,
              recurrenceRule: selectedEvent.extendedProps.series?.isRecurring
                ? "yes"
                : undefined,
            });
            modalState.setOpen(false);
            generalEventEditModalState.setOpen(true);
          }
        }}
      />
      <MatchFormModal
        state={createModalState}
        mode="create"
        onSuccess={() => {
          calendarRef.current?.getApi().refetchEvents();
        }}
      />
      <MatchFormModal
        state={editModalState}
        mode="edit"
        initialData={matchInitialData}
        onSuccess={() => {
          calendarRef.current?.getApi().refetchEvents();
        }}
      />
      <SessionFormModal
        state={sessionCreateModalState}
        mode="create"
        onSuccess={() => {
          calendarRef.current?.getApi().refetchEvents();
        }}
      />
      <SessionFormModal
        state={sessionEditModalState}
        mode="edit"
        initialData={sessionInitialData}
        onSuccess={() => {
          calendarRef.current?.getApi().refetchEvents();
        }}
      />
      <GeneralEventFormModal
        state={generalEventCreateModalState}
        mode="create"
        onSuccess={() => {
          calendarRef.current?.getApi().refetchEvents();
        }}
      />
      <GeneralEventFormModal
        state={generalEventEditModalState}
        mode="edit"
        initialData={generalEventInitialData}
        onSuccess={() => {
          calendarRef.current?.getApi().refetchEvents();
        }}
      />
    </div>
  );
};
