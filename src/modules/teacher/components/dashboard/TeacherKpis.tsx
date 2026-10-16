import React from "react";
import { Card } from "@heroui/react";
import {
  UserGroupIcon,
  Mortarboard02Icon,
  Calendar01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TeacherDashboardStats } from "../../interfaces/teacher.interface";

interface TeacherKpisProps {
  stats: TeacherDashboardStats;
}

export const TeacherKpis: React.FC<TeacherKpisProps> = ({ stats }) => {
  const hasSessionsPermission = stats.upcomingSessionsCount !== undefined;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. Grupos Activos */}
      <Card className="p-5 border border-divider shadow-sm bg-content1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-default-500">
            Mis Grupos Activos
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <HugeiconsIcon icon={Mortarboard02Icon} size={20} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-foreground">
            {stats.activeGroups}
          </span>
          <span className="text-xs text-default-500 font-medium">asignaciones</span>
        </div>
        <p className="text-xs text-default-400 mt-2">
          {stats.courseGroups} escuela{stats.courseGroups !== 1 ? "s" : ""} ·{" "}
          {stats.teamGroups} equipo{stats.teamGroups !== 1 ? "s" : ""}
        </p>
      </Card>

      {/* 2. Integrantes / Participantes */}
      <Card className="p-5 border border-divider shadow-sm bg-content1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-default-500">
            Integrantes Vigentes
          </span>
          <div className="w-9 h-9 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <HugeiconsIcon icon={UserMultipleIcon} size={20} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-foreground">
            {stats.currentParticipants}
          </span>
          <span className="text-xs text-default-500 font-medium">deportistas</span>
        </div>
        <p className="text-xs text-default-400 mt-2">
          {stats.administrativeParticipants > stats.currentParticipants ? (
            <span>
              {stats.administrativeParticipants} inscritos administrativamente
            </span>
          ) : (
            <span>En turnos y planteles asignados</span>
          )}
        </p>
      </Card>

      {/* 3. Próximas Sesiones (Permission-adaptive) */}
      <Card className="p-5 border border-divider shadow-sm bg-content1 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-default-500">
            Próximas Sesiones
          </span>
          <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <HugeiconsIcon icon={Calendar01Icon} size={20} />
          </div>
        </div>
        {hasSessionsPermission ? (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground">
                {stats.upcomingSessionsCount}
              </span>
              <span className="text-xs text-default-500 font-medium">
                programadas
              </span>
            </div>
            <p className="text-xs text-default-400 mt-2">
              Próximos entrenamientos y clases
            </p>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-default-400">—</span>
            </div>
            <p className="text-xs text-default-400 mt-2">
              Sin permiso de lectura de sesiones
            </p>
          </>
        )}
      </Card>
    </div>
  );
};
