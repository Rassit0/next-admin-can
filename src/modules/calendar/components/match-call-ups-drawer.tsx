"use client";

import { Drawer, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import {
  getMatchCallUps,
  getMatchCallUpCandidates,
  IMatchCallUpsResponse,
  IMatchCallUpCandidatesResponse,
} from "../actions/match-call-ups.action";
import { MatchCallUpSidePanel } from "./match-call-up-side-panel";
import { IMatchCalendarMetadata } from "../interfaces/calendar.interface";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  matchId: string;
  metadata: IMatchCalendarMetadata;
  startDate: string; // Used for context info in header
  status?: string;
}

export const MatchCallUpsDrawer = ({
  isOpen,
  onOpenChange,
  matchId,
  metadata,
  startDate,
  status,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [callUps, setCallUps] = useState<IMatchCallUpsResponse | null>(null);
  const [candidates, setCandidates] =
    useState<IMatchCallUpCandidatesResponse | null>(null);

  // Track dirty state to prompt user on close if they have unsaved changes
  const [isHomeDirty, setIsHomeDirty] = useState(false);
  const [isAwayDirty, setIsAwayDirty] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [callUpsRes, candidatesRes] = await Promise.all([
        getMatchCallUps(matchId),
        getMatchCallUpCandidates(matchId),
      ]);

      if (callUpsRes.error) {
        toast.error("Error al cargar la convocatoria");
      } else {
        setCallUps(callUpsRes.data || null);
      }

      if (candidatesRes.error) {
        toast.error("Error al cargar los candidatos");
      } else {
        setCandidates(candidatesRes.data || null);
      }

      // Reset dirty state after loading
      setIsHomeDirty(false);
      setIsAwayDirty(false);
    } catch {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleSideSuccess = (
    side: "HOME" | "AWAY",
    res: IMatchCallUpsResponse,
  ) => {
    // The backend returns the full updated state (both sides and configuredAt)
    setCallUps(res);

    // Only reset the dirty state for the side that was successfully saved
    if (side === "HOME") {
      setIsHomeDirty(false);
    } else {
      setIsAwayDirty(false);
    }
  };

  useEffect(() => {
    if (isOpen && matchId) {
      fetchAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, matchId]);

  const matchTitle = `${metadata.homeTeam?.name || "N/A"} vs ${metadata.awayTeam?.name || "N/A"}`;
  const matchDateFormatted = new Date(startDate).toLocaleString();

  const handleOpenChange = (open: boolean) => {
    if (!open && (isHomeDirty || isAwayDirty)) {
      if (
        !window.confirm("Tienes cambios sin guardar. ÃÂ¿Cerrar de todos modos?")
      ) {
        return; // Prevent closing
      }
    }
    onOpenChange(open);
  };

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="w-full sm:max-w-4xl">
          <Drawer.CloseTrigger />
          <Drawer.Header className="border-b border-border flex flex-col gap-1 pb-4">
            <div className="flex items-center gap-2 text-foreground">
              <HugeiconsIcon icon={UserGroupIcon} size={24} />
              <Drawer.Heading className="text-xl font-bold">
                Convocados
              </Drawer.Heading>
            </div>
            <p className="text-sm text-muted">
              {matchTitle} - {matchDateFormatted}
            </p>
          </Drawer.Header>

          <Drawer.Body className="gap-6 p-4 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner color="current" />
              </div>
            ) : callUps && candidates ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                <MatchCallUpSidePanel
                  side="HOME"
                  matchId={matchId}
                  teamName={metadata.homeTeam?.name || "Local"}
                  categoryName={metadata.homeCategory?.name || null}
                  hasCategory={!!metadata.homeCategory}
                  candidates={candidates.home}
                  initialCallUps={callUps.home}
                  oppositeCallUps={callUps.away}
                  onSuccess={(res) => handleSideSuccess("HOME", res)}
                  isDirty={isHomeDirty}
                  onDirtyChange={setIsHomeDirty}
                  configuredAt={callUps.homeConfiguredAt}
                  isReadOnly={status !== "SCHEDULED"}
                />
                <div className="hidden md:block w-px bg-border absolute left-1/2 top-4 bottom-4 -translate-x-1/2" />
                <MatchCallUpSidePanel
                  side="AWAY"
                  matchId={matchId}
                  teamName={metadata.awayTeam?.name || "Visitante"}
                  categoryName={metadata.awayCategory?.name || null}
                  hasCategory={!!metadata.awayCategory}
                  candidates={candidates.away}
                  initialCallUps={callUps.away}
                  oppositeCallUps={callUps.home}
                  onSuccess={(res) => handleSideSuccess("AWAY", res)}
                  isDirty={isAwayDirty}
                  onDirtyChange={setIsAwayDirty}
                  configuredAt={callUps.awayConfiguredAt}
                  isReadOnly={status !== "SCHEDULED"}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 flex-col gap-2">
                <p className="text-sm text-muted">
                  No se pudo cargar la información.
                </p>
                <button
                  onClick={fetchAll}
                  className="text-primary-500 text-sm hover:underline"
                >
                  Reintentar
                </button>
              </div>
            )}
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
