"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, useOverlayState } from "@heroui/react";
import {
  AlertCircleIcon,
  PencilEdit02Icon,
  Add01Icon,
  UserIcon,
  Calendar01Icon,
  Note01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import {
  TeacherGroupType,
  AttendanceIncident,
} from "../../interfaces/teacher.interface";
import { createTeacherIncident } from "../../actions/create-teacher-incident";
import { updateTeacherIncident } from "../../actions/update-teacher-incident";

interface ParticipantContext {
  id: string;
  name: string;
  type: "STUDENT" | "PLAYER";
}

interface IncidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupType: TeacherGroupType;
  groupId: string;
  sessionId: string;
  sessionTitle?: string;
  participant: ParticipantContext | null;
  incidentToEdit?: AttendanceIncident | null;
  onSuccess?: () => void;
}

export const IncidentFormModal: React.FC<IncidentFormModalProps> = ({
  isOpen,
  onClose,
  groupType,
  groupId,
  sessionId,
  sessionTitle,
  participant,
  incidentToEdit,
  onSuccess,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = !!incidentToEdit;

  // Form state
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Sync state whenever modal opens or target changes
  useEffect(() => {
    if (isOpen) {
      if (incidentToEdit) {
        setDescription(incidentToEdit.description || "");
      } else {
        setDescription("");
      }
      setError("");
    }
  }, [isOpen, incidentToEdit]);

  const validate = (): boolean => {
    if (!description.trim()) {
      setError("La descripción del incidente u observación es obligatoria.");
      return false;
    }
    if (description.trim().length < 3) {
      setError("La descripción debe tener al menos 3 caracteres.");
      return false;
    }
    if (description.trim().length > 1000) {
      setError("La descripción no puede superar los 1000 caracteres.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!participant) {
      toast.error("No se ha seleccionado un participante.");
      return;
    }

    if (!validate()) {
      return;
    }

    startTransition(async () => {
      try {
        if (isEditing && incidentToEdit) {
          const res = await updateTeacherIncident(
            groupType,
            groupId,
            sessionId,
            incidentToEdit.id,
            { description: description.trim() },
          );

          if (res.error) {
            toast.error(res.message || "Error al actualizar el incidente.");
            return;
          }

          toast.success("Incidente actualizado correctamente.");
        } else {
          const res = await createTeacherIncident(
            groupType,
            groupId,
            sessionId,
            {
              participantId: participant.id,
              description: description.trim(),
            },
          );

          if (res.error) {
            toast.error(res.message || "Error al registrar el incidente.");
            return;
          }

          toast.success("Incidente registrado correctamente.");
        }

        router.refresh();
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } catch {
        toast.error("Ocurrió un error inesperado al procesar la solicitud.");
      }
    });
  };

  const modalState = useOverlayState({
    isOpen,
    onOpenChange: (open) => {
      if (!open && !isPending) {
        onClose();
      }
    },
  });

  if (!isOpen || !participant) return null;

  return (
    <Modal state={modalState}>
      <Modal.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
        <Modal.Container className="flex items-center justify-center min-h-screen p-4 sm:p-6">
          <Modal.Dialog className="w-full max-w-lg bg-content1 border border-divider rounded-3xl shadow-2xl overflow-hidden p-6 text-foreground">
            {/* Header */}
            <Modal.Header className="flex items-start justify-between gap-4 pb-4 border-b border-divider/60">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isEditing
                      ? "bg-warning/10 text-warning border-warning/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  }`}
                >
                  <HugeiconsIcon
                    icon={isEditing ? PencilEdit02Icon : AlertCircleIcon}
                    size={20}
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {isEditing
                      ? "Editar Incidente u Observación"
                      : "Registrar Incidente u Observación"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-default-500">
                    <HugeiconsIcon icon={UserIcon} size={13} />
                    <span className="font-semibold text-foreground truncate max-w-[220px]">
                      {participant.name}
                    </span>
                    <span>·</span>
                    <span>
                      {participant.type === "STUDENT" ? "Alumno" : "Jugador"}
                    </span>
                  </div>
                </div>
              </div>
            </Modal.Header>

            {/* Body */}
            <Modal.Body className="py-5 space-y-4">
              {sessionTitle && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-default-100/60 border border-divider text-xs text-default-600">
                  <HugeiconsIcon
                    icon={Calendar01Icon}
                    size={14}
                    className="text-default-400 shrink-0"
                  />
                  <span className="truncate">
                    Sesión: <strong>{sessionTitle}</strong>
                  </span>
                </div>
              )}

              <form id="incident-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="incident-description"
                    className="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5"
                  >
                    Detalle del incidente u observación{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="incident-description"
                    rows={4}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Describa el hecho, molestia física, conducta o detalle relevante acontecido durante la sesión..."
                    disabled={isPending}
                    maxLength={1000}
                    aria-describedby={error ? "incident-error" : undefined}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-content2 text-xs text-foreground placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none ${
                      error ? "border-danger ring-1 ring-danger" : "border-divider"
                    }`}
                  />
                  <div className="flex items-center justify-between text-[11px] text-default-400 mt-1">
                    <span>
                      {error ? (
                        <span id="incident-error" className="text-danger font-medium">
                          {error}
                        </span>
                      ) : (
                        "Sea preciso con la descripción para el historial de la sesión."
                      )}
                    </span>
                    <span>{description.length}/1000</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-default-100/40 border border-divider text-[11px] text-default-500">
                  <HugeiconsIcon
                    icon={Note01Icon}
                    size={14}
                    className="text-default-400 shrink-0 mt-0.5"
                  />
                  <span>
                    Este registro queda asociado a la asistencia del participante en
                    esta sesión específica y podrá ser consultado por el cuerpo técnico.
                  </span>
                </div>
              </form>
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer className="flex items-center justify-end gap-2 pt-4 border-t border-divider/60">
              <Button
                variant="outline"
                size="sm"
                onPress={onClose}
                isDisabled={isPending}
                className="text-xs font-semibold"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="incident-form"
                variant="primary"
                size="sm"
                isDisabled={isPending}
                className="text-xs font-semibold"
              >
                {isPending
                  ? isEditing
                    ? "Guardando..."
                    : "Registrando..."
                  : isEditing
                  ? "Actualizar Incidente"
                  : "Guardar Incidente"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
