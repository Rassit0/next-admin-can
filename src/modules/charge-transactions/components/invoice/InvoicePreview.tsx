"use client";
import { Chip, Surface } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Invoice01Icon,
  Tag01Icon,
  InformationCircleIcon,
  Alert02Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChargeFlag,
  formatCurrency,
  InitialChargesBreakdown,
} from "@/modules/player-memberships/helpers/initial-charges";
import { IPreviewChargesResponse } from "@/modules/player-memberships";

interface Props {
  breakdown: IPreviewChargesResponse | null;
  playerName?: string | null;
  planName?: string | null;
  emptyHint?: string;
}

const flagIcon = (type: ChargeFlag["type"]) => {
  if (type === "warning") return Alert02Icon;
  if (type === "success") return CheckmarkBadge01Icon;
  return InformationCircleIcon;
};

const flagColor = (
  type: ChargeFlag["type"],
): "accent" | "danger" | "default" | "success" | "warning" => {
  if (type === "warning") return "warning";
  if (type === "success") return "success";
  return "accent";
};

export const InvoicePreview = ({
  breakdown,
  playerName,
  planName,
  emptyHint = "Selecciona un atleta y un plan de pago para previsualizar los cargos iniciales.",
}: Props) => {
  return (
    <Surface
      variant="secondary"
      className="relative overflow-hidden rounded-xl border border-border p-5 shadow-sm bg-surface-secondary"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground">
            <HugeiconsIcon icon={Invoice01Icon} size={18} />
          </span>
          <div>
            <p className="text-sm font-bold leading-tight text-foreground">
              Cargos Iniciales
            </p>
            <p className="text-[11px] text-muted">
              Vista previa de facturación
            </p>
          </div>
        </div>
        {planName ? (
          <Chip color="accent" variant="soft" size="sm">
            <HugeiconsIcon icon={Tag01Icon} size={12} />
            <Chip.Label>{planName}</Chip.Label>
          </Chip>
        ) : null}
      </div>

      <div className="my-4 border-t border-dashed border-border" />

      <AnimatePresence mode="wait">
        {!breakdown ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-6 text-center text-xs leading-relaxed text-muted"
          >
            {emptyHint}
          </motion.p>
        ) : (
          <motion.div
            key="content"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.05 },
              },
            }}
            className="flex flex-col gap-3"
          >
            {playerName ? (
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-xs text-muted"
              >
                Facturar a{" "}
                <span className="font-semibold text-foreground">
                  {playerName}
                </span>
              </motion.p>
            ) : null}

            {breakdown.data.charges.map((line, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="rounded-xl bg-surface p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {line.type === "REGISTRATION" || line.type === "REGISTRATION_FEE"
                        ? "Matrícula de inscripción"
                        : line.type === "RECURRING_FEE"
                          ? "Cuota Recurrente"
                          : line.type === "SEASON_FEE"
                            ? "Pago de Temporada (Adelantado)"
                            : line.type}
                    </p>
                    <p className="text-[11px] text-muted">{line.description}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold tabular-nums text-foreground">
                    {formatCurrency(
                      line.amount,
                      breakdown.data.breakdown.currency,
                    )}
                  </p>
                </div>
                {line.discountPercent > 0 ? (
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-muted line-through tabular-nums">
                      {formatCurrency(
                        line.baseAmount,
                        breakdown.data.breakdown.currency,
                      )}
                    </span>
                    <span className="font-medium text-success tabular-nums">
                      -{line.discountPercent}% (
                      {formatCurrency(
                        line.discountAmount,
                        breakdown.data.breakdown.currency,
                      )}
                      )
                    </span>
                  </div>
                ) : null}
              </motion.div>
            ))}

            {/* Totals */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mt-1 flex flex-col gap-1.5 border-t border-dashed border-border pt-3 text-xs"
            >
              <div className="flex items-center justify-between text-muted">
                <span>Subtotal</span>
                <span className="tabular-nums">
                  {formatCurrency(
                    breakdown.data.breakdown.totalBaseAmount,
                    breakdown.data.breakdown.currency,
                  )}
                </span>
              </div>
              {breakdown.data.breakdown.totalDiscount > 0 ? (
                <div className="flex items-center justify-between text-success">
                  <span>Descuentos</span>
                  <span className="tabular-nums">
                    -
                    {formatCurrency(
                      breakdown.data.breakdown.totalDiscount,
                      breakdown.data.breakdown.currency,
                    )}
                  </span>
                </div>
              ) : null}
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.96 },
                visible: { opacity: 1, scale: 1 },
              }}
              className="flex items-center justify-between rounded-xl bg-accent px-4 py-3 text-accent-foreground"
            >
              <span className="text-sm font-bold">Total a pagar hoy</span>
              <span className="text-lg font-extrabold tabular-nums">
                {formatCurrency(
                  breakdown.data.breakdown.totalNetAmount,
                  breakdown.data.breakdown.currency,
                )}
              </span>
            </motion.div>

            {(() => {
              const flags: ChargeFlag[] = [];
              if (breakdown.data.breakdown.totalDiscount > 0) {
                flags.push({
                  type: "success",
                  label: "Descuentos aplicados",
                });
              }
              if (
                breakdown.data.charges.length === 0 ||
                breakdown.data.breakdown.totalBaseAmount === 0
              ) {
                flags.push({ type: "info", label: "Sin cargos iniciales" });
              }

              if (flags.length === 0) return null;

              return (
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                  }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {flags.map((flag, index) => (
                    <Chip
                      key={index}
                      color={flagColor(flag.type)}
                      variant="soft"
                      size="sm"
                    >
                      <HugeiconsIcon icon={flagIcon(flag.type)} size={12} />
                      <Chip.Label>{flag.label}</Chip.Label>
                    </Chip>
                  ))}
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </Surface>
  );
};
