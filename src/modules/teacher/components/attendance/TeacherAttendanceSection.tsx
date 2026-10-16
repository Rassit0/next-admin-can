import React from "react";
import Link from "next/link";
import { Card, Button } from "@heroui/react";
import {
  Calendar01Icon,
  Time02Icon,
  Location01Icon,
  AlertCircleIcon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TeacherGroupContext,
  TeacherGroupSession,
} from "../../interfaces/teacher.interface";
import { getSessionAttendance } from "../../actions/get-session-attendance";
import { BulkAttendanceManager } from "./BulkAttendanceManager";

interface TeacherAttendanceSectionProps {
  group: TeacherGroupContext;
  selectedSessionId?: string;
  canCreateIncidents?: boolean;
  canUpdateIncidents?: boolean;
  canReadIncidents?: boolean;
}

export const TeacherAttendanceSection: React.FC<
  TeacherAttendanceSectionProps
> = async ({
  group,
  selectedSessionId,
  canCreateIncidents = false,
  canUpdateIncidents = false,
  canReadIncidents = true,
}) => {
  // 1. Gather all group sessions (upcoming + recent)
  const upcoming = group.upcomingSessions || [];
  const recent = group.recentSessions || [];
  const allSessions: TeacherGroupSession[] = [...upcoming, ...recent];

  if (allSessions.length === 0) {
    return (
      <Card className="p-8 border border-dashed border-divider bg-content1/50 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-default-100 flex items-center justify-center text-default-400 mb-2">
          <HugeiconsIcon icon={Calendar01Icon} size={24} />
        </div>
        <h4 className="text-sm font-semibold text-foreground mb-1">
          No hay sesiones programadas para este grupo
        </h4>
        <p className="text-xs text-default-500 max-w-sm">
          Para registrar la asistencia de los participantes es necesario que la
          coordinación deportiva agende una sesión o entrenamiento en el calendario.
        </p>
      </Card>
    );
  }

  // 2. Resolve default session server-side
  let targetSessionId = selectedSessionId;
  const sessionExists = allSessions.some((s) => s.id === targetSessionId);

  if (!targetSessionId || !sessionExists) {
    // A. Check if there's a session today
    const today = new Date();
    const todaySession = allSessions.find((s) => {
      const sDate = new Date(s.startDate);
      return (
        sDate.getFullYear() === today.getFullYear() &&
        sDate.getMonth() === today.getMonth() &&
        sDate.getDate() === today.getDate()
      );
    });

    if (todaySession) {
      targetSessionId = todaySession.id;
    } else if (upcoming.length > 0) {
      targetSessionId = upcoming[0].id;
    } else if (recent.length > 0) {
      targetSessionId = recent[0].id;
    } else {
      targetSessionId = allSessions[0].id;
    }
  }

  // 3. Fetch canonical attendance roster for the resolved session
  const attendanceRes = await getSessionAttendance(
    group.type,
    group.id,
    targetSessionId,
  );

  if (attendanceRes.error || !attendanceRes.data) {
    return (
      <Card className="p-8 text-center border border-danger/30 rounded-2xl bg-danger/5 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto mb-3">
          <HugeiconsIcon icon={AlertCircleIcon} size={24} />
        </div>
        <h4 className="text-sm font-bold text-danger mb-1">
          No se pudo cargar el roster de asistencia
        </h4>
        <p className="text-xs text-default-600 mb-4">
          {attendanceRes.message ||
            "Error al verificar la vinculación de la sesión o los permisos de asistencia."}
        </p>
      </Card>
    );
  }

  const roster = attendanceRes.data;

  const formatSessionDate = (d: string | Date) => {
    const dateObj = typeof d === "string" ? new Date(d) : d;
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(dateObj);
  };

  const formatSessionTime = (d: string | Date) => {
    const dateObj = typeof d === "string" ? new Date(d) : d;
    return new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(dateObj);
  };

  return (
    <div className="space-y-6">
      {/* 1. Session Picker (Deep-link SSR Navigation) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-default-500">
            Seleccionar Sesión para Asistencia
          </span>
          <span className="text-xs text-default-400">
            {allSessions.length} sesión{allSessions.length !== 1 ? "es" : ""} disponible{allSessions.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {allSessions.map((session) => {
            const isSelected = session.id === targetSessionId;
            const dateStr = formatSessionDate(session.startDate);
            const timeStr = formatSessionTime(session.startDate);

            return (
              <Link
                key={session.id}
                href={`/teacher/groups/${group.type}/${group.id}?tab=attendance&sessionId=${session.id}`}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all shrink-0 ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                    : "bg-content1 text-default-600 border-divider hover:border-primary/40 hover:bg-default-50"
                }`}
              >
                <HugeiconsIcon icon={Calendar01Icon} size={14} />
                <span className="capitalize">{dateStr}</span>
                <span className="opacity-75">· {timeStr}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Active Session Card Highlight */}
      <Card className="p-4 sm:p-5 border border-divider bg-content1 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Calendar01Icon} size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  {roster.session.status}
                </span>
                <span className="text-xs font-semibold text-foreground capitalize">
                  {formatSessionDate(roster.session.startDate)}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-foreground">
                {roster.session.title}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-default-600 pt-2 sm:pt-0 border-t sm:border-t-0 border-divider/50">
            <div className="flex items-center gap-1.5 font-medium">
              <HugeiconsIcon icon={Time02Icon} size={15} className="text-default-400" />
              <span>
                {formatSessionTime(roster.session.startDate)} -{" "}
                {formatSessionTime(roster.session.endDate)} ({roster.session.durationMin} min)
              </span>
            </div>

            {roster.session.location && (
              <div className="flex items-center gap-1.5 text-default-500">
                <HugeiconsIcon icon={Location01Icon} size={15} className="text-default-400" />
                <span>{roster.session.location.name}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 3. Bulk Attendance Interactive Client Island */}
      <BulkAttendanceManager
        roster={roster}
        groupType={group.type}
        groupId={group.id}
        sessionId={targetSessionId}
        canCreateIncidents={canCreateIncidents}
        canUpdateIncidents={canUpdateIncidents}
        canReadIncidents={canReadIncidents}
      />
    </div>
  );
};
