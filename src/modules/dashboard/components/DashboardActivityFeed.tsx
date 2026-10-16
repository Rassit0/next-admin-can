import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { TransactionHistoryIcon } from "@hugeicons/core-free-icons";
import clsx from "clsx";
import { IDashboardActivityItem } from "../interfaces/dashboard.interface";
import { DashboardActivityItem } from "./DashboardActivityItem";

interface DashboardActivityFeedProps {
  items: IDashboardActivityItem[];
  className?: string;
}

export const DashboardActivityFeed: React.FC<DashboardActivityFeedProps> = ({
  items,
  className,
}) => {
  return (
    <div
      className={clsx(
        "bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-[40px] shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col justify-between h-full transition-all duration-200 hover:border-slate-200/80 dark:hover:border-slate-700/80 hover:shadow-sm",
        className,
      )}
    >
      <div>
        {/* Header del Feed */}
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <HugeiconsIcon icon={TransactionHistoryIcon} size={18} />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold font-headline text-on-surface">
                Actividad reciente
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Operaciones del sistema
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {items.length} eventos
            </span>
          )}
        </div>

        {/* Lista de eventos o Empty State */}
        {items.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            <HugeiconsIcon
              icon={TransactionHistoryIcon}
              size={32}
              className="mx-auto mb-2 opacity-40"
            />
            <p className="text-xs font-medium">No hay actividad reciente registrada.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 -mx-1">
            {items.map((item) => (
              <DashboardActivityItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
