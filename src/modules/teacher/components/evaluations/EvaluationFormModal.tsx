"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, useOverlayState } from "@heroui/react";
import {
  Note01Icon,
  TaskDone01Icon,
  PencilEdit02Icon,
  Calendar01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import {
  TeacherParticipant,
  TeacherEvaluationItem,
  TeacherGroupType,
  CreateTeacherEvaluationInput,
  UpdateTeacherEvaluationInput,
} from "../../interfaces/teacher.interface";
import { createGroupEvaluation } from "../../actions/create-group-evaluation";
import { updateGroupEvaluation } from "../../actions/update-group-evaluation";

interface EvaluationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupType: TeacherGroupType;
  groupId: string;
  groupName: string;
  groupDetail: string;
  participant: TeacherParticipant;
  evaluationToEdit?: TeacherEvaluationItem | null;
}

export const EvaluationFormModal: React.FC<EvaluationFormModalProps> = ({
  isOpen,
  onClose,
  groupType,
  groupId,
  groupName,
  groupDetail,
  participant,
  evaluationToEdit,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = !!evaluationToEdit;

  // Form states
  const [evaluationDate, setEvaluationDate] = useState<string>("");
  const [technicalScore, setTechnicalScore] = useState<string>("");
  const [tacticalScore, setTacticalScore] = useState<string>("");
  const [physicalScore, setPhysicalScore] = useState<string>("");
  const [behaviorScore, setBehaviorScore] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync state whenever modal opens or target changes
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (evaluationToEdit) {
        const rawDate = evaluationToEdit.evaluationDate;
        const formattedDate =
          typeof rawDate === "string"
            ? rawDate.split("T")[0]
            : new Date(rawDate).toISOString().split("T")[0];

        setEvaluationDate(formattedDate);
        setTechnicalScore(
          evaluationToEdit.technicalScore !== null &&
            evaluationToEdit.technicalScore !== undefined
            ? String(evaluationToEdit.technicalScore)
            : "",
        );
        setTacticalScore(
          evaluationToEdit.tacticalScore !== null &&
            evaluationToEdit.tacticalScore !== undefined
            ? String(evaluationToEdit.tacticalScore)
            : "",
        );
        setPhysicalScore(
          evaluationToEdit.physicalScore !== null &&
            evaluationToEdit.physicalScore !== undefined
            ? String(evaluationToEdit.physicalScore)
            : "",
        );
        setBehaviorScore(
          evaluationToEdit.behaviorScore !== null &&
            evaluationToEdit.behaviorScore !== undefined
            ? String(evaluationToEdit.behaviorScore)
            : "",
        );
        setNotes(evaluationToEdit.notes || "");
      } else {
        setEvaluationDate(new Date().toISOString().split("T")[0]);
        setTechnicalScore("");
        setTacticalScore("");
        setPhysicalScore("");
        setBehaviorScore("");
        setNotes("");
      }
    }
  }, [isOpen, evaluationToEdit]);

  const state = useOverlayState({
    isOpen,
    onOpenChange: (open) => {
      if (!open) onClose();
    },
  });

  const participantFullName = [
    participant.lastName,
    participant.secondLastName,
    participant.firstName,
  ]
    .filter(Boolean)
    .join(" ");

  const validateScores = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!evaluationDate) {
      newErrors.evaluationDate = "La fecha de evaluación es obligatoria.";
    }

    const validateScoreField = (name: string, val: string, label: string) => {
      if (val !== "") {
        const num = Number(val);
        if (!Number.isInteger(num)) {
          newErrors[name] = `El puntaje de ${label} debe ser un número entero.`;
        } else if (num < 0 || num > 100) {
          newErrors[name] = `El puntaje de ${label} debe estar entre 0 y 100.`;
        }
      }
    };

    validateScoreField("technicalScore", technicalScore, "técnica");
    validateScoreField("tacticalScore", tacticalScore, "táctica");
    validateScoreField("physicalScore", physicalScore, "física");
    validateScoreField("behaviorScore", behaviorScore, "conducta");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateScores()) {
      return;
    }

    startTransition(async () => {
      const parsedTech =
        technicalScore === "" ? undefined : parseInt(technicalScore, 10);
      const parsedTact =
        tacticalScore === "" ? undefined : parseInt(tacticalScore, 10);
      const parsedPhys =
        physicalScore === "" ? undefined : parseInt(physicalScore, 10);
      const parsedBehav =
        behaviorScore === "" ? undefined : parseInt(behaviorScore, 10);

      // Normalize date to midday ISO to prevent timezone shifts across borders
      const isoDate = new Date(`${evaluationDate}T12:00:00Z`).toISOString();

      if (isEditing && evaluationToEdit) {
        const payload: UpdateTeacherEvaluationInput = {
          evaluationDate: isoDate,
          technicalScore: parsedTech,
          tacticalScore: parsedTact,
          physicalScore: parsedPhys,
          behaviorScore: parsedBehav,
          notes: notes.trim() !== "" ? notes.trim() : undefined,
        };

        const res = await updateGroupEvaluation(
          groupType,
          groupId,
          evaluationToEdit.id,
          payload,
        );

        if (res.error) {
          toast.error(res.message || "No se pudo actualizar la evaluación.");
          return;
        }

        toast.success("Evaluación actualizada correctamente.");
        onClose();
        router.refresh();
      } else {
        const payload: CreateTeacherEvaluationInput = {
          participantId: participant.participantId,
          evaluationDate: isoDate,
          technicalScore: parsedTech,
          tacticalScore: parsedTact,
          physicalScore: parsedPhys,
          behaviorScore: parsedBehav,
          notes: notes.trim() !== "" ? notes.trim() : undefined,
        };

        const res = await createGroupEvaluation(groupType, groupId, payload);

        if (res.error) {
          toast.error(res.message || "No se pudo registrar la evaluación.");
          return;
        }

        toast.success("Evaluación registrada correctamente.");
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
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <HugeiconsIcon
                    icon={isEditing ? PencilEdit02Icon : TaskDone01Icon}
                    size={20}
                  />
                </div>
                <div>
                  <Modal.Heading className="text-base font-bold text-foreground">
                    {isEditing
                      ? "Editar Evaluación de Progreso"
                      : "Nueva Evaluación de Progreso"}
                  </Modal.Heading>
                  <p className="text-xs text-default-500">
                    {isEditing
                      ? "Modifica las calificaciones y observaciones cualitativas."
                      : "Registra el progreso técnico y actitudinal del participante."}
                  </p>
                </div>
              </div>

              {/* Read-only Context Banner */}
              <div className="mt-4 p-3 rounded-2xl bg-default-100/70 border border-divider/60 text-xs flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-default-500 font-medium flex items-center gap-1.5">
                    <HugeiconsIcon icon={UserIcon} size={13} />
                    <span>Participante:</span>
                  </span>
                  <span className="font-semibold text-foreground">
                    {participantFullName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-default-500 font-medium">Grupo:</span>
                  <span className="text-default-700 font-medium truncate max-w-[240px]">
                    {groupName} · {groupDetail}
                  </span>
                </div>
              </div>
            </Modal.Header>

            <Modal.Body className="py-4">
              <form
                id="evaluation-form"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* 1. Fecha de Evaluación */}
                <div>
                  <label
                    htmlFor="evaluationDate"
                    className="block text-xs font-semibold text-foreground mb-1.5"
                  >
                    Fecha de Evaluación <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="evaluationDate"
                      type="date"
                      value={evaluationDate}
                      onChange={(e) => {
                        setEvaluationDate(e.target.value);
                        if (errors.evaluationDate) {
                          setErrors((prev) => {
                            const { evaluationDate: _, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                      disabled={isPending}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    />
                  </div>
                  {errors.evaluationDate && (
                    <p className="text-[11px] text-danger mt-1">
                      {errors.evaluationDate}
                    </p>
                  )}
                </div>

                {/* 2. Matriz de Puntajes (0 a 100) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Calificaciones (Escala 0 – 100)
                    </span>
                    <span className="text-[11px] text-default-400">
                      Opcionales · Enteros
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Técnica */}
                    <div className="p-3 rounded-2xl bg-default-50 border border-divider/60">
                      <label
                        htmlFor="technicalScore"
                        className="block text-[11px] font-semibold text-default-700 mb-1"
                      >
                        Técnica
                      </label>
                      <input
                        id="technicalScore"
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        inputMode="numeric"
                        placeholder="Ej: 85"
                        value={technicalScore}
                        onChange={(e) => setTechnicalScore(e.target.value)}
                        disabled={isPending}
                        className="w-full px-3 py-2 rounded-xl border border-divider bg-background text-foreground text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                      {errors.technicalScore && (
                        <p className="text-[10px] text-danger mt-1">
                          {errors.technicalScore}
                        </p>
                      )}
                    </div>

                    {/* Táctica */}
                    <div className="p-3 rounded-2xl bg-default-50 border border-divider/60">
                      <label
                        htmlFor="tacticalScore"
                        className="block text-[11px] font-semibold text-default-700 mb-1"
                      >
                        Táctica
                      </label>
                      <input
                        id="tacticalScore"
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        inputMode="numeric"
                        placeholder="Ej: 78"
                        value={tacticalScore}
                        onChange={(e) => setTacticalScore(e.target.value)}
                        disabled={isPending}
                        className="w-full px-3 py-2 rounded-xl border border-divider bg-background text-foreground text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                      {errors.tacticalScore && (
                        <p className="text-[10px] text-danger mt-1">
                          {errors.tacticalScore}
                        </p>
                      )}
                    </div>

                    {/* Física */}
                    <div className="p-3 rounded-2xl bg-default-50 border border-divider/60">
                      <label
                        htmlFor="physicalScore"
                        className="block text-[11px] font-semibold text-default-700 mb-1"
                      >
                        Física
                      </label>
                      <input
                        id="physicalScore"
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        inputMode="numeric"
                        placeholder="Ej: 90"
                        value={physicalScore}
                        onChange={(e) => setPhysicalScore(e.target.value)}
                        disabled={isPending}
                        className="w-full px-3 py-2 rounded-xl border border-divider bg-background text-foreground text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                      {errors.physicalScore && (
                        <p className="text-[10px] text-danger mt-1">
                          {errors.physicalScore}
                        </p>
                      )}
                    </div>

                    {/* Conducta */}
                    <div className="p-3 rounded-2xl bg-default-50 border border-divider/60">
                      <label
                        htmlFor="behaviorScore"
                        className="block text-[11px] font-semibold text-default-700 mb-1"
                      >
                        Conducta / Actitud
                      </label>
                      <input
                        id="behaviorScore"
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        inputMode="numeric"
                        placeholder="Ej: 95"
                        value={behaviorScore}
                        onChange={(e) => setBehaviorScore(e.target.value)}
                        disabled={isPending}
                        className="w-full px-3 py-2 rounded-xl border border-divider bg-background text-foreground text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                      {errors.behaviorScore && (
                        <p className="text-[10px] text-danger mt-1">
                          {errors.behaviorScore}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Notas y Comentarios Cualitativos */}
                <div>
                  <label
                    htmlFor="evaluationNotes"
                    className="block text-xs font-semibold text-foreground mb-1.5"
                  >
                    Observaciones y Retroalimentación
                  </label>
                  <textarea
                    id="evaluationNotes"
                    rows={3}
                    placeholder="Escribe comentarios sobre la evolución, fortalezas a mantener y aspectos a mejorar..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isPending}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-divider bg-background text-foreground text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                  />
                </div>
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
                form="evaluation-form"
                variant="primary"
                size="sm"
                isDisabled={isPending}
                className="text-xs font-semibold"
              >
                {isPending
                  ? isEditing
                    ? "Actualizando..."
                    : "Guardando..."
                  : isEditing
                  ? "Actualizar Evaluación"
                  : "Guardar Evaluación"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
