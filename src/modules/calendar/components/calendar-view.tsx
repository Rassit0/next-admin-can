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
import esLocale from '@fullcalendar/core/locales/es';

export const CalendarView = () => {
  const calendarRef = useRef<any>(null);
  const modalState = useOverlayState();
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

  // FullCalendar pass fetchInfo to events function
  const fetchEvents = useCallback((
    fetchInfo: { startStr: string; endStr: string }, 
    successCallback: (events: any[]) => void, 
    failureCallback: (error: Error) => void
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
  }, []);

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event as EventApi);
    modalState.setOpen(true);
  };

  const plugins: PluginDef[] = [dayGridPlugin, timeGridPlugin, interactionPlugin];

  return (
    <div className="w-full calendar-wrapper bg-content1 p-4 rounded-xl shadow-sm border border-divider text-foreground">
      <FullCalendar
        ref={calendarRef}
        plugins={plugins as any}
        initialView="dayGridMonth"
        customButtons={{
          createEvent: {
            text: 'Crear Evento',
            click: function() {
              toast.info('Modal de creación pendiente de implementar');
              // modalState.setOpen(true); -> here you would open create modal
            }
          }
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "createEvent dayGridMonth,timeGridWeek,timeGridDay",
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
      />
    </div>
  );
};
