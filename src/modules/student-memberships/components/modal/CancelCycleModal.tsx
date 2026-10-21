"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  Button,
  ProgressCircle,
  Label,
  useOverlayState,
  TextField,
  TextArea,
  Description,
} from "@heroui/react";
import { toast } from "sonner";
import { cancelCycleEnrollmentAction } from "@/modules/student-memberships/actions/cancel-cycle";
import { formatCurrency } from "@/utils";

export interface CycleToCancel {
  id: string;
  courseName?: string;
  shiftName?: string;
  studentName?: string;
  cycleStartDate: string | Date;
  cycleEndDate: string | Date;
  amount?: number | string;
  status: string;
}

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cycle: CycleToCancel | null;
  onSuccess?: () => void;
}

export const CancelCycleModal = ({
  isOpen,
  onOpenChange,
  cycle,
  onSuccess,
}: Props) => {
  const state = useOverlayState({ isOpen, onOpenChange });
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!cycle) return null;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("es-BO", {
      timeZone: "UTC",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 5) {
      toast.error("El motivo de cancelación debe tener al menos 5 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await cancelCycleEnrollmentAction(cycle.id, {
        reason: reason.trim(),
      });

      if (res.error) {
        toast.error(res.message || "Error al cancelar el ciclo");
        return;
      }

      toast.success(res.message || "Ciclo cancelado exitosamente");
      setReason("");
      state.setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Error inesperado al cancelar el ciclo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-lg">
          <AlertDialog.CloseTrigger />
          <form
            onSubmit={handleCancel}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Cancelar ciclo inscrito</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body className="flex flex-col gap-3">
              <div className="p-3 bg-danger-50 text-danger-700 dark:bg-danger-950/40 dark:text-danger-300 rounded-lg text-xs leading-relaxed border border-danger-200 dark:border-danger-900">
                <i className="ri-alert-line mr-1 font-bold"></i>
                Esta acción liberará inmediatamente el cupo reservado en el turno y neutralizará la deuda pendiente asociada sin posibilidad de deshacer.
              </div>

              <div className="bg-default-50 p-3 rounded-lg flex flex-col gap-1.5 border border-default-200 text-xs">
                {cycle.studentName && (
                  <div className="flex justify-between">
                    <span className="text-default-500">Estudiante:</span>
                    <span className="font-semibold text-foreground">{cycle.studentName}</span>
                  </div>
                )}
                {cycle.courseName && (
                  <div className="flex justify-between">
                    <span className="text-default-500">Curso:</span>
                    <span className="font-medium text-foreground">{cycle.courseName}</span>
                  </div>
                )}
                {cycle.shiftName && (
                  <div className="flex justify-between">
                    <span className="text-default-500">Turno:</span>
                    <span className="font-medium text-foreground">{cycle.shiftName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-default-500">Período:</span>
                  <span className="font-medium text-foreground">
                    {formatDate(cycle.cycleStartDate)} – {formatDate(cycle.cycleEndDate)}
                  </span>
                </div>
                {cycle.amount !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-default-500">Importe pendiente:</span>
                    <span className="font-semibold text-danger">
                      {formatCurrency(Number(cycle.amount))}
                    </span>
                  </div>
                )}
              </div>

              <TextField
                isRequired
                name="reason"
                value={reason}
                onChange={setReason}
                className="w-full flex flex-col gap-1.5"
              >
                <Label className="text-xs font-semibold">
                  Motivo obligatorio de cancelación <span className="text-danger">*</span>
                </Label>
                <TextArea
                  rows={3}
                  variant="secondary"
                  className="w-full resize-y min-h-20"
                  value={reason}
                  onChange={(e: any) => {
                    const val = typeof e === "string" ? e : e?.target?.value ?? "";
                    setReason(val);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  placeholder="Indique el motivo de cancelación (ej. Error administrativo, desistimiento del apoderado...)"
                />
                <Description className="text-[11px] text-default-400">
                  Mínimo 5 caracteres ({reason.length} caracteres). Este motivo quedará registrado en el historial de auditoría.
                </Description>
              </TextField>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                onPress={() => state.close()}
                variant="tertiary"
                isDisabled={loading}
              >
                Cerrar
              </Button>
              <Button
                type="submit"
                variant="danger"
                isDisabled={loading || reason.trim().length < 5}
              >
                {loading && (
                  <ProgressCircle isIndeterminate aria-label="Cancelando">
                    <ProgressCircle.Track>
                      <ProgressCircle.TrackCircle />
                      <ProgressCircle.FillCircle />
                    </ProgressCircle.Track>
                  </ProgressCircle>
                )}
                Confirmar cancelación
              </Button>
            </AlertDialog.Footer>
          </form>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
};
