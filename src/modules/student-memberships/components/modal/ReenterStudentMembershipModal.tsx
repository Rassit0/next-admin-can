"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  Button,
  ProgressCircle,
  Label,
  useOverlayState,
  TextArea,
  Select,
  ListBox,
  Input,
  Chip,
} from "@heroui/react";
import { toast } from "sonner";
import {
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  UserCheck01Icon,
  Clock01Icon,
  CourseIcon,
  FileAttachmentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IStudentMembership } from "@/modules/student-memberships";
import {
  getStudentReentryContext,
  IStudentReenterContext,
} from "../../actions/get-reenter-context";
import { reenterStudentMembership } from "../../actions/reenter";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  membership: IStudentMembership | null;
  onSuccess?: () => void;
}

const getTodayString = () => new Date().toISOString().slice(0, 10);

export const ReenterStudentMembershipModal = ({
  isOpen,
  onOpenChange,
  membership,
  onSuccess,
}: Props) => {
  const state = useOverlayState({ isOpen, onOpenChange });
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [context, setContext] = useState<IStudentReenterContext | null>(null);

  // Form state
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [effectiveDate, setEffectiveDate] = useState<string>(getTodayString());
  const [reason, setReason] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (!isOpen || !membership) {
      setContext(null);
      return;
    }

    const loadData = async () => {
      setLoadingInfo(true);
      const res = await getStudentReentryContext(membership.id);
      setLoadingInfo(false);

      if (res.error || !res.data) {
        toast.error(
          res.message || "Error al cargar la información de reingreso escolar",
        );
        state.setOpen(false);
        return;
      }

      const info = res.data;
      setContext(info);

      const currentShiftObj = info.availableShifts.find((s) => s.isCurrentShift);
      setSelectedShiftId(currentShiftObj?.id || info.availableShifts[0]?.id || null);
      setEffectiveDate(getTodayString());
      setReason("");
      setNotes("");
    };

    loadData();
  }, [isOpen, membership?.id]);

  if (!membership) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-BO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return dateStr;
    }
  };

  // Validaciones de rango en cliente
  const todayStr = getTodayString();
  const seasonEndStr = context?.courseSeason.endDate
    ? new Date(context.courseSeason.endDate).toISOString().slice(0, 10)
    : todayStr;
  const maxAllowedDate = todayStr <= seasonEndStr ? todayStr : seasonEndStr;

  const withdrawalDateObj = context?.withdrawalDate ? new Date(context.withdrawalDate) : null;
  const seasonStartStr = context?.courseSeason.startDate
    ? new Date(context.courseSeason.startDate).toISOString().slice(0, 10)
    : "";
  const withdrawalDayStr = withdrawalDateObj ? withdrawalDateObj.toISOString().slice(0, 10) : "";
  const minAllowedDate = withdrawalDayStr >= seasonStartStr ? withdrawalDayStr : seasonStartStr;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim() || reason.trim().length < 5) {
      toast.error("El motivo de reingreso debe tener al menos 5 caracteres");
      return;
    }

    if (!effectiveDate) {
      toast.error("Debe seleccionar la fecha efectiva de reingreso");
      return;
    }

    if (effectiveDate > maxAllowedDate) {
      toast.error(`La fecha efectiva no puede ser futura ni superar el límite permitido (${maxAllowedDate})`);
      return;
    }

    if (minAllowedDate && effectiveDate < minAllowedDate) {
      toast.error(`La fecha efectiva no puede ser anterior a la última baja registrada (${minAllowedDate})`);
      return;
    }

    setSubmitting(true);
    try {
      // Si la fecha seleccionada es hoy, enviamos la hora actual para garantizar que sea posterior a cualquier baja de hoy.
      // Si es una fecha pasada, enviamos el mediodía UTC para evitar desfaces de zona horaria local.
      const dateToSend = effectiveDate === todayStr
        ? new Date().toISOString()
        : new Date(`${effectiveDate}T12:00:00.000Z`).toISOString();

      const res = await reenterStudentMembership({
        membershipId: membership.id,
        effectiveDate: dateToSend,
        reason: reason.trim(),
        courseSeasonShiftId: selectedShiftId || undefined,
        notes: notes.trim() || undefined,
      });

      if (res.error || !res.data) {
        toast.error(res.message || "Error al procesar el reingreso");
        return;
      }

      toast.success(
        res.message || "Reingreso escolar registrado y reactivado exitosamente",
      );
      state.setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Error inesperado al registrar el reingreso");
    } finally {
      setSubmitting(false);
    }
  };

  const studentName = context?.student
    ? `${context.student.firstName} ${context.student.lastName}`
    : `${membership.student?.person?.name || ""} ${membership.student?.person?.lastName || ""}`.trim();

  return (
    <AlertDialog.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-2xl max-h-[92vh] flex flex-col p-0 overflow-hidden">
          <AlertDialog.CloseTrigger />

          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-divider bg-content1/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={UserCheck01Icon} size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Registrar Reingreso de Estudiante
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Reactivar expediente escolar en {context?.courseSeason.courseName || "el curso"} (Mismo ID)
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {loadingInfo || !context ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <ProgressCircle isIndeterminate aria-label="Cargando" />
                  <p className="text-sm text-muted-foreground">
                    Cargando expediente escolar y antecedentes...
                  </p>
                </div>
              ) : (
                <>
                  {/* 1. Tarjeta Resumen del Alumno y Curso */}
                  <div className="p-4 rounded-xl bg-content2/40 border border-divider space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Estudiante
                        </div>
                        <div className="text-base font-bold text-foreground">
                          {studentName}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          CI/Doc: {context.student.documentNumber || "S/D"} ·
                          Nac: {formatDate(context.student.birthDate)}
                        </div>
                      </div>
                      <Chip color="default" size="sm" variant="secondary">
                        ID: {membership.id.slice(0, 8)}...
                      </Chip>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-divider/60 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Curso / Escuela:</span>
                        <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                          <HugeiconsIcon icon={CourseIcon} size={14} className="text-primary" />
                          {context.courseSeason.courseName}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Temporada:</span>
                        <span className="font-semibold text-foreground block mt-0.5">
                          {context.courseSeason.seasonName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Antecedentes Históricos de Inscripción y Baja */}
                  <div className="p-4 rounded-xl bg-warning-50/40 border border-warning-200/60 dark:border-warning-900/30 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-warning-800 dark:text-warning-300 flex items-center gap-1.5">
                        <HugeiconsIcon icon={Clock01Icon} size={15} />
                        Antecedentes Históricos de Participación
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Chip size="sm" color="danger" variant="secondary">
                          {context.status}
                        </Chip>
                        <span className="text-muted-foreground font-bold">→</span>
                        <Chip size="sm" color="success" variant="primary">
                          ACTIVE
                        </Chip>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-warning-200/50 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Inscripción Original:</span>
                        <span className="font-semibold text-foreground">
                          {formatDate(context.startedAt)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Fecha de Última Baja:</span>
                        <span className="font-semibold text-danger">
                          {formatDate(context.withdrawalDate)}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-muted-foreground block">Motivo de Baja:</span>
                        <span className="font-semibold text-foreground italic truncate block" title={context.withdrawalReason || ""}>
                          {context.withdrawalReason || "No registrado"}
                        </span>
                      </div>
                    </div>

                    {context.reenteredAt && (
                      <div className="text-[11px] text-muted-foreground border-t border-warning-200/40 pt-1">
                        Último reingreso previo: {formatDate(context.reenteredAt)}
                      </div>
                    )}
                  </div>

                  {/* 3. Historial de Ciclos en este Expediente */}
                  <div className="p-3.5 bg-content2/30 border border-divider rounded-xl space-y-2 text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <HugeiconsIcon icon={FileAttachmentIcon} size={14} className="text-primary" />
                      Historial de Ciclos Escolares
                    </span>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-success-50/50 dark:bg-success-950/20 border border-success-200 dark:border-success-900 rounded-lg">
                        <span className="text-base font-bold text-success block">
                          {context.cyclesSummary.confirmed}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">Completados / Pagados</span>
                      </div>
                      <div className="p-2 bg-danger-50/50 dark:bg-danger-950/20 border border-danger-200 dark:border-danger-900 rounded-lg">
                        <span className="text-base font-bold text-danger block">
                          {context.cyclesSummary.cancelled}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">Cancelados por Baja</span>
                      </div>
                      <div className="p-2 bg-default-100 border border-divider rounded-lg">
                        <span className="text-base font-bold text-foreground block">
                          {context.cyclesSummary.total}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">Total Intentos</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground italic pt-0.5">
                      ℹ️ Los ciclos anteriores cancelados permanecen cerrados. Este reingreso reactiva administrativamente la membresía sin revivir cobros pasados ni generar cuotas retroactivas.
                    </p>
                  </div>

                  {/* 4. Selector de Turno */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">
                      Turno para la Reactivación
                    </Label>
                    <Select
                      aria-label="Seleccionar Turno"
                      selectedKey={selectedShiftId || undefined}
                      onSelectionChange={(key) => setSelectedShiftId(String(key))}
                      className="w-full"
                    >
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {context.availableShifts.map((shift) => (
                            <ListBox.Item
                              key={shift.id}
                              id={shift.id}
                              textValue={shift.name}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  <span className="font-semibold text-xs block">
                                    {shift.name} {shift.isCurrentShift ? "(Turno anterior)" : ""}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    Categoría: {shift.categoryName} · {shift.gender}
                                  </span>
                                </div>
                                <Chip
                                  size="sm"
                                  variant="secondary"
                                  color={shift.availableSpots > 0 ? "success" : "danger"}
                                >
                                  {shift.availableSpots > 0
                                    ? `${shift.availableSpots} cupos disp.`
                                    : "Lleno"}
                                </Chip>
                              </div>
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  {/* 5. Fecha efectiva y Notas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">
                        Fecha Efectiva de Reingreso (UTC) *
                      </Label>
                      <Input
                        type="date"
                        value={effectiveDate}
                        min={minAllowedDate || undefined}
                        max={maxAllowedDate || undefined}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                        required
                      />
                      <span className="text-[10px] text-muted-foreground block">
                        Rango permitido: {context?.withdrawalDate ? `desde baja (${formatDate(context.withdrawalDate)})` : "inicio temporada"} hasta hoy ({formatDate(maxAllowedDate)}).
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-foreground">
                        Notas Internas Adicionales
                      </Label>
                      <Input
                        type="text"
                        placeholder="Ej. Aprobado por coordinación"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">
                      Motivo / Observación del Reingreso *
                    </Label>
                    <TextArea
                      placeholder="Detalle el motivo administrativo del reingreso del estudiante..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={2}
                      required
                      minLength={5}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      Mínimo 5 caracteres. Quedará registrado en la bitácora histórica de la membresía.
                    </span>
                  </div>

                  {/* Alerta Informativa On-Demand */}
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-2 text-xs text-foreground">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      La reactivación restaura el estado <strong>ACTIVE</strong> del alumno en el curso utilizando su mismo ID. Una vez reactivado, podrá utilizar la acción <strong>«Inscribir a Ciclo»</strong> para registrar y pagar los períodos que desee cursar.
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-divider bg-content1/50 flex items-center justify-end gap-2 shrink-0">
              <Button
                type="button"
                variant="tertiary"
                isDisabled={submitting}
                onPress={() => state.setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isPending={submitting}
                isDisabled={loadingInfo || !context || !reason.trim() || reason.trim().length < 5}
              >
                Confirmar Reingreso
              </Button>
            </div>
          </form>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
};
