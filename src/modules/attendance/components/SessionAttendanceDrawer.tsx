"use client";

import { Drawer, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { getSessionRoster } from "../actions/get-session-roster";
import { getSessionBookings } from "../actions/get-session-bookings";
import { IStudentMembership } from "@/modules/student-memberships";
import { ISessionBooking } from "@/modules/attendance/types";
import { toast } from "sonner";
import { RosterTable } from "./RosterTable";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  sessionId: string;
  courseSeasonId: string;
  sessionStartDate: string; // ISO UTC string
}

export const SessionAttendanceDrawer = ({
  isOpen,
  onOpenChange,
  sessionId,
  courseSeasonId,
  sessionStartDate,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [roster, setRoster] = useState<IStudentMembership[]>([]);
  const [bookings, setBookings] = useState<ISessionBooking[]>([]);

  const fetchBookings = async () => {
    try {
      const res = await getSessionBookings(sessionId);
      if (res.error) {
        toast.error("Error al cargar las asistencias");
      } else {
        setBookings(res.data?.data || []);
      }
    } catch {
      toast.error("Error al conectar con el servidor para asistencias.");
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [rosterRes, bookingsRes] = await Promise.all([
        getSessionRoster(courseSeasonId, sessionStartDate),
        getSessionBookings(sessionId),
      ]);

      if (rosterRes.error) {
        toast.error("Error al cargar el Roster");
      } else {
        setRoster(rosterRes.data?.data || []);
      }

      if (bookingsRes.error) {
        toast.error("Error al cargar las asistencias");
      } else {
        setBookings(bookingsRes.data?.data || []);
      }
    } catch {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && sessionId && courseSeasonId && sessionStartDate) {
      fetchAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sessionId, courseSeasonId, sessionStartDate]);

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="w-full sm:max-w-2xl">
          <Drawer.CloseTrigger />
          <Drawer.Header className="border-b border-border flex flex-col gap-1 pb-4">
            <div className="flex items-center gap-2 text-foreground">
              <HugeiconsIcon icon={UserGroupIcon} size={24} />
              <Drawer.Heading className="text-xl font-bold">
                Asistencia de Sesión
              </Drawer.Heading>
            </div>
            <p className="text-sm text-muted">
              Roster generado basado en la fecha de la sesión
            </p>
          </Drawer.Header>

          <Drawer.Body className="gap-6 p-0 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner color="current" />
              </div>
            ) : (
              <RosterTable
                sessionId={sessionId}
                roster={roster}
                bookings={bookings}
                onBookingsChange={fetchBookings}
              />
            )}
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
