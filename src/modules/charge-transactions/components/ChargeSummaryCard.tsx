"use client";

import { Card, Chip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick02Icon,
  Time02Icon,
  Alert02Icon,
  Money01Icon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";
import { ICharge } from "../interfaces/charges.interface";

interface Props {
  charge: ICharge;
}

export const ChargeSummaryCard = ({ charge }: Props) => {
  const isPaid = charge.status === "PAID";
  const isPartial = charge.status === "PARTIAL";

  const statusColor = isPaid ? "success" : isPartial ? "warning" : "danger";

  const statusText = isPaid ? "Pagado" : isPartial ? "Parcial" : "Pendiente";

  const statusIcon = isPaid ? Tick02Icon : isPartial ? Time02Icon : Alert02Icon;

  return (
    <Card className="w-full bg-linear-to-br from-background to-default-50 border-default-200 border p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Left: Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-default-100 rounded-xl text-default-600">
              <HugeiconsIcon icon={Invoice01Icon} size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {charge.description}
              </h3>
              <p className="text-sm text-default-500">
                Vence el{" "}
                {new Date(charge.dueDate).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Amounts & Status */}
        <div className="flex flex-row md:flex-col items-center md:items-end gap-4 w-full md:w-auto justify-between md:justify-center">
          <div className="flex flex-col gap-1 text-left md:text-right">
            <p className="text-sm text-default-500">Total a pagar</p>
            <p className="text-2xl font-bold font-mono text-foreground">
              {Number(charge.amount).toFixed(2)} Bs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1 text-left md:text-right border-r border-default-200 pr-3 mr-1">
              <p className="text-xs text-default-400 font-semibold uppercase tracking-wider">
                Saldo Pendiente
              </p>
              <p className="text-lg font-bold font-mono text-danger">
                {Number(charge.pendingAmount).toFixed(2)} Bs
              </p>
            </div>
            <Chip
              color={statusColor}
              variant="soft"
              size="lg"
              className="px-2 rounded-lg font-semibold"
            >
              <HugeiconsIcon icon={statusIcon} size={16} />
              {statusText}
            </Chip>
          </div>
        </div>
      </div>
    </Card>
  );
};
