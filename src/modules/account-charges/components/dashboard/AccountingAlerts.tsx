"use client";

import { Button, Chip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  ArrowRight02Icon,
  Calendar03Icon,
  CalendarMinus02Icon,
} from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/ui";
import Link from "next/link";
import { IDashboardAlert } from "@/modules/accounting-dashboard/interfaces/dashboard.interface";

interface Props {
  alerts: IDashboardAlert[];
}

export const AccountingAlerts = ({ alerts }: Props) => {
  const receivables = alerts.filter((a) => a.type === "RECEIVABLE");
  const payables = alerts.filter((a) => a.type === "PAYABLE");

  const renderAlert = (alert: IDashboardAlert, index: number) => {
    return (
      <div
        key={`${alert.context}-${index}`}
        className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between p-3 rounded-lg hover:bg-default-100 transition-colors border border-transparent hover:border-default-200"
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg bg-${alert.severity}/10 text-${alert.severity}`}
          >
            {alert.severity === "danger" ? (
              <HugeiconsIcon icon={Alert02Icon} size={20} />
            ) : (
              <HugeiconsIcon icon={CalendarMinus02Icon} size={20} />
            )}
          </div>
          <div>
            <p className="font-medium text-sm leading-tight">{alert.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-default-500 truncate max-w-37.5">
                {alert.context}
              </span>
              <Chip
                size="sm"
                color={alert.severity}
                className="h-5 text-[10px]"
              >
                {alert.count} cuentas
              </Chip>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end pl-11 sm:pl-0">
          <div title="Ver detalles">
            <Link href={alert.href}>
              <Button isIconOnly size="sm" variant="ghost">
                <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Alertas de Cobros (Receivables) */}
      <div className="border border-default-200 rounded-large shadow-sm bg-default-50 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-default-100 bg-default-50/50">
          <div className="flex gap-2 items-center text-primary">
            <HugeiconsIcon icon={Calendar03Icon} size={20} />
            <h3 className="font-semibold text-foreground flex items-center">
              Atención: Por Cobrar
              <InfoTooltip text="Muestra alertas sobre cuentas por cobrar que requieren tu atención, como cobros vencidos o cercanos a vencer." />
            </h3>
          </div>
          <Chip size="sm" color="default">
            {receivables.reduce((acc, curr) => acc + curr.count, 0)}
          </Chip>
        </div>
        <div className="p-2 flex flex-col gap-1 max-h-80 overflow-y-auto scrollbar-hide">
          {receivables.length > 0 ? (
            receivables.map(renderAlert)
          ) : (
            <div className="p-8 text-center text-default-400 text-sm">
              No hay alertas de cobros.
            </div>
          )}
        </div>
      </div>

      {/* Alertas de Pagos (Payables) */}
      <div className="border border-default-200 rounded-large shadow-sm bg-default-50 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-default-100 bg-default-50/50">
          <div className="flex gap-2 items-center text-danger">
            <HugeiconsIcon icon={Calendar03Icon} size={20} />
            <h3 className="font-semibold text-foreground flex items-center">
              Atención: Por Pagar
              <InfoTooltip text="Muestra alertas sobre obligaciones y cuentas por pagar que están vencidas o próximas a su fecha límite." />
            </h3>
          </div>
          <Chip size="sm" color="danger">
            {payables.reduce((acc, curr) => acc + curr.count, 0)}
          </Chip>
        </div>
        <div className="p-2 flex flex-col gap-1 max-h-80 overflow-y-auto scrollbar-hide">
          {payables.length > 0 ? (
            payables.map(renderAlert)
          ) : (
            <div className="p-8 text-center text-default-400 text-sm">
              No hay alertas de pagos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
