import React from "react";
import { Card } from "@heroui/react";
import {
  Mortarboard02Icon,
  UserGroupIcon,
  UserMultipleIcon,
  Calendar01Icon,
  Time02Icon,
  Location01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TeacherGroupContext } from "../../interfaces/teacher.interface";
import { formatStaffRole } from "../../utils/role-mapper";
import { formatGroupType } from "../../utils/group-type-mapper";

interface TeacherGroupOverviewProps {
  group: TeacherGroupContext;
}

export const TeacherGroupOverview: React.FC<TeacherGroupOverviewProps> = ({
  group,
}) => {
  const isCourse = group.type === "COURSE";
  const roleLabel = formatStaffRole(group.role, group.customRole);
  const typeLabel = formatGroupType(group.type);

  const nextSession =
    group.upcomingSessions && group.upcomingSessions.length > 0
      ? group.upcomingSessions[0]
      : null;

  const formatSessionDate = (d: string | Date) => {
    const dateObj = typeof d === "string" ? new Date(d) : d;
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
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
      {/* 1. Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Ficha del Grupo */}
        <Card className="p-5 border border-divider bg-content1 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-default-500">
              Detalle del Grupo
            </span>
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <HugeiconsIcon
                icon={isCourse ? Mortarboard02Icon : UserGroupIcon}
                size={18}
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-default-600">
            <div className="flex justify-between">
              <span className="text-default-400">Modalidad:</span>
              <span className="font-semibold text-foreground">{typeLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-default-400">Categoría:</span>
              <span className="font-semibold text-foreground">{group.category}</span>
            </div>
            {group.shift && (
              <div className="flex justify-between">
                <span className="text-default-400">Turno:</span>
                <span className="font-semibold text-foreground">{group.shift}</span>
              </div>
            )}
            {group.gender && (
              <div className="flex justify-between">
                <span className="text-default-400">Género:</span>
                <span className="font-semibold text-foreground">{group.gender}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-default-400">Tu función:</span>
              <span className="font-semibold text-foreground">{roleLabel}</span>
            </div>
          </div>
        </Card>

        {/* Participantes */}
        <Card className="p-5 border border-divider bg-content1 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-default-500">
              {isCourse ? "Participantes Vigentes" : "Plantel Activo"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <HugeiconsIcon icon={UserMultipleIcon} size={18} />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">
              {group.participantCount}
            </span>
            <span className="text-xs text-default-500 font-medium">
              {isCourse ? "alumnos en ciclo activo" : "jugadores activos"}
            </span>
          </div>

          <p className="text-xs text-default-400">
            {isCourse && group.administrativeCount > group.participantCount ? (
              <span>
                {group.administrativeCount} inscripciones administrativas en turno
              </span>
            ) : (
              <span>Habilitados para asistencia y evaluaciones</span>
            )}
          </p>
        </Card>

        {/* Próximas Sesiones */}
        <Card className="p-5 border border-divider bg-content1 shadow-sm space-y-3 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-default-500">
              Calendario de Sesiones
            </span>
            <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <HugeiconsIcon icon={Calendar01Icon} size={18} />
            </div>
          </div>

          {group.upcomingSessions !== undefined ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-foreground">
                  {group.upcomingSessions.length}
                </span>
                <span className="text-xs text-default-500 font-medium">
                  sesiones próximas programadas
                </span>
              </div>
              <p className="text-xs text-default-400">
                {nextSession
                  ? "Próxima sesión confirmada en calendario"
                  : "No hay sesiones próximas agendadas"}
              </p>
            </>
          ) : (
            <p className="text-xs text-default-400 pt-2">
              Sin permisos para consultar sesiones
            </p>
          )}
        </Card>
      </div>

      {/* 2. Próxima Sesión Highlight (si existe) */}
      {nextSession && (
        <Card className="p-6 border border-divider bg-content1 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <HugeiconsIcon icon={Calendar01Icon} size={18} className="text-secondary" />
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Próximo Entrenamiento / Clase
            </h3>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-default-50 border border-divider/50">
            <div>
              <h4 className="text-base font-bold text-foreground">
                {nextSession.title}
              </h4>
              <p className="text-xs text-default-500 capitalize mt-0.5">
                {formatSessionDate(nextSession.startDate)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-default-600">
              <div className="flex items-center gap-1.5 font-medium">
                <HugeiconsIcon icon={Time02Icon} size={15} className="text-default-400" />
                <span>
                  {formatSessionTime(nextSession.startDate)} -{" "}
                  {formatSessionTime(nextSession.endDate)} ({nextSession.durationMin} min)
                </span>
              </div>

              {nextSession.location && (
                <div className="flex items-center gap-1.5 text-default-500">
                  <HugeiconsIcon icon={Location01Icon} size={15} className="text-default-400" />
                  <span>{nextSession.location.name}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
