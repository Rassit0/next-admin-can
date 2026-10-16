"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, useOverlayState } from "@heroui/react";
import {
  Calendar01Icon,
  Time02Icon,
  Location01Icon,
  PencilEdit02Icon,
  Add01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import {
  TeacherGroupType,
  TeacherGroupSession,
  TeacherLocation,
  CreateTeacherSessionInput,
  UpdateTeacherSessionInput,
} from "../../interfaces/teacher.interface";
import { createTeacherSession } from "../../actions/create-teacher-session";
import { updateTeacherSession } from "../../actions/update-teacher-session";
import { getTeacherLocations } from "../../actions/get-teacher-locations";

interface SessionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupType: TeacherGroupType;
  groupId: string;
  groupName: string;
  groupDetail: string;
  sessionToEdit?: TeacherGroupSession | null;
}

export const SessionFormModal: React.FC<SessionFormModalProps> = ({
  isOpen,
  onClose,
  groupType,
  groupId,
  groupName,
  groupDetail,
  sessionToEdit,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = !!sessionToEdit;

  // Form states
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [durationMin, setDurationMin] = useState<number>(90);
  const [locationId, setLocationId] = useState<string>("");
  const [locations, setLocations] = useState<TeacherLocation[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format Date to datetime-local input string (YYYY-MM-DDTHH:mm)
  const formatForInput = (d: string | Date): string => {
    const dateObj = typeof d === "string" ? new Date(d) : d;
    if (isNaN(dateObj.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    const year = dateObj.getFullYear();
    const month = pad(dateObj.getMonth() + 1);
    const day = pad(dateObj.getDate());
    const hours = pad(dateObj.getHours());
    const minutes = pad(dateObj.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Sync state whenever modal opens or target changes
  useEffect(() => {
    if (isOpen) {
      setErrors({});

      // Load locations
      setIsLoadingLocations(true);
      getTeacherLocations()
        .then((res) => {
          if (!res.error && res.data) {
            setLocations(res.data);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingLocations(false));

      if (sessionToEdit) {
        setTitle(sessionToEdit.title || "");
        setStartDate(formatForInput(sessionToEdit.startDate));
        setEndDate(formatForInput(sessionToEdit.endDate));
        setDurationMin(sessionToEdit.durationMin || 90);
        setLocationId(sessionToEdit.location?.id || "");
      } else {
        const defaultTitle =
          groupType === "COURSE" ? "Clase Regular" : "Entrenamiento Regular";
        setTitle(defaultTitle);

        // Default: Tomorrow at 16:00
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(16, 0, 0, 0);

        const tomorrowEnd = new Date(tomorrow);
        tomorrowEnd.setMinutes(tomorrowEnd.getMinutes() + 90);

        setStartDate(formatForInput(tomorrow));
        setEndDate(formatForInput(tomorrowEnd));
        setDurationMin(90);
        setLocationId("");
      }
    }
  }, [isOpen, sessionToEdit, groupType]);

  // Recalculate duration when dates change
  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    if (newStart && endDate) {
      const s = new Date(newStart).getTime();
      const e = new Date(endDate).getTime();
      if (e > s) {
        setDurationMin(Math.round((e - s) / 60000));
      }
    }
  };

  const handleEndDateChange = (newEnd: string) => {
    setEndDate(newEnd);
    if (startDate && newEnd) {
      const s = new Date(startDate).getTime();
      const e = new Date(newEnd).getTime();
      if (e > s) {
        setDurationMin(Math.round((e - s) / 60000));
      }
    }
  };

  const state = useOverlayState({
    isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!startDate) {
      newErrors.startDate = "La fecha y hora de inicio son requeridas.";
    }
    if (!endDate) {
      newErrors.endDate = "La fecha y hora de finalización son requeridas.";
    }

    const startObj = new Date(startDate);
    const endObj = new Date(endDate);

    if (startDate && endDate) {
      if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
        newErrors.dates = "Las fechas especificadas no son válidas.";
      } else if (endObj <= startObj) {
        newErrors.endDate =
          "La fecha y hora de fin debe ser posterior al inicio.";
      }
    }

    if (durationMin < 1) {
      newErrors.durationMin = "La duración mínima debe ser de al menos 1 minuto.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    startTransition(async () => {
      const isoStart = startObj.toISOString();
      const isoEnd = endObj.toISOString();

      if (isEditing && sessionToEdit) {
        const payload: UpdateTeacherSessionInput = {
          title: title.trim() || undefined,
          startDate: isoStart,
          endDate: isoEnd,
          durationMin,
          locationId: locationId || null,
        };

        const res = await updateTeacherSession(
          groupType,
          groupId,
          sessionToEdit.id,
          payload,
        );

        if (res.error) {
          toast.error(res.message || "No se pudo actualizar la sesión.");
          return;
        }

        toast.success("Sesión actualizada correctamente.");
        onClose();
        router.refresh();
      } else {
        const payload: CreateTeacherSessionInput = {
          title: title.trim() || undefined,
          startDate: isoStart,
          endDate: isoEnd,
          durationMin,
          locationId: locationId || null,
        };

        const res = await createTeacherSession(groupType, groupId, payload);

        if (res.error) {
          toast.error(res.message || "No se pudo crear la sesión.");
          return;
        }

        toast.success("Sesión creada correctamente.");
        onClose();
        router.refresh();
      }
    });
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-lg bg-content1 border border-divider shadow-xl rounded-3xl p-6">
            <Modal.CloseTrigger onClick={onClose} />
            <Modal.Header className="flex flex-col gap-1 pb-4 border-b border-divider/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                  <HugeiconsIcon
                    icon={isEditing ? PencilEdit02Icon : Add01Icon}
                    size={20}
                  />
                </div>
                <div>
                  <Modal.Heading className="text-base font-bold text-foreground">
                    {isEditing
                      ? "Editar Sesión de Entrenamiento"
                      : "Programar Nueva Sesión"}
                  </Modal.Heading>
                  <p className="text-xs text-default-500">
                    {isEditing
                      ? "Modifica el horario o ubicación de la sesión programada."
                      : "Agrega una nueva sesión o clase al calendario de este grupo."}
                  </p>
                </div>
              </div>

              {/* Read-only Context Banner */}
              <div className="mt-3 p-3 rounded-2xl bg-default-100/70 border border-divider/60 text-xs flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground truncate">
                    {groupName}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-default-400 bg-content1 px-2 py-0.5 rounded-full border border-divider">
                    {groupType === "COURSE" ? "Curso / Turno" : "Equipo / Categoría"}
                  </span>
                </div>
                <span className="text-default-500">{groupDetail}</span>
              </div>
            </Modal.Header>

            <Modal.Body className="py-4">
              <form id="session-form" onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Título de la sesión */}
                <div className="space-y-1">
                  <label
                    htmlFor="session-title"
                    className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                  >
                    <span>Título de la sesión</span>
                    <span className="text-default-400 font-normal">
                      (Opcional)
                    </span>
                  </label>
                  <input
                    id="session-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Entrenamiento Táctico / Práctica General"
                    disabled={isPending}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-content2 text-xs text-foreground placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>

                {/* 2. Fecha y hora de inicio */}
                <div className="space-y-1">
                  <label
                    htmlFor="session-start"
                    className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                  >
                    <HugeiconsIcon icon={Calendar01Icon} size={14} className="text-default-400" />
                    <span>Fecha y hora de inicio *</span>
                  </label>
                  <input
                    id="session-start"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    disabled={isPending}
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-content2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                      errors.startDate ? "border-danger" : "border-divider"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-[11px] text-danger">{errors.startDate}</p>
                  )}
                </div>

                {/* 3. Fecha y hora de fin */}
                <div className="space-y-1">
                  <label
                    htmlFor="session-end"
                    className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                  >
                    <HugeiconsIcon icon={Time02Icon} size={14} className="text-default-400" />
                    <span>Fecha y hora de finalización *</span>
                  </label>
                  <input
                    id="session-end"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    disabled={isPending}
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-content2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                      errors.endDate ? "border-danger" : "border-divider"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-[11px] text-danger">{errors.endDate}</p>
                  )}
                </div>

                {/* 4. Duración estimada (minutos) */}
                <div className="space-y-1">
                  <label
                    htmlFor="session-duration"
                    className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                  >
                    <HugeiconsIcon icon={Time02Icon} size={14} className="text-default-400" />
                    <span>Duración estimada (minutos)</span>
                  </label>
                  <input
                    id="session-duration"
                    type="number"
                    min={1}
                    max={480}
                    value={durationMin}
                    onChange={(e) => setDurationMin(Number(e.target.value) || 0)}
                    disabled={isPending}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-content2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                  {errors.durationMin && (
                    <p className="text-[11px] text-danger">{errors.durationMin}</p>
                  )}
                </div>

                {/* 5. Ubicación física */}
                <div className="space-y-1">
                  <label
                    htmlFor="session-location"
                    className="text-xs font-semibold text-foreground flex items-center gap-1.5"
                  >
                    <HugeiconsIcon icon={Location01Icon} size={14} className="text-default-400" />
                    <span>Ubicación / Cancha</span>
                    <span className="text-default-400 font-normal">
                      (Opcional)
                    </span>
                  </label>
                  <select
                    id="session-location"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    disabled={isPending || isLoadingLocations}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-content2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    <option value="">
                      {isLoadingLocations
                        ? "Cargando recintos del club..."
                        : "Sin ubicación definida"}
                    </option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} {loc.address ? `(${loc.address})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.dates && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs">
                    <HugeiconsIcon icon={AlertCircleIcon} size={16} className="shrink-0" />
                    <span>{errors.dates}</span>
                  </div>
                )}
              </form>
            </Modal.Body>

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
                form="session-form"
                variant="primary"
                size="sm"
                isDisabled={isPending}
                className="text-xs font-semibold"
              >
                {isPending
                  ? isEditing
                    ? "Guardando cambios..."
                    : "Creando sesión..."
                  : isEditing
                  ? "Actualizar Sesión"
                  : "Programar Sesión"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
