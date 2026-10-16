import React from "react";
import { Card } from "@heroui/react";
import {
  UserGroupIcon,
  TaskDone01Icon,
  Calendar01Icon,
  Note01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TeacherGroupContext,
  TeacherParticipant,
  TeacherEvaluationItem,
} from "../../interfaces/teacher.interface";
import { getGroupEvaluations } from "../../actions/get-group-evaluations";
import { TeacherParticipantSelector } from "./TeacherParticipantSelector";
import { EvaluationModalTrigger } from "./EvaluationModalTrigger";

interface TeacherEvaluationsSectionProps {
  group: TeacherGroupContext;
  selectedParticipantId?: string;
  canCreate: boolean;
  canUpdate: boolean;
}

export const TeacherEvaluationsSection: React.FC<
  TeacherEvaluationsSectionProps
> = async ({ group, selectedParticipantId, canCreate, canUpdate }) => {
  const participants: TeacherParticipant[] = group.participants || [];

  // 1. Group has zero participants
  if (participants.length === 0) {
    return (
      <Card className="p-8 border border-dashed border-divider bg-content1/50 text-center flex flex-col items-center justify-center rounded-3xl">
        <div className="w-12 h-12 rounded-2xl bg-default-100 flex items-center justify-center text-default-400 mb-3 border border-divider/60">
          <HugeiconsIcon icon={UserGroupIcon} size={24} />
        </div>
        <h4 className="text-sm font-bold text-foreground mb-1">
          No hay participantes disponibles para evaluar en este grupo
        </h4>
        <p className="text-xs text-default-500 max-w-sm leading-relaxed">
          Para registrar evaluaciones, el turno o categoría debe contar con
          alumnos o jugadores activos en su lista de miembros.
        </p>
      </Card>
    );
  }

  // 2. Resolve selected participant (if any)
  const selectedParticipant = selectedParticipantId
    ? participants.find((p) => p.participantId === selectedParticipantId)
    : undefined;

  // 3. Fetch evaluations on server if participant is selected
  let evaluations: TeacherEvaluationItem[] = [];
  if (selectedParticipant) {
    const evalRes = await getGroupEvaluations(
      group.type,
      group.id,
      selectedParticipant.participantId,
    );
    if (!evalRes.error && evalRes.data?.evaluations) {
      evaluations = evalRes.data.evaluations;
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Columna Izquierda: Selector de Participantes */}
      <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Participantes ({participants.length})
          </h3>
          <span className="text-[11px] text-default-400">
            {group.type === "COURSE" ? "Alumnos de turno" : "Jugadores de categoría"}
          </span>
        </div>

        <TeacherParticipantSelector
          participants={participants}
          selectedParticipantId={selectedParticipantId}
        />
      </div>

      {/* Columna Derecha: Detalle e Historial de Evaluaciones */}
      <div className="lg:col-span-8 xl:col-span-8 flex flex-col gap-4">
        {!selectedParticipant ? (
          /* Estado Default Limpio: Ningún participante seleccionado */
          <Card className="p-8 sm:p-12 border border-dashed border-divider bg-content1/40 text-center flex flex-col items-center justify-center rounded-3xl min-h-[320px]">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20">
              <HugeiconsIcon icon={UserIcon} size={28} />
            </div>
            <h4 className="text-sm font-bold text-foreground mb-1.5">
              Selecciona un participante para consultar sus evaluaciones
            </h4>
            <p className="text-xs text-default-500 max-w-sm leading-relaxed mb-2">
              Elige a un estudiante o jugador del listado lateral para ver su
              historial cronológico de evaluaciones o registrar una nueva ficha.
            </p>
          </Card>
        ) : (
          /* Participante Seleccionado: Header de Identidad y Lista de Evaluaciones */
          <div className="flex flex-col gap-4">
            {/* Header del Participante Seleccionado */}
            <Card className="p-4 sm:p-5 border border-divider/60 bg-content1 rounded-3xl shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {selectedParticipant.imageUrl ? (
                    <img
                      src={selectedParticipant.imageUrl}
                      alt={`${selectedParticipant.firstName} ${selectedParticipant.lastName}`}
                      className="w-12 h-12 rounded-full object-cover shrink-0 border border-divider"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20">
                      {`${selectedParticipant.firstName?.[0] || ""}${selectedParticipant.lastName?.[0] || ""}`.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      {selectedParticipant.lastName}{" "}
                      {selectedParticipant.secondLastName || ""}{" "}
                      {selectedParticipant.firstName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-default-500 mt-0.5">
                      <span className="font-medium">
                        {selectedParticipant.type === "STUDENT"
                          ? "Estudiante"
                          : "Jugador"}
                      </span>
                      {selectedParticipant.documentNumber && (
                        <>
                          <span>•</span>
                          <span>CI: {selectedParticipant.documentNumber}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-500/10 text-success-600 border border-success-500/20">
                        Activo
                      </span>
                    </div>
                  </div>
                </div>

                {canCreate && (
                  <div className="shrink-0">
                    <EvaluationModalTrigger
                      mode="create"
                      groupType={group.type}
                      groupId={group.id}
                      groupName={group.name}
                      groupDetail={group.detail}
                      participant={selectedParticipant}
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* Historial de Evaluaciones */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Historial de Evaluaciones ({evaluations.length})
                </h4>
                <span className="text-[11px] text-default-400">
                  Orden cronológico descendente
                </span>
              </div>

              {evaluations.length === 0 ? (
                /* Historial Vacío */
                <Card className="p-8 border border-dashed border-divider bg-content1/40 text-center flex flex-col items-center justify-center rounded-3xl">
                  <div className="w-12 h-12 rounded-2xl bg-default-100 flex items-center justify-center text-default-400 mb-3 border border-divider/60">
                    <HugeiconsIcon icon={TaskDone01Icon} size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    Aún no hay evaluaciones registradas para este participante
                  </h4>
                  <p className="text-xs text-default-500 max-w-sm leading-relaxed mb-4">
                    Registra la primera evaluación técnica, táctica, física o
                    actitudinal para iniciar el seguimiento de su progresión deportiva.
                  </p>
                  {canCreate && (
                    <EvaluationModalTrigger
                      mode="create"
                      buttonLabel="Registrar primera evaluación"
                      groupType={group.type}
                      groupId={group.id}
                      groupName={group.name}
                      groupDetail={group.detail}
                      participant={selectedParticipant}
                    />
                  )}
                </Card>
              ) : (
                /* Lista de Tarjetas de Evaluación */
                <div className="flex flex-col gap-3">
                  {evaluations.map((item) => {
                    const evalDate = new Date(item.evaluationDate);
                    const formattedDate = evalDate.toLocaleDateString("es-BO", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });

                    return (
                      <Card
                        key={item.id}
                        className="p-4 sm:p-5 border border-divider/60 bg-content1 rounded-3xl shadow-sm hover:border-divider transition-all"
                      >
                        {/* Cabecera de la Evaluación */}
                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-divider/60">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-default-100 flex items-center justify-center text-default-600 shrink-0">
                              <HugeiconsIcon icon={Calendar01Icon} size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground">
                                {formattedDate}
                              </p>
                              <p className="text-[11px] text-default-500">
                                Evaluador:{" "}
                                <span className="font-semibold text-default-700">
                                  {item.evaluator.displayName}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Botón de Edición (Solo si canEdit y permiso UPDATE) */}
                          {item.canEdit && canUpdate && (
                            <EvaluationModalTrigger
                              mode="edit"
                              groupType={group.type}
                              groupId={group.id}
                              groupName={group.name}
                              groupDetail={group.detail}
                              participant={selectedParticipant}
                              evaluationToEdit={item}
                            />
                          )}
                        </div>

                        {/* Matriz de Calificaciones */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3.5">
                          {/* Técnica */}
                          <div className="p-2.5 rounded-2xl bg-default-50/70 border border-divider/40">
                            <p className="text-[10px] font-semibold text-default-500 uppercase tracking-wider mb-0.5">
                              Técnica
                            </p>
                            <p className="text-xs font-bold text-foreground">
                              {item.technicalScore !== null &&
                              item.technicalScore !== undefined ? (
                                <span>{item.technicalScore} / 100</span>
                              ) : (
                                <span className="text-default-400 font-normal italic">
                                  Sin evaluar
                                </span>
                              )}
                            </p>
                          </div>

                          {/* Táctica */}
                          <div className="p-2.5 rounded-2xl bg-default-50/70 border border-divider/40">
                            <p className="text-[10px] font-semibold text-default-500 uppercase tracking-wider mb-0.5">
                              Táctica
                            </p>
                            <p className="text-xs font-bold text-foreground">
                              {item.tacticalScore !== null &&
                              item.tacticalScore !== undefined ? (
                                <span>{item.tacticalScore} / 100</span>
                              ) : (
                                <span className="text-default-400 font-normal italic">
                                  Sin evaluar
                                </span>
                              )}
                            </p>
                          </div>

                          {/* Física */}
                          <div className="p-2.5 rounded-2xl bg-default-50/70 border border-divider/40">
                            <p className="text-[10px] font-semibold text-default-500 uppercase tracking-wider mb-0.5">
                              Física
                            </p>
                            <p className="text-xs font-bold text-foreground">
                              {item.physicalScore !== null &&
                              item.physicalScore !== undefined ? (
                                <span>{item.physicalScore} / 100</span>
                              ) : (
                                <span className="text-default-400 font-normal italic">
                                  Sin evaluar
                                </span>
                              )}
                            </p>
                          </div>

                          {/* Conducta */}
                          <div className="p-2.5 rounded-2xl bg-default-50/70 border border-divider/40">
                            <p className="text-[10px] font-semibold text-default-500 uppercase tracking-wider mb-0.5">
                              Conducta
                            </p>
                            <p className="text-xs font-bold text-foreground">
                              {item.behaviorScore !== null &&
                              item.behaviorScore !== undefined ? (
                                <span>{item.behaviorScore} / 100</span>
                              ) : (
                                <span className="text-default-400 font-normal italic">
                                  Sin evaluar
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Observaciones / Notas */}
                        {item.notes && (
                          <div className="p-3 rounded-2xl bg-default-100/50 border border-divider/60 text-xs text-default-700 leading-relaxed">
                            <p className="font-semibold text-[11px] text-default-500 mb-1 flex items-center gap-1.5">
                              <HugeiconsIcon icon={Note01Icon} size={13} />
                              <span>Observaciones</span>
                            </p>
                            <p className="whitespace-pre-wrap">{item.notes}</p>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
