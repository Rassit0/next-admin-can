import React from "react";
import { Chip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Alert02Icon,
  CheckmarkCircle01Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { IDashboardAlertItem } from "../interfaces/dashboard.interface";
import clsx from "clsx";

interface DashboardAlertsCardProps {
  alerts?: IDashboardAlertItem[];
  className?: string;
}

export const DashboardAlertsCard: React.FC<DashboardAlertsCardProps> = ({
  alerts,
  className,
}) => {
  const alertList = alerts || [];

  const getAlertSeverityPresentation = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return {
          icon: AlertCircleIcon,
          color: "danger" as const,
          bgClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        };
      case "WARNING":
        return {
          icon: Alert02Icon,
          color: "warning" as const,
          bgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        };
      case "INFO":
      default:
        return {
          icon: CheckmarkCircle01Icon,
          color: "accent" as const,
          bgClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
        };
    }
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
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <HugeiconsIcon icon={Alert02Icon} size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold font-headline text-on-surface">
                Alertas operativas
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Atención requerida
              </p>
            </div>
          </div>
          {alertList.length > 0 && (
            <Chip color="warning" variant="soft" size="sm">
              <Chip.Label>{alertList.length} activas</Chip.Label>
            </Chip>
          )}
        </div>

        {/* Lista de alertas o estado vacío */}
        {alertList.length === 0 ? (
          <div className="py-10 text-center text-slate-400 dark:text-slate-500 space-y-2">
            <HugeiconsIcon
              icon={CheckmarkCircle01Icon}
              size={32}
              className="mx-auto opacity-30 text-emerald-500"
            />
            <p className="text-xs font-medium">
              Sin alertas operativas pendientes.
            </p>
            <p className="text-[11px] text-slate-400">
              El estado de turnos y cobranzas se encuentra al día.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertList.map((alert) => {
              const pres = getAlertSeverityPresentation(alert.severity);

              return (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex items-start justify-between gap-3 transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/70"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={clsx(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                        pres.bgClass,
                      )}
                    >
                      <HugeiconsIcon icon={pres.icon} size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-on-surface truncate">
                          {alert.title}
                        </p>
                        {alert.count !== undefined && alert.count > 0 && (
                          <Chip
                            color={pres.color}
                            variant="soft"
                            size="sm"
                            className="h-4 text-[10px]"
                          >
                            <Chip.Label>{alert.count}</Chip.Label>
                          </Chip>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  {alert.actionUrl && (
                    <Link
                      href={alert.actionUrl}
                      className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-primary transition-colors mt-0.5"
                      title={alert.actionLabel || "Ver detalle"}
                    >
                      <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
