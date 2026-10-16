import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import clsx from "clsx";
import { IDashboardActivityItem } from "../interfaces/dashboard.interface";
import {
  getActivityPresentation,
  getActivityUserDisplayName,
  formatActivityAmount,
  formatRelativeTime,
} from "../utils/dashboard-activity.utils";

interface DashboardActivityItemProps {
  item: IDashboardActivityItem;
}

export const DashboardActivityItem: React.FC<DashboardActivityItemProps> = ({
  item,
}) => {
  const presentation = getActivityPresentation(item.actionType);
  const userDisplayName = getActivityUserDisplayName(item.user);
  const formattedAmount = formatActivityAmount(item.context);
  const relativeTime = formatRelativeTime(item.createdAt);

  return (
    <div className="py-3 px-1 flex items-start gap-3 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-xl">
      {/* Icono contextual de la acción */}
      <div
        className={clsx(
          "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
          presentation.iconBgClass,
          presentation.iconColorClass,
        )}
      >
        <HugeiconsIcon icon={presentation.icon} size={16} />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs text-on-surface truncate">
            <span className="font-bold">{userDisplayName}</span>
            <span className="text-slate-500 dark:text-slate-400">
              {" "}
              · {item.context.title}
            </span>
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium shrink-0 whitespace-nowrap">
            {relativeTime}
          </span>
        </div>

        {/* Detalle secundario o descripción */}
        {item.context.description && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {item.context.description}
          </p>
        )}

        {/* Monto financiero o identificador */}
        {(formattedAmount || item.context.identifier) && (
          <div className="flex items-center gap-2 mt-1">
            {formattedAmount && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {formattedAmount}
              </span>
            )}
            {item.context.identifier && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                Ref: {item.context.identifier}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
