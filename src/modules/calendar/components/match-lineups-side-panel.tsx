"use client";

import { useState, useEffect, useMemo } from "react";
import { Button, Checkbox, Input } from "@heroui/react";
import { toast } from "sonner";
import { SearchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  IMatchCallUpWithLineup,
  updateMatchLineupSide,
  IMatchLineupsResponse,
} from "../actions/match-lineups.action";
import { usePermissions } from "@/shared/providers/PermissionsProvider";

interface Props {
  side: "HOME" | "AWAY";
  matchId: string;
  teamName: string;
  categoryName: string | null;
  hasCategory: boolean;
  callUps: IMatchCallUpWithLineup[];
  onSuccess: (res: IMatchLineupsResponse) => void;
  isDirty: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  isReadOnly?: boolean;
}

interface EditState {
  participated: boolean;
  isStarter: boolean;
  minutesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export const MatchLineupSidePanel = ({
  side,
  matchId,
  teamName,
  categoryName,
  hasCategory,
  callUps,
  onSuccess,
  isDirty,
  onDirtyChange,
  isReadOnly = false,
}: Props) => {
  const permissions = usePermissions();
  const canUpdateMatches =
    permissions.includes("UPDATE_MATCHES") && !isReadOnly;

  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editStates, setEditStates] = useState<Record<string, EditState>>({});

  useEffect(() => {
    // Inicializar el estado de ediciiÂ³n desde la base de datos (lo persistido)
    const newStates: Record<string, EditState> = {};
    for (const c of callUps) {
      if (c.lineup) {
        newStates[c.id] = {
          participated: true,
          isStarter: c.lineup.isStarter,
          minutesPlayed: c.lineup.minutesPlayed,
          goals: c.lineup.goals,
          assists: c.lineup.assists,
          yellowCards: c.lineup.yellowCards,
          redCards: c.lineup.redCards,
        };
      } else {
        newStates[c.id] = {
          participated: false,
          isStarter: false,
          minutesPlayed: 0,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        };
      }
    }
    setEditStates(newStates);
    onDirtyChange(false);
  }, [callUps]); // Note: only depend on backend source of truth

  const updateField = (
    callUpId: string,
    field: keyof EditState,
    value: boolean | number,
  ) => {
    if (!canUpdateMatches) return;
    setEditStates((prev) => {
      const newState = { ...prev };
      newState[callUpId] = { ...newState[callUpId], [field]: value };

      // If participated changes to false, maybe reset other fields to default or leave them (we won't send them anyway)
      return newState;
    });
    onDirtyChange(true);
  };

  const filteredCallUps = useMemo(() => {
    if (!searchTerm) return callUps;
    const lowerSearch = searchTerm.toLowerCase();
    return callUps.filter(
      (c) =>
        c.player.person.name.toLowerCase().includes(lowerSearch) ||
        c.player.person.lastName.toLowerCase().includes(lowerSearch) ||
        `${c.player.person.name} ${c.player.person.lastName}`
          .toLowerCase()
          .includes(lowerSearch),
    );
  }, [callUps, searchTerm]);

  const statsCount = useMemo(() => {
    let participated = 0;
    let starters = 0;
    Object.values(editStates).forEach((state) => {
      if (state.participated) {
        participated++;
        if (state.isStarter) starters++;
      }
    });
    return { participated, starters };
  }, [editStates]);

  const handleSave = async () => {
    // 1. Validar destrutividad
    const destructiveRemovals = [];
    for (const c of callUps) {
      if (c.lineup && !editStates[c.id]?.participated) {
        // Estaba persistido y ahora se le quitiÂ³ participiÂ³
        const L = c.lineup;
        if (
          L.isStarter ||
          L.minutesPlayed > 0 ||
          L.goals > 0 ||
          L.assists > 0 ||
          L.yellowCards > 0 ||
          L.redCards > 0
        ) {
          destructiveRemovals.push(
            `${c.player.person.name} ${c.player.person.lastName}`,
          );
        }
      }
    }

    if (destructiveRemovals.length > 0) {
      const isMultiple = destructiveRemovals.length > 1;
      const msg = isMultiple
        ? `Se eliminariÂ¡n la participaciiÂ³n y estadiÂ­sticas de ${destructiveRemovals.length} jugadores.\n\nÃÂ¿Deseas continuar?`
        : `Se eliminariÂ¡n la participaciiÂ³n y estadiÂ­sticas de ${destructiveRemovals[0]}.\n\nÃÂ¿Deseas continuar?`;
      if (!window.confirm(msg)) return;
    }

    // 2. Armar payload
    setIsSaving(true);
    const payload = Object.entries(editStates)
      .filter(([_, state]) => state.participated)
      .map(([callUpId, state]) => ({
        callUpId,
        isStarter: state.isStarter,
        minutesPlayed: state.minutesPlayed,
        goals: state.goals,
        assists: state.assists,
        yellowCards: state.yellowCards,
        redCards: state.redCards,
      }));

    try {
      const res = await updateMatchLineupSide(matchId, side, payload);
      if (res.error || !res.data) {
        toast.error(res.error || "Error al guardar planilla");
      } else {
        toast.success(
          `Planilla del equipo ${side === "HOME" ? "local" : "visitante"} actualizada`,
        );
        onDirtyChange(false);
        onSuccess(res.data as IMatchLineupsResponse);
      }
    } catch (e) {
      toast.error("OcurriiÂ³ un error inesperado al guardar.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4 relative">
      <div className="flex flex-col gap-1 border-b border-border pb-3">
        <h3 className="font-bold text-lg text-foreground uppercase">
          {side === "HOME" ? "Local" : "Visitante"}
        </h3>
        <p className="text-sm font-semibold">{teamName}</p>
        <p className="text-xs text-muted">
          {categoryName || "Sin categoriÂ­a asignada"}
        </p>
      </div>

      {!hasCategory ? (
        <div className="bg-warning/10 p-4 rounded-lg flex flex-col items-center justify-center text-center h-48 border border-warning/20">
          <p className="text-sm text-warning font-semibold">
            Este equipo no tiene una categoriÂ­a gestionada.
          </p>
        </div>
      ) : callUps.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center h-48 text-muted bg-default-50 rounded-lg p-4">
          <p className="text-sm font-medium">No hay convocados</p>
          <p className="text-xs mt-1">
            Primero debes guardar la convocatoria para registrar participaciiÂ³n.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 flex-1 overflow-hidden">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-muted">
                Convocados: {callUps.length}
              </span>
              <span className="font-semibold text-primary">
                Participaron: {statsCount.participated}
              </span>
              <span className="font-semibold text-secondary">
                Titulares: {statsCount.starters}
              </span>
              {isReadOnly && (
                <span className="text-xs text-danger font-semibold">
                  Solo lectura
                </span>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HugeiconsIcon
                  icon={SearchIcon}
                  size={16}
                  className="text-muted"
                />
              </div>
              <input
                type="text"
                placeholder="Buscar jugador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-default-100"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-16">
              {filteredCallUps.map((c) => {
                const state = editStates[c.id] || {
                  participated: false,
                  isStarter: false,
                  minutesPlayed: 0,
                  goals: 0,
                  assists: 0,
                  yellowCards: 0,
                  redCards: 0,
                };
                const isDisabled = !canUpdateMatches;

                return (
                  <div
                    key={c.id}
                    className={`flex flex-col gap-2 p-3 rounded-md transition-colors border border-border ${
                      state.participated
                        ? "bg-default-50"
                        : "bg-transparent opacity-80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                          {c.player.person.name[0]}
                          {c.player.person.lastName[0]}
                        </div>
                        <span className="text-sm font-medium">
                          {c.player.person.name} {c.player.person.lastName}
                        </span>
                      </div>

                      <div className="flex gap-4">
                        <Checkbox
                          id={`participated-${c.id}`}
                          isSelected={state.participated}
                          onChange={(isSelected) =>
                            updateField(c.id, "participated", isSelected)
                          }
                          isDisabled={isDisabled}
                        >
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Content>
                            <span className="text-sm">ParticipiÂ³</span>
                          </Checkbox.Content>
                        </Checkbox>

                        <Checkbox
                          id={`starter-${c.id}`}
                          isSelected={state.isStarter}
                          onChange={(isSelected) =>
                            updateField(c.id, "isStarter", isSelected)
                          }
                          isDisabled={isDisabled || !state.participated}
                        >
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Content>
                            <span className="text-sm">Titular</span>
                          </Checkbox.Content>
                        </Checkbox>
                      </div>
                    </div>

                    {state.participated && (
                      <div className="grid grid-cols-5 gap-2 mt-2 pt-2 border-t border-border/50">
                        <div className="flex flex-col">
                          <label className="text-[10px] text-muted font-semibold uppercase mb-1">
                            Min
                          </label>
                          <Input
                            type="number"
                            min={0}
                            value={state.minutesPlayed.toString()}
                            onChange={(e) =>
                              updateField(
                                c.id,
                                "minutesPlayed",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            disabled={isDisabled}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] text-muted font-semibold uppercase mb-1">
                            Goles
                          </label>
                          <Input
                            type="number"
                            min={0}
                            value={state.goals.toString()}
                            onChange={(e) =>
                              updateField(
                                c.id,
                                "goals",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            disabled={isDisabled}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] text-muted font-semibold uppercase mb-1">
                            Asist
                          </label>
                          <Input
                            type="number"
                            min={0}
                            value={state.assists.toString()}
                            onChange={(e) =>
                              updateField(
                                c.id,
                                "assists",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            disabled={isDisabled}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] text-muted font-semibold uppercase mb-1">
                            Ama
                          </label>
                          <Input
                            type="number"
                            min={0}
                            value={state.yellowCards.toString()}
                            onChange={(e) =>
                              updateField(
                                c.id,
                                "yellowCards",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            disabled={isDisabled}
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] text-muted font-semibold uppercase mb-1">
                            Roj
                          </label>
                          <Input
                            type="number"
                            min={0}
                            value={state.redCards.toString()}
                            onChange={(e) =>
                              updateField(
                                c.id,
                                "redCards",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            disabled={isDisabled}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredCallUps.length === 0 && (
                <p className="text-xs text-muted text-center pt-4">
                  No se encontraron resultados
                </p>
              )}
            </div>
          </div>

          {canUpdateMatches && (
            <div className="absolute bottom-0 left-0 right-0 bg-background pt-2 border-t border-border">
              <Button
                variant="primary"
                className="w-full"
                isDisabled={!isDirty || isSaving}
                isPending={isSaving}
                onPress={handleSave}
              >
                Guardar planilla {side === "HOME" ? "Local" : "Visitante"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
