"use client";

import { Chip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowRight02Icon,
  Calendar03Icon,
  CalendarMinus02Icon,
} from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/ui";
import Link from "next/link";
import clsx from "clsx";
import { IDashboardAlert } from "@/modules/accounting-dashboard/interfaces/dashboard.interface";

interface Props {
  alerts: IDashboardAlert[];
}

const SEVERITY_STYLES = {
  danger: {
    badge: "bg-rose-500/12 text-rose-600 dark:text-rose-400 border-rose-500/20",
    chip: "danger" as const,
  },
  warning: {
    badge: "bg-amber-500/12 text-amber-600 dark:text-amber-400 border-amber-500/20",
    chip: "warning" as const,
  },
  success: {
    badge: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    chip: "success" as const,
  },
  accent: {
    badge: "bg-sky-500/12 text-sky-600 dark:text-sky-400 border-sky-500/20",
    chip: "accent" as const,
  },
  default: {
    badge: "bg-slate-500/12 text-slate-600 dark:text-slate-400 border-slate-500/20",
    chip: "default" as const,
  },
};

export const AccountingAlerts = ({ alerts }: Props) => {
  const receivables = alerts.filter((a) => a.type === "RECEIVABLE");
  const payables = alerts.filter((a) => a.type === "PAYABLE");
  const totalAlerts = alerts.reduce((acc, curr) => acc + (curr.count || 0), 0);

  const renderAlert = (alert: IDashboardAlert, index: number) => {
    const isDanger = alert.severity === "danger";
    const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.default;

    return (
      <div
        key={`${alert.context}-${alert.type}-${index}`}
        className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface-secondary/60 p-3 hover:bg-surface-secondary transition-colors"
      >
        <div className="flex items-start gap-3 min-w-0">
          <span
            className={clsx(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border mt-0.5",
              style.badge,
            )}
          >
            {isDanger ? (
              <HugeiconsIcon icon={Alert02Icon} size={18} />
            ) : (
              <HugeiconsIcon icon={CalendarMinus02Icon} size={18} />
            )}
          </span>

          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-foreground leading-tight">
              {alert.label}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="text-[10px] text-foreground/55 truncate max-w-[120px] sm:max-w-none">
                {alert.context === "StudentCharges"
                  ? "Cuotas escolares"
                  : alert.context === "Memberships"
                    ? "Membresías"
                    : alert.context === "AccountCharges"
                      ? "Gastos / Cobros administrativos"
                      : alert.context}
              </span>
              <Chip
                className="h-4.5 text-[10px] font-semibold"
                color={style.chip}
                size="sm"
                variant="soft"
              >
                {alert.count} {alert.count === 1 ? "cargo" : "cargos"}
              </Chip>
            </div>
          </div>
        </div>

        <Link
          aria-label={`Ver detalle de ${alert.label}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-surface text-foreground/70 hover:bg-surface-tertiary hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          href={alert.href}
        >
          <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
        </Link>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-border/80 bg-surface/90 dark:bg-surface-secondary/70 p-5 sm:p-6 shadow-xs h-full">
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/12 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <HugeiconsIcon icon={Alert02Icon} size={18} />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-foreground">
                  Atención inmediata
                </h3>
                <InfoTooltip text="Lista de compromisos y obligaciones con vencimiento dentro de los próximos 7 días o ya vencidos que requieren seguimiento del club." />
              </div>
              <p className="text-xs text-foreground/55">
                Compromisos vencidos o próximos a vencer (7 días)
              </p>
            </div>
          </div>

          <span
            className={clsx(
              "rounded-full px-2.5 py-0.5 text-[11px] font-bold border",
              totalAlerts > 0
                ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                : "border-border/70 bg-surface-secondary text-foreground/60",
            )}
          >
            {totalAlerts} {totalAlerts === 1 ? "alerta" : "alertas"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Columna Cobros */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/55 flex items-center gap-1.5">
                <HugeiconsIcon icon={Calendar03Icon} size={14} />
                Cobros pendientes
              </span>
              <span className="text-[10px] font-semibold text-foreground/50">
                {receivables.reduce((a, b) => a + (b.count || 0), 0)}
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {receivables.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 p-6 text-center text-xs text-foreground/50">
                  No hay cobros vencidos o próximos a vencer.
                </div>
              ) : (
                receivables.map(renderAlert)
              )}
            </div>
          </div>

          {/* Columna Pagos */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <HugeiconsIcon icon={Calendar03Icon} size={14} />
                Pagos pendientes
              </span>
              <span className="text-[10px] font-semibold text-foreground/50">
                {payables.reduce((a, b) => a + (b.count || 0), 0)}
              </span>
            </div>

            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {payables.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 p-6 text-center text-xs text-foreground/50">
                  No hay obligaciones de pago pendientes inmediatas.
                </div>
              ) : (
                payables.map(renderAlert)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
