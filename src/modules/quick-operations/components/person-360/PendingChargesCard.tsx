"use client";
import React from "react";
import { Card, Chip, Checkbox, Button } from "@heroui/react";
import { IChargeSummary } from "../../interfaces/secretary-summary.interface";
import { formatCurrency } from "@/utils/constants";
import { HugeiconsIcon } from "@hugeicons/react";
import { Invoice01Icon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { ChargeActions } from "../../../charge-transactions/components/actions/ChargeActions";
import { ICharge } from "../../../charge-transactions/interfaces/charges.interface";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { listItemTransition } from "@/ui/animations/transitions";

interface Props {
  charges: IChargeSummary[];
  selectedChargeIds?: string[];
  onChargeToggle?: (chargeId: string) => void;
  onCobrarClick?: () => void;
  onSuccess?: () => void;
}

export const PendingChargesCard = ({
  charges,
  selectedChargeIds = [],
  onChargeToggle,
  onCobrarClick,
  onSuccess,
}: Props) => {
  const prefersReducedMotion = useReducedMotion();

  const totalPendingAmount = charges.reduce(
    (acc, charge) => acc + charge.pendingAmount,
    0,
  );

  const selectedChargesAmount = charges
    .filter((c) => selectedChargeIds.includes(c.id))
    .reduce((acc, c) => acc + c.pendingAmount, 0);

  const selectableCharges = charges.filter(
    (c) => c.pendingAmount > 0 && c.status !== "CANCELLED",
  );
  const isAllSelected =
    selectableCharges.length > 0 &&
    selectableCharges.every((c) => selectedChargeIds.includes(c.id));
  const isIndeterminate = selectedChargeIds.length > 0 && !isAllSelected;

  const getChargeTypeColor = (type: string) => {
    switch (type) {
      case "MEMBERSHIP":
        return "primary";
      case "STUDENT":
        return "secondary";
      case "ACCOUNT":
        return "default";
      default:
        return "default";
    }
  };

  const getChargeTypeLabel = (type: string) => {
    switch (type) {
      case "MEMBERSHIP":
        return "Jugador";
      case "STUDENT":
        return "Estudiante";
      case "ACCOUNT":
        return "Cuenta";
      default:
        return type;
    }
  };

  const renderStatusChip = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Chip size="sm" color="success" variant="soft">
            Pagado
          </Chip>
        );
      case "PARTIAL":
        return (
          <Chip size="sm" color="warning" variant="soft">
            Parcial
          </Chip>
        );
      case "PENDING":
        return (
          <Chip size="sm" color="danger" variant="soft">
            Pendiente
          </Chip>
        );
      case "CANCELLED":
        return (
          <Chip size="sm" color="default" variant="soft">
            Cancelado
          </Chip>
        );
      default:
        return (
          <Chip size="sm" variant="soft">
            {status}
          </Chip>
        );
    }
  };

  return (
    <Card className="h-full shadow-sm flex flex-col">
      <Card.Header className="flex justify-between items-center bg-danger/5 border-b border-danger/10 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg flex items-center gap-2 text-danger">
            <i className="ri-money-dollar-circle-line"></i> Cargos Pendientes
          </h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xl font-bold text-danger">
            {formatCurrency(totalPendingAmount)}
          </span>
          <span className="text-xs text-danger-500 font-medium">
            ({charges.length} cargos)
          </span>
        </div>
      </Card.Header>

      <Card.Content className="p-0 flex-1 overflow-y-auto">
        {charges.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-default-400 h-full">
            <i className="ri-checkbox-circle-line text-3xl mb-2 text-success"></i>
            <p className="font-medium text-default-500">
              No hay cargos pendientes
            </p>
            <p className="text-xs text-default-400">Esta persona está al día</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-default-100">
            <AnimatePresence initial={false}>
              {charges.map((charge) => {
                const isSelected = selectedChargeIds.includes(charge.id);
                const isSelectable =
                  charge.pendingAmount > 0 && charge.status !== "CANCELLED";

                return (
                  <motion.div
                    key={charge.id}
                    layout={!prefersReducedMotion}
                    variants={prefersReducedMotion ? {} : listItemTransition}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="origin-top"
                  >
                    <Checkbox
                      variant="secondary"
                      value={charge.id}
                      isSelected={isSelected}
                      onChange={() => {
                        if (onChargeToggle && isSelectable) {
                          onChargeToggle(charge.id);
                        }
                      }}
                      isDisabled={!isSelectable}
                      className={`w-full max-w-full m-0 p-4 transition-all border-l-4 ${isSelected ? "bg-primary/10 border-l-primary" : "border-l-transparent hover:bg-default-50"}`}
                    >
                      <Checkbox.Content className="w-full flex items-start gap-3">
                        {isSelectable && (
                          <Checkbox.Control className="mt-1 shrink-0">
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                        )}

                        <div className="flex-1 flex flex-col gap-2 w-full">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Chip
                                  size="sm"
                                  color={getChargeTypeColor(charge.type) as any}
                                  variant="soft"
                                >
                                  {getChargeTypeLabel(charge.type)}
                                </Chip>
                                <span className="text-xs font-semibold text-default-500 line-clamp-1">
                                  {charge.originName}
                                </span>
                              </div>
                              <h4 className="font-medium text-sm leading-tight text-default-800">
                                {charge.description || "Cargo sin descripción"}
                              </h4>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col items-end">
                                  <span className="font-bold text-sm text-danger">
                                    {formatCurrency(charge.pendingAmount)}
                                  </span>
                                  <span className="text-xs text-default-400 line-through">
                                    {formatCurrency(charge.amount)}
                                  </span>
                                </div>
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <ChargeActions
                                    charge={charge as unknown as ICharge}
                                    onSuccess={onSuccess}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <span className="text-xs text-default-500 flex items-center gap-1">
                              <i className="ri-calendar-event-line"></i> Vence:{" "}
                              {new Date(charge.dueDate).toLocaleDateString()}
                            </span>
                            {renderStatusChip(charge.status)}
                          </div>
                        </div>
                      </Checkbox.Content>
                    </Checkbox>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </Card.Content>

      {selectedChargeIds.length > 0 && onCobrarClick && (
        <Card.Footer className="bg-default-50 border-t border-default-200 p-4">
          <Button
            variant="primary"
            className="w-full font-semibold flex justify-between"
            onPress={onCobrarClick}
          >
            <span>
              <HugeiconsIcon
                icon={Wallet01Icon}
                size={18}
                className="inline-block mr-2 -mt-1"
              />
              Cobrar {selectedChargeIds.length} cargo
              {selectedChargeIds.length !== 1 ? "s" : ""}
            </span>
            <span>Bs {formatCurrency(selectedChargesAmount)}</span>
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
};
