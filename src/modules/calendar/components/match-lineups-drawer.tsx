"use client";

import { useEffect, useState, useTransition } from "react";
import { Drawer } from "@heroui/react";
import { MatchLineupSidePanel } from "./match-lineups-side-panel";
import { getMatchLineup, IMatchCallUpWithLineup, IMatchLineupsResponse } from "../actions/match-lineups.action";
import { toast } from "sonner";
import { Spinner } from "@heroui/react";

import { IMatchCalendarMetadata } from "../interfaces/calendar.interface";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  matchId: string;
  metadata: IMatchCalendarMetadata;
  startDate: string;
  status?: string;
}

export const MatchLineupsDrawer = ({
  isOpen,
  onOpenChange,
  matchId,
  metadata,
  startDate,
  status,
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<IMatchLineupsResponse | null>(null);

  const [homeDirty, setHomeDirty] = useState(false);
  const [awayDirty, setAwayDirty] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startTransition(async () => {
        const res = await getMatchLineup(matchId);
        if (res) {
          setData(res);
        } else {
          toast.error("Error al cargar la planilla");
        }
      });
    } else {
      setData(null);
      setHomeDirty(false);
      setAwayDirty(false);
    }
  }, [isOpen, matchId]);

  const handleClose = () => {
    if (homeDirty || awayDirty) {
      if (
        !window.confirm(
          "Tienes cambios sin guardar en la planilla. ¿Deseas salir de todos modos?"
        )
      ) {
        return;
      }
    }
    onOpenChange(false);
  };

  const handleSuccess = (updatedData: IMatchLineupsResponse) => {
    // Only update the side that was saved, or just override. Since Smart Sync returns the updated side (e.g. data: { home: [...] })
    // Wait, the API returns `{ home: [...] }` if HOME was saved. We must merge it.
    setData((prev) => {
      if (!prev) return null;
      return {
        home: updatedData.home || prev.home,
        away: updatedData.away || prev.away,
      };
    });
  };

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={handleClose}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="w-full sm:max-w-5xl">
          <Drawer.CloseTrigger />
          <Drawer.Header className="border-b border-border pb-4">
            <Drawer.Heading className="text-xl font-bold">
              Planilla del partido
            </Drawer.Heading>
          </Drawer.Header>
          <Drawer.Body className="p-0 overflow-y-auto">
            <div className="flex h-full w-full bg-background p-6">
              {isPending || !data ? (
                <div className="flex items-center justify-center w-full h-full">
                  <Spinner size="lg" color="current" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-8 w-full h-full overflow-hidden relative">
                  <MatchLineupSidePanel
                    side="HOME"
                    matchId={matchId}
                    teamName={metadata.homeTeam?.name || "Local"}
                    categoryName={metadata.homeCategory?.name || null}
                    hasCategory={!!metadata.homeCategory}
                    callUps={data.home}
                    onSuccess={handleSuccess}
                    isDirty={homeDirty}
                    onDirtyChange={setHomeDirty}
                    isReadOnly={status !== "SCHEDULED"}
                  />
                  <div className="w-px bg-border h-full absolute left-1/2 -translate-x-1/2 top-0" />
                  <MatchLineupSidePanel
                    side="AWAY"
                    matchId={matchId}
                    teamName={metadata.awayTeam?.name || "Visitante"}
                    categoryName={metadata.awayCategory?.name || null}
                    hasCategory={!!metadata.awayCategory}
                    callUps={data.away}
                    onSuccess={handleSuccess}
                    isDirty={awayDirty}
                    onDirtyChange={setAwayDirty}
                    isReadOnly={status !== "SCHEDULED"}
                  />
                </div>
              )}
            </div>
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
