"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@heroui/react";
import {
  Calendar01Icon,
  Time02Icon,
  Location01Icon,
  Add01Icon,
  PencilEdit02Icon,
  Cancel01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import {
  TeacherGroupSession,
  TeacherGroupType,
} from "../../interfaces/teacher.interface";
import { SessionFormModal } from "./SessionFormModal";
import { cancelTeacherSession } from "../../actions/cancel-teacher-session";

interface TeacherSessionListProps {
  upcomingSessions?: TeacherGroupSession[];
  recentSessions?: TeacherGroupSession[];
  groupType: TeacherGroupType;
  groupId: string;
  groupName?: string;
  groupDetail?: string;
  canCreate?: boolean;
  canUpdate?: boolean;
}

export const TeacherSessionList: React.FC<TeacherSessionListProps> = ({
  upcomingSessions,
  recentSessions,
  groupType,
  groupId,
  groupName = "Grupo",
  groupDetail = "",
  canCreate = false,
  canUpdate = false,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<TeacherGroupSession | null>(null);

  // Cancellation state
  const [cancellingSessionId, setCancellingSessionId] = useState<string | null>(
    null,
  );

  if (upcomingSessions === undefined && recentSessions === undefined) {
    return (
      <Card className="p-8 text-center border border-divider bg-content1">
        <p className="text-xs text-default-500">
          No tienes permisos suficientes para visualizar las sesiones de este grupo.
        </p>
      </Card>
    );
  }

  const handleOpenCreate = () => {
    setSelectedSession(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (session: TeacherGroupSession) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleConfirmCancel = (sessionId: string) => {
    startTransition(async () => {
      const res = await cancelTeacherSession(groupType, groupId, sessionId);
      if (res.error) {
        toast.error(res.message || "No se pudo cancelar la sesión.");
      } else {
        toast.success("Sesión cancelada correctamente.");
        setCancellingSessionId(null);
        router.refresh();
      }
    });
  };

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

  const renderSessionCard = (session: TeacherGroupSession, isPast = false) => {
    const dateStr = formatSessionDate(session.startDate);
    const timeStr = `${formatSessionTime(session.startDate)} - ${formatSessionTime(session.endDate)}`;
    const isCancelled = session.status === "CANCELLED";
    const isConfirmingCancel = cancellingSessionId === session.id;

    return (
      <Card
        key={session.id}
        className={`p-4 border border-divider transition-all bg-content1 shadow-sm ${
          isPast ? "opacity-85" : "hover:border-primary/40"
        } ${isCancelled ? "bg-danger/5 border-danger/20" : ""}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isCancelled
                  ? "bg-danger/10 text-danger"
                  : isPast
                  ? "bg-default-100 text-default-500"
                  : "bg-secondary/10 text-secondary"
              }`}
            >
              <HugeiconsIcon icon={Calendar01Icon} size={18} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isCancelled
                      ? "bg-danger/10 text-danger border border-danger/20"
                      : isPast
                      ? "bg-default-100 text-default-600 border border-divider"
                      : "bg-secondary/10 text-secondary border border-secondary/20"
                  }`}
                >
                  {isCancelled ? "Cancelada" : session.status}
                </span>
                <span className="text-xs text-default-400 capitalize">
                  {dateStr}
                </span>
              </div>

              <h4 className="text-sm font-bold text-foreground">
                {session.title}
              </h4>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2 text-xs text-default-500 pt-2 sm:pt-0 border-t sm:border-t-0 border-divider/50">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <HugeiconsIcon icon={Time02Icon} size={14} className="text-default-400" />
              <span>{timeStr}</span>
              <span className="text-default-400 font-normal">
                ({session.durationMin} min)
              </span>
            </div>

            {session.location && (
              <div className="flex items-center gap-1.5 text-default-400">
                <HugeiconsIcon icon={Location01Icon} size={14} />
                <span>{session.location.name}</span>
              </div>
            )}

            {/* Action buttons (Permission adaptive: UPDATE_SESSIONS) */}
            {canUpdate && !isCancelled && !isPast && (
              <div className="flex items-center gap-1.5 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2.5 text-[11px] font-semibold flex items-center gap-1"
                  onPress={() => handleOpenEdit(session)}
                >
                  <HugeiconsIcon icon={PencilEdit02Icon} size={12} />
                  <span>Editar</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2.5 text-[11px] font-semibold text-danger border-danger/30 hover:bg-danger/10 flex items-center gap-1"
                  onPress={() =>
                    setCancellingSessionId(
                      isConfirmingCancel ? null : session.id,
                    )
                  }
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={12} />
                  <span>Cancelar</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Cancellation Confirmation Bar */}
        {isConfirmingCancel && (
          <div className="mt-3 pt-3 border-t border-danger/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-danger/5 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-danger font-medium">
              <HugeiconsIcon icon={AlertCircleIcon} size={16} className="shrink-0" />
              <span>
                ¿Confirmas la cancelación de esta sesión? No se alterará el historial de asistencias.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-3 text-xs"
                onPress={() => setCancellingSessionId(null)}
                isDisabled={isPending}
              >
                No cancelar
              </Button>
              <Button
                size="sm"
                variant="primary"
                className="h-7 px-3 text-xs font-bold bg-danger text-danger-foreground hover:bg-danger/90"
                onPress={() => handleConfirmCancel(session.id)}
                isDisabled={isPending}
              >
                {isPending ? "Cancelando..." : "Sí, cancelar sesión"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Action Header Banner if user has CREATE_SESSIONS */}
      {canCreate && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-content1 border border-divider shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-foreground">
              Gestión de Sesiones del Grupo
            </h4>
            <p className="text-xs text-default-500">
              Programa nuevos entrenamientos o clases para tus participantes en este turno o categoría.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            className="text-xs font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            onPress={handleOpenCreate}
          >
            <HugeiconsIcon icon={Add01Icon} size={15} />
            <span>Nueva sesión</span>
          </Button>
        </div>
      )}

      {/* 1. Próximas Sesiones */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-default-500">
            Próximas Sesiones ({upcomingSessions?.length || 0})
          </span>
          <span className="text-xs text-default-400">
            Ordenadas por fecha más cercana
          </span>
        </div>

        {upcomingSessions && upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.map((session) => renderSessionCard(session, false))}
          </div>
        ) : (
          <Card className="p-8 border border-dashed border-divider bg-content1/50 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-default-100 flex items-center justify-center text-default-400 mb-2">
              <HugeiconsIcon icon={Calendar01Icon} size={24} />
            </div>
            <h4 className="text-sm font-semibold text-foreground mb-1">
              No hay sesiones programadas para este grupo
            </h4>
            <p className="text-xs text-default-500 max-w-sm mb-3">
              {canCreate
                ? "Puedes programar una nueva sesión de entrenamiento pulsando el botón superior."
                : "Cuando la coordinación deportiva o el cuerpo técnico agende sesiones, aparecerán aquí."}
            </p>
            {canCreate && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs font-semibold flex items-center gap-1.5"
                onPress={handleOpenCreate}
              >
                <HugeiconsIcon icon={Add01Icon} size={14} />
                <span>Programar primera sesión</span>
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* 2. Sesiones Recientes */}
      {recentSessions && recentSessions.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-default-500">
              Sesiones Concluidas Recientes ({recentSessions.length})
            </span>
            <span className="text-xs text-default-400">
              Últimas sesiones finalizadas
            </span>
          </div>

          <div className="space-y-3">
            {recentSessions.map((session) => renderSessionCard(session, true))}
          </div>
        </div>
      )}

      {/* Modal Island for Create/Edit */}
      <SessionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        groupType={groupType}
        groupId={groupId}
        groupName={groupName}
        groupDetail={groupDetail}
        sessionToEdit={selectedSession}
      />
    </div>
  );
};
