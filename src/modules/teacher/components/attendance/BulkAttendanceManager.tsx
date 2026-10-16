"use client";

import React, { useState, useTransition } from "react";
import { Button, Card, Spinner } from "@heroui/react";
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  FloppyDiskIcon,
  UserCheck01Icon,
  AlertCircleIcon,
  Time02Icon,
  Location01Icon,
  Add01Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import {
  SessionAttendanceRoster,
  TeacherGroupType,
  BulkAttendancePayload,
  AttendanceParticipant,
  AttendanceIncident,
} from "../../interfaces/teacher.interface";
import { saveBulkAttendance } from "../../actions/save-bulk-attendance";
import { IncidentFormModal } from "./IncidentFormModal";

interface BulkAttendanceManagerProps {
  roster: SessionAttendanceRoster;
  groupType: TeacherGroupType;
  groupId: string;
  sessionId: string;
  canCreateIncidents?: boolean;
  canUpdateIncidents?: boolean;
  canReadIncidents?: boolean;
}

export const BulkAttendanceManager: React.FC<BulkAttendanceManagerProps> = ({
  roster,
  groupType,
  groupId,
  sessionId,
  canCreateIncidents = false,
  canUpdateIncidents = false,
  canReadIncidents = true,
}) => {
  // Incident modal states
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [targetParticipant, setTargetParticipant] = useState<{
    id: string;
    name: string;
    type: "STUDENT" | "PLAYER";
  } | null>(null);
  const [targetIncident, setTargetIncident] = useState<AttendanceIncident | null>(
    null,
  );
  // 1. Initial state from server-provided roster
  const initialMap = new Map<string, boolean | null>();
  roster.participants.forEach((p) => {
    initialMap.set(p.participantId, p.attendance.attended);
  });

  const [attendanceMap, setAttendanceMap] = useState<Map<string, boolean | null>>(
    new Map(initialMap),
  );
  const [savedMap, setSavedMap] = useState<Map<string, boolean | null>>(
    new Map(initialMap),
  );
  const [isSaving, setIsSaving] = useState(false);

  // 2. Derive unsaved changes count
  let unsavedCount = 0;
  for (const [id, val] of attendanceMap.entries()) {
    if (val !== savedMap.get(id)) {
      unsavedCount++;
    }
  }

  // 3. Derive live summary counts
  let presentCount = 0;
  let absentCount = 0;
  let unregisteredCount = 0;

  for (const p of roster.participants) {
    const status = attendanceMap.get(p.participantId);
    if (status === true) presentCount++;
    else if (status === false) absentCount++;
    else unregisteredCount++;
  }

  // 4. Handlers
  const handleSetStatus = (participantId: string, status: boolean) => {
    setAttendanceMap((prev) => {
      const next = new Map(prev);
      const current = next.get(participantId);
      // Clicking same active status leaves it active; to unmark, click again
      if (current === status) {
        next.set(participantId, null);
      } else {
        next.set(participantId, status);
      }
      return next;
    });
  };

  const handleMarkAllPresent = () => {
    setAttendanceMap((prev) => {
      const next = new Map(prev);
      for (const p of roster.participants) {
        next.set(p.participantId, true);
      }
      return next;
    });
    toast.info("Todos los participantes marcados como presentes.");
  };

  const handleSave = async () => {
    const entries: { participantId: string; attended: boolean }[] = [];
    for (const [participantId, attended] of attendanceMap.entries()) {
      // Only submit entries that have been given a definitive status (true or false)
      if (attended !== null) {
        entries.push({ participantId, attended });
      }
    }

    if (entries.length === 0) {
      toast.warning("No hay asistencias marcadas para guardar.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: BulkAttendancePayload = { entries };
      const res = await saveBulkAttendance(groupType, groupId, sessionId, payload);

      if (res.error) {
        toast.error(res.message || "Error al registrar la asistencia.");
      } else {
        setSavedMap(new Map(attendanceMap));
        toast.success("Asistencia guardada correctamente.");
      }
    } catch {
      toast.error("Ocurrió un error inesperado al conectar con el servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (first: string, last: string) => {
    return `${(last || "").charAt(0)}${(first || "").charAt(0)}`.toUpperCase();
  };

  const openCreateModal = (p: AttendanceParticipant) => {
    const fullName = `${p.lastName} ${p.secondLastName || ""}, ${p.firstName}`.trim();
    setTargetParticipant({
      id: p.participantId,
      name: fullName,
      type: p.participantType,
    });
    setTargetIncident(null);
    setIsIncidentModalOpen(true);
  };

  const openEditModal = (p: AttendanceParticipant, inc: AttendanceIncident) => {
    const fullName = `${p.lastName} ${p.secondLastName || ""}, ${p.firstName}`.trim();
    setTargetParticipant({
      id: p.participantId,
      name: fullName,
      type: p.participantType,
    });
    setTargetIncident(inc);
    setIsIncidentModalOpen(true);
  };

  const formatIncidentTime = (d: string | Date) => {
    const dateObj = typeof d === "string" ? new Date(d) : d;
    if (isNaN(dateObj.getTime())) return "";
    return new Intl.DateTimeFormat("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    }).format(dateObj);
  };

  return (
    <div className="space-y-6">
      {/* 1. Sticky Action Toolbar & Live Summary */}
      <div className="sticky top-2 z-20 p-4 rounded-2xl bg-content1/95 backdrop-blur-md border border-divider shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all">
        {/* Live Counters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold bg-default-100 text-default-700 border border-divider">
            Total: {roster.participants.length}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold bg-success/10 text-success border border-success/20">
            Presentes: {presentCount}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold bg-danger/10 text-danger border border-danger/20">
            Ausentes: {absentCount}
          </span>
          {unregisteredCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full font-semibold bg-warning/10 text-warning border border-warning/20">
              Sin registrar: {unregisteredCount}
            </span>
          )}
        </div>

        {/* Buttons: Mark All & Save */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs font-semibold flex items-center gap-1.5"
            onPress={handleMarkAllPresent}
            isDisabled={isSaving || roster.participants.length === 0}
          >
            <HugeiconsIcon icon={UserCheck01Icon} size={15} />
            <span className="hidden sm:inline">Marcar todos presentes</span>
            <span className="sm:hidden">Todos presentes</span>
          </Button>

          <Button
            size="sm"
            variant={unsavedCount > 0 ? "primary" : "outline"}
            className="text-xs font-bold flex items-center gap-1.5"
            onPress={handleSave}
            isDisabled={isSaving || unsavedCount === 0}
          >
            {isSaving ? (
              <Spinner size="sm" color="current" />
            ) : (
              <HugeiconsIcon icon={FloppyDiskIcon} size={15} />
            )}
            <span>
              {isSaving
                ? "Guardando..."
                : unsavedCount > 0
                ? `Guardar (${unsavedCount})`
                : "Guardado"}
            </span>
          </Button>
        </div>
      </div>

      {/* Unsaved changes notice banner if modified */}
      {unsavedCount > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-warning/10 border border-warning/30 text-warning text-xs font-medium">
          <HugeiconsIcon icon={AlertCircleIcon} size={16} className="shrink-0" />
          <span>
            Tienes <strong>{unsavedCount} cambio{unsavedCount !== 1 ? "s" : ""} sin guardar</strong> en esta sesión. Pulsa &quot;Guardar&quot; para confirmar.
          </span>
        </div>
      )}

      {/* 2. Participants Roster (Mobile-First Touch Cards) */}
      {roster.participants.length === 0 ? (
        <Card className="p-8 border border-dashed border-divider bg-content1/50 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-default-100 flex items-center justify-center text-default-400 mb-2">
            <HugeiconsIcon icon={UserCheck01Icon} size={24} />
          </div>
          <h4 className="text-sm font-semibold text-foreground mb-1">
            No hay participantes en el roster para esta fecha
          </h4>
          <p className="text-xs text-default-500 max-w-sm">
            Para la fecha de esta sesión no se encontraron alumnos o jugadores con
            inscripción activa en el grupo.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {roster.participants.map((p, index) => {
            const fullName = `${p.lastName} ${p.secondLastName || ""}, ${p.firstName}`.trim();
            const currentStatus = attendanceMap.get(p.participantId);
            const isPresent = currentStatus === true;
            const isAbsent = currentStatus === false;
            const isUnregistered = currentStatus === null || currentStatus === undefined;
            const incidents = p.attendance.incidents || [];

            return (
              <div
                key={p.membershipId || `${p.participantId}-${index}`}
                className={`p-3.5 sm:px-5 rounded-2xl border transition-all flex flex-col gap-3 shadow-sm ${
                  isPresent
                    ? "bg-success/5 border-success/30"
                    : isAbsent
                    ? "bg-danger/5 border-danger/30"
                    : "bg-content1 border-divider hover:border-divider/80"
                }`}
              >
                {/* Top Row: Identity & Attendance Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Participant Identity */}
                  <div className="flex items-center gap-3 min-w-0">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={fullName}
                        className="w-10 h-10 rounded-full object-cover shrink-0 border border-divider"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border ${
                          isPresent
                            ? "bg-success/20 text-success border-success/30"
                            : isAbsent
                            ? "bg-danger/20 text-danger border-danger/30"
                            : "bg-primary/10 text-primary border-primary/20"
                        }`}
                      >
                        {getInitials(p.firstName, p.lastName)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {fullName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-default-400">
                        <span>{p.participantType === "STUDENT" ? "Alumno" : "Jugador"}</span>
                        {p.documentNumber && (
                          <>
                            <span>·</span>
                            <span>Doc: {p.documentNumber}</span>
                          </>
                        )}
                        {canCreateIncidents && incidents.length === 0 && (
                          <>
                            <span>·</span>
                            <button
                              type="button"
                              onClick={() => openCreateModal(p)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-default-500 hover:text-primary transition-colors py-0.5 px-1.5 rounded-md hover:bg-default-100"
                              title="Registrar observación o incidente para este participante"
                            >
                              <HugeiconsIcon icon={Add01Icon} size={12} />
                              <span>Incidente</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Touch-Friendly Action Buttons: Presente / Ausente */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleSetStatus(p.participantId, true)}
                      aria-label={`Marcar a ${fullName} como presente`}
                      className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                        isPresent
                          ? "bg-success text-success-foreground shadow-sm ring-2 ring-success/30"
                          : "bg-default-100 text-default-600 hover:bg-success/10 hover:text-success border border-divider"
                      }`}
                    >
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                      <span>Presente</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetStatus(p.participantId, false)}
                      aria-label={`Marcar a ${fullName} como ausente`}
                      className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                        isAbsent
                          ? "bg-danger text-danger-foreground shadow-sm ring-2 ring-danger/30"
                          : "bg-default-100 text-default-600 hover:bg-danger/10 hover:text-danger border border-divider"
                      }`}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={16} />
                      <span>Ausente</span>
                    </button>
                  </div>
                </div>

                {/* Incidents Section if participant has recorded incidents */}
                {canReadIncidents && incidents.length > 0 && (
                  <div className="pt-2 border-t border-divider/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-warning">
                      <div className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={AlertCircleIcon} size={14} />
                        <span>Incidentes / Observaciones ({incidents.length})</span>
                      </div>
                      {canCreateIncidents && (
                        <button
                          type="button"
                          onClick={() => openCreateModal(p)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
                        >
                          <HugeiconsIcon icon={Add01Icon} size={12} />
                          <span>Añadir</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {incidents.map((inc) => (
                        <div
                          key={inc.id}
                          className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-warning/5 border border-warning/20 text-xs text-foreground"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                              {inc.description}
                            </p>
                            <span className="text-[10px] text-default-400 mt-1 block">
                              {formatIncidentTime(inc.createdAt)}
                            </span>
                          </div>
                          {canUpdateIncidents && (
                            <button
                              type="button"
                              onClick={() => openEditModal(p, inc)}
                              className="shrink-0 p-1.5 rounded-lg text-default-500 hover:text-foreground hover:bg-warning/10 transition-colors"
                              title="Editar este incidente"
                              aria-label={`Editar incidente de ${fullName}`}
                            >
                              <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Incident Form Modal */}
      <IncidentFormModal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        groupType={groupType}
        groupId={groupId}
        sessionId={sessionId}
        sessionTitle={roster.session.title}
        participant={targetParticipant}
        incidentToEdit={targetIncident}
      />
    </div>
  );
};
