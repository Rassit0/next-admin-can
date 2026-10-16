import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import clsx from "clsx";

export type KpiAccentColor =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "secondary";

export interface DashboardKpiCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon: any;
  accentColor?: KpiAccentColor;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const DashboardKpiCard: React.FC<DashboardKpiCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = "primary",
  badge,
  children,
  footer,
  className,
}) => {
  const accentBarClasses: Record<KpiAccentColor, string> = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    info: "bg-sky-500",
    secondary: "bg-secondary",
  };

  const iconBgClasses: Record<KpiAccentColor, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    info: "bg-sky-500/10 text-sky-500",
    secondary: "bg-secondary/10 text-secondary",
  };

  return (
    <div
      className={clsx(
        "relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 motion-safe:hover:-translate-y-0.5 p-5 md:p-6 flex flex-col justify-between group",
        className,
      )}
    >
      {/* Franja de acento lateral */}
      <div
        className={clsx(
          "absolute left-0 top-0 bottom-0 w-1",
          accentBarClasses[accentColor],
        )}
      />

      {/* Encabezado: Título, Badge e Icono */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 block truncate">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {badge}
            <div
              className={clsx(
                "p-2.5 rounded-xl flex items-center justify-center shrink-0",
                iconBgClasses[accentColor],
              )}
            >
              <HugeiconsIcon icon={icon} size={20} />
            </div>
          </div>
        </div>

        {/* Valor principal y subtítulo */}
        <div className="mt-1">
          <div className="text-2xl md:text-3xl font-extrabold font-headline text-on-surface tracking-tight truncate">
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {subtitle}
            </div>
          )}
        </div>

        {/* Contenido secundario (progreso, desglose, etc.) */}
        {children && <div className="mt-4">{children}</div>}
      </div>

      {/* Pie opcional */}
      {footer && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};
