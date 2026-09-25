"use client";

import { useState, useEffect, useMemo } from "react";
import { Button, Checkbox } from "@heroui/react";
import { toast } from "sonner";
import { SearchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  IMatchCallUpCandidate,
  updateMatchCallUpSide,
  IMatchCallUpsResponse,
} from "../actions/match-call-ups.action";
import { usePermissions } from "@/shared/providers/PermissionsProvider";

interface Props {
  side: "HOME" | "AWAY";
  matchId: string;
  teamName: string;
  categoryName: string | null;
  hasCategory: boolean;
  candidates: IMatchCallUpCandidate[];
  initialCallUps: { playerId: string; isGuest: boolean; player: any }[];
  oppositeCallUps: { playerId: string }[];
  onSuccess: (res: IMatchCallUpsResponse) => void;
  isDirty: boolean;
  onDirtyChange: (isDirty: boolean) => void;
  configuredAt: string | null;
  isReadOnly?: boolean;
}

export const MatchCallUpSidePanel = ({
  side,
  matchId,
  teamName,
  categoryName,
  hasCategory,
  candidates,
  initialCallUps,
  oppositeCallUps,
  onSuccess,
  isDirty,
  onDirtyChange,
  configuredAt,
  isReadOnly = false,
}: Props) => {
  const permissions = usePermissions();
  const canUpdateMatches =
    permissions.includes("UPDATE_MATCHES") && !isReadOnly;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const needsInitialSave =
    configuredAt === null && hasCategory && candidates.length > 0;

  // Initialize selectedIds from initialCallUps or select all candidates by default if none
  useEffect(() => {
    let ids: Set<string>;

    // Si NUNCA ha sido configurado, preseleccionar todos los elegibles
    if (configuredAt === null && hasCategory) {
      ids = new Set(candidates.map((c) => c.playerId));
    } else {
      // Si ya fue configurado (incluso vací­o explí­citamente), respetar lo que viene del backend
      ids = new Set(initialCallUps.map((c) => c.playerId));
    }

    setSelectedIds(ids);
    // DIRTY NO SE MARCA AL INICIO, ya que la preselección automática no es un cambio manual del usuario
    onDirtyChange(false);
  }, [initialCallUps, hasCategory, candidates, configuredAt]);

  const filteredCandidates = useMemo(() => {
    if (!searchTerm) return candidates;
    const lowerSearch = searchTerm.toLowerCase();
    return candidates.filter(
      (c) =>
        c.firstName.toLowerCase().includes(lowerSearch) ||
        c.lastName.toLowerCase().includes(lowerSearch) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(lowerSearch),
    );
  }, [candidates, searchTerm]);

  const toggleSelection = (playerId: string) => {
    if (!canUpdateMatches) return;
    const newSelected = new Set(selectedIds);
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId);
    } else {
      newSelected.add(playerId);
    }
    setSelectedIds(newSelected);

    // Check if dirty
    // The "clean" state depends on whether it's the initial preselection or the backend state
    let baseIds: Set<string>;
    if (configuredAt === null && hasCategory) {
      baseIds = new Set(candidates.map((c) => c.playerId));
    } else {
      baseIds = new Set(initialCallUps.map((c) => c.playerId));
    }

    let dirty = false;
    if (newSelected.size !== baseIds.size) {
      dirty = true;
    } else {
      for (const id of newSelected) {
        if (!baseIds.has(id)) {
          dirty = true;
          break;
        }
      }
    }
    onDirtyChange(dirty);
  };

  const handleSave = async () => {
    if (selectedIds.size === 0 && initialCallUps.length > 0) {
      const isConfirmed = window.confirm(
        `ÃÂ¿Vaciar toda la convocatoria ${side === "HOME" ? "local" : "visitante"}?`,
      );
      if (!isConfirmed) return;
    }

    setIsSaving(true);
    const playersPayload = Array.from(selectedIds).map((id) => ({
      playerId: id,
      isGuest: false, // B2 Rule: Guest players are always false
    }));

    try {
      const res = await updateMatchCallUpSide(matchId, side, playersPayload);
      if (res.error || !res.data) {
        toast.error(res.error || "Error al guardar convocatoria");
      } else {
        toast.success(
          `Convocatoria ${side === "HOME" ? "local" : "visitante"} actualizada`,
        );
        onDirtyChange(false);
        onSuccess(res.data); // Return specific updated data
      }
    } catch (e) {
      toast.error("Ocurrió un error inesperado al guardar.");
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
          {categoryName || "Sin categorí­a asignada"}
        </p>
      </div>

      {!hasCategory ? (
        <div className="bg-warning/10 p-4 rounded-lg flex flex-col items-center justify-center text-center h-48 border border-warning/20">
          <p className="text-sm text-warning font-semibold">
            Este equipo no tiene una categorí­a administrada para gestionar
            convocados.
          </p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center h-48 text-muted">
          <p className="text-sm">
            No hay jugadores elegibles para este partido.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">
                Seleccionados: {selectedIds.size}
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

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 pb-16">
              {filteredCandidates.map((candidate) => {
                const isSelected = selectedIds.has(candidate.playerId);
                const isInOpposite = oppositeCallUps.some(
                  (c) => c.playerId === candidate.playerId,
                );
                const isConflict = isSelected && isInOpposite;
                const isDisabled =
                  !canUpdateMatches || (isInOpposite && !isSelected);

                return (
                  <div
                    key={candidate.playerId}
                    className={`flex items-center justify-between p-2 rounded-md transition-colors ${
                      isDisabled
                        ? "opacity-60 bg-default-50"
                        : "hover:bg-default-100 cursor-pointer"
                    } ${isConflict ? "border border-danger bg-danger-50/50" : ""}`}
                    onClick={() => {
                      if (!isDisabled) toggleSelection(candidate.playerId);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                        {candidate.firstName[0]}
                        {candidate.lastName[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {candidate.firstName} {candidate.lastName}
                        </span>
                        {isConflict ? (
                          <span className="text-xs text-danger font-semibold">
                            En equipo contrario
                          </span>
                        ) : isInOpposite ? (
                          <span className="text-xs text-muted font-semibold">
                            En equipo contrario
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <Checkbox
                      id={`checkbox-${candidate.playerId}`}
                      isSelected={isSelected}
                      onChange={() => toggleSelection(candidate.playerId)}
                      isDisabled={isDisabled}
                    >
                      <Checkbox.Content>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox.Content>
                    </Checkbox>
                  </div>
                );
              })}
              {filteredCandidates.length === 0 && (
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
                isDisabled={(!isDirty && !needsInitialSave) || isSaving}
                isPending={isSaving}
                onPress={handleSave}
              >
                Guardar convocatoria {side === "HOME" ? "Local" : "Visitante"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
