import React from "react";
import { Card } from "@heroui/react";
import {
  Calendar01Icon,
  Time02Icon,
  Location01Icon,
  Mortarboard02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { UpcomingSession } from "../../interfaces/teacher.interface";

interface TeacherUpcomingSessionsProps {
  sessions?: UpcomingSession[];
}

export const TeacherUpcomingSessions: React.FC<TeacherUpcomingSessionsProps> = ({
  sessions,
}) => {
  if (sessions === undefined) {
    return (
      <Card className="p-6 border border-divider bg-content1 text-center">
        <p className="text-xs text-default-400">
          No tienes permisos para visualizar el calendario de sesiones.
        </p>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="p-8 border border-dashed border-divider bg-content1/50 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-default-100 flex items-center justify-center text-default-400 mb-2">
          <HugeiconsIcon icon={Calendar01Icon} size={24} />
        </div>
        <h4 className="text-sm font-semibold text-foreground mb-1">
          No tienes sesiones próximas programadas
        </h4>
        <p className="text-xs text-default-500 max-w-xs">
          Las sesiones planificadas para tus turnos o equipos se mostrarán aquí
          automáticamente.
        </p>
      </Card>
    );
  }

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
    <div className="space-y-3">
      {sessions.map((session) => {
        const isCourse = session.groupType === "COURSE";
        const dateStr = formatSessionDate(session.startDate);
        const timeStr = `${formatSessionTime(session.startDate)} - ${formatSessionTime(session.endDate)}`;

        return (
          <Card
            key={session.id}
            className="p-4 border border-divider hover:border-primary/40 transition-colors bg-content1 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center shrink-0">
                  <HugeiconsIcon
                    icon={isCourse ? Mortarboard02Icon : UserGroupIcon}
                    size={20}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isCourse
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-secondary/10 text-secondary border border-secondary/20"
                      }`}
                    >
                      {isCourse ? "Escuela" : "Equipo"}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {session.groupName}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-foreground">
                    {session.title}
                  </h4>
                  <p className="text-xs text-default-500">{session.groupDetail}</p>
                </div>
              </div>

              {/* Date & Location Details */}
              <div className="flex flex-col sm:items-end gap-1 text-xs text-default-500 pt-2 sm:pt-0 border-t sm:border-t-0 border-divider/50">
                <div className="flex items-center gap-1.5 font-medium text-foreground capitalize">
                  <HugeiconsIcon icon={Calendar01Icon} size={14} className="text-primary" />
                  <span>{dateStr}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Time02Icon} size={14} className="text-default-400" />
                  <span>{timeStr}</span>
                </div>

                {session.location && (
                  <div className="flex items-center gap-1.5 text-default-400">
                    <HugeiconsIcon icon={Location01Icon} size={14} />
                    <span>{session.location.name}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
