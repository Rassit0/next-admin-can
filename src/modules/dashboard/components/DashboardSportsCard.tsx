import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Basketball01Icon,
  Location01Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { Chip } from "@heroui/react";
import { IDashboardMatchItem } from "../interfaces/dashboard.interface";
import clsx from "clsx";

interface DashboardSportsCardProps {
  matches: IDashboardMatchItem[];
  className?: string;
}

export const DashboardSportsCard: React.FC<DashboardSportsCardProps> = ({
  matches,
  className,
}) => {
  const formatMatchDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat("es-BO", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const getResultPresentation = (match: IDashboardMatchItem) => {
    if (match.homeScore !== null && match.homeScore !== undefined &&
        match.awayScore !== null && match.awayScore !== undefined) {
      return {
        isPlayed: true,
        scoreText: `${match.homeScore} - ${match.awayScore}`,
        statusText: "Finalizado",
        chipColor: "default" as const,
      };
    }
    return {
      isPlayed: false,
      scoreText: "VS",
      statusText: "Programado",
      chipColor: "accent" as const,
    };
  };

  return (
    <div
      className={clsx(
        "bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-[40px] shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-full transition-all duration-200 hover:border-slate-200/80 dark:hover:border-slate-700/80 hover:shadow-sm",
        className,
      )}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <HugeiconsIcon icon={Basketball01Icon} size={18} />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold font-headline text-on-surface">
                Actividad deportiva
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Próximos partidos y resultados
              </p>
            </div>
          </div>
          {matches.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {matches.length} partidos
            </span>
          )}
        </div>

        {/* Lista de partidos */}
        {matches.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            <HugeiconsIcon
              icon={Basketball01Icon}
              size={28}
              className="mx-auto mb-2 opacity-50"
            />
            <p className="text-xs">No hay actividad deportiva próxima.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {matches.map((match) => {
              const pres = getResultPresentation(match);
              const formattedDate = formatMatchDate(match.event.startDate);

              return (
                <div
                  key={match.id}
                  className="py-3 px-1 flex flex-col gap-1.5 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-xl"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-on-surface truncate max-w-[42%]">
                      {match.homeTeam?.name || "Local"}
                    </span>
                    <span
                      className={clsx(
                        "text-[11px] font-extrabold px-2 py-0.5 rounded-md",
                        pres.isPlayed
                          ? "bg-slate-100 dark:bg-slate-800 text-on-surface font-mono"
                          : "text-slate-400 dark:text-slate-500",
                      )}
                    >
                      {pres.scoreText}
                    </span>
                    <span className="font-bold text-on-surface truncate max-w-[42%] text-right">
                      {match.awayTeam?.name || "Visitante"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-1 truncate">
                      <HugeiconsIcon icon={Calendar03Icon} size={11} className="shrink-0" />
                      <span className="truncate">{formattedDate}</span>
                      {match.event.location?.name && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600">·</span>
                          <HugeiconsIcon icon={Location01Icon} size={11} className="shrink-0" />
                          <span className="truncate">{match.event.location.name}</span>
                        </>
                      )}
                    </div>
                    <Chip color={pres.chipColor} variant="soft" size="sm" className="h-4 text-[9px]">
                      <Chip.Label>{pres.statusText}</Chip.Label>
                    </Chip>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>Partidos del club</span>
        <span className="font-medium text-slate-500 dark:text-slate-400">CAN Oruro</span>
      </div>
    </div>
  );
};
