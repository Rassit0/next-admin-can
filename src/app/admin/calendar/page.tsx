import { CalendarWrapper } from "@/modules/calendar/components/calendar-wrapper";
import { HeaderPage } from "@/ui";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendario Institucional",
  description: "Vista global del calendario del club",
};

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-6">
      <HeaderPage
        title="Calendario Institucional"
        description="Gestione y visualice todos los eventos, entrenamientos y partidos."
      />

      {/* 
        El calendario se carga vacío y dispara inmediatamente fetchEvents
        hacia el backend para traer el mes actual. Esto evita cargar
        datos innecesarios desde el servidor y permite hidratar FullCalendar
        con el rango correcto de fechas según el viewport del usuario.
      */}
      <div className="mt-4">
        <CalendarWrapper />
      </div>
    </div>
  );
}
