import React from "react";
import { Chip, ProgressBar } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar02Icon } from "@hugeicons/core-free-icons";
import { IDashboardCoursesOccupancy } from "../interfaces/dashboard.interface";
import clsx from "clsx";

interface DashboardOccupancyCardProps {
  coursesOccupancy?: IDashboardCoursesOccupancy;
  className?: string;
}

export const DashboardOccupancyCard: React.FC<DashboardOccupancyCardProps> = ({
  coursesOccupancy,
  className,
}) => {
  if (
    !coursesOccupancy ||
    !coursesOccupancy.topOccupiedShifts ||
    coursesOccupancy.topOccupiedShifts.length === 0
  ) {
    return null;
  }

  const shiftsToShow = coursesOccupancy.topOccupiedShifts.slice(0, 5);

  return (
    <div
      className={clsx(
        "bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-[40px] shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-full transition-all duration-200 hover:border-slate-200/80 dark:hover:border-slate-700/80 hover:shadow-sm",
        className,
      )}
    >
      <div>
        {/* Header con resumen global */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <HugeiconsIcon icon={Calendar02Icon} size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold font-headline text-on-surface">
                Ocupación de turnos
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {coursesOccupancy.totalOccupied} / {coursesOccupancy.totalCapacity} cupos ocupados
              </p>
            </div>
          </div>
          <Chip
            color="accent"
            variant="soft"
            size="sm"
          >
            <Chip.Label>{coursesOccupancy.globalRate}% global</Chip.Label>
          </Chip>
        </div>

        {/* Lista de turnos más ocupados (máx 5) */}
        <div className="space-y-4">
          {shiftsToShow.map((shift) => {
            const isFull = shift.occupied >= shift.capacity;

            return (
              <div key={shift.courseSeasonShiftId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-on-surface truncate">
                      {shift.courseName}{" "}
                      <span className="text-slate-500 dark:text-slate-400 font-normal">
                        — {shift.shiftName}
                      </span>
                    </p>
                    {shift.disciplineName && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {shift.disciplineName}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    {isFull ? (
                      <Chip color="danger" variant="soft" size="sm">
                        <Chip.Label>Completo</Chip.Label>
                      </Chip>
                    ) : (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {shift.available} disponibles
                      </span>
                    )}
                    <span className="font-bold text-on-surface">
                      {shift.occupied} / {shift.capacity}
                    </span>
                  </div>
                </div>

                {/* Barra de progreso HeroUI */}
                <ProgressBar
                  aria-label={`Ocupación de ${shift.courseName} ${shift.shiftName}`}
                  className="w-full"
                  maxValue={100}
                  minValue={0}
                  value={Math.min(shift.rate, 100)}
                >
                  <ProgressBar.Track className="bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <ProgressBar.Fill
                      className={clsx(
                        "h-full transition-all duration-500 ease-out motion-reduce:transition-none",
                        isFull
                          ? "bg-rose-500"
                          : "bg-sky-500",
                      )}
                    />
                  </ProgressBar.Track>
                </ProgressBar>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer informativo */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
        <span>Cupos basados en inscripciones del ciclo vigente</span>
        <span className="font-medium text-slate-500 dark:text-slate-400">Top 5 turnos</span>
      </div>
    </div>
  );
};
