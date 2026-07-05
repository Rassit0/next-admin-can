"use client";

import { Table, Button, Dropdown, Spinner, toast } from "@heroui/react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreVerticalIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import { SortableColumnHeader } from "@/ui";
import { IPaymentRecord } from "@/modules/pagos/types";
import { PaymentStatusChip } from "./PaymentStatusChip";
import { PAYMENT_METHOD_CONFIG } from "@/modules/pagos/constants";
import { retryPayment, cancelPayment } from "@/modules/pagos/actions";
import { useState } from "react";

interface PaymentLedgerProps {
  payments: IPaymentRecord[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const formatCurrency = (amount: number, currency: string = "BOB") =>
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency,
  }).format(amount);

const formatDate = (date: Date | null | undefined) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-BO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const PaymentLedger = ({
  payments,
  isLoading,
  onRefresh,
}: PaymentLedgerProps) => {
  const [actingPaymentId, setActingPaymentId] = useState<string | null>(null);

  const handleRetry = async (paymentId: string) => {
    try {
      setActingPaymentId(paymentId);
      const result = await retryPayment(paymentId);

      if (result.error) {
        toast.danger(result.message || "Error al reintentar pago");
      } else {
        toast.success(result.message);
        onRefresh?.();
      }
    } catch (error) {
      toast.danger("Error al reintentar pago");
    } finally {
      setActingPaymentId(null);
    }
  };

  const handleCancel = async (paymentId: string) => {
    try {
      setActingPaymentId(paymentId);
      const result = await cancelPayment(paymentId);

      if (result.error) {
        toast.danger(result.message || "Error al cancelar pago");
      } else {
        toast.success(result.message);
        onRefresh?.();
      }
    } catch (error) {
      toast.danger("Error al cancelar pago");
    } finally {
      setActingPaymentId(null);
    }
  };

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Historial de pagos" className="min-w-200">
          <Table.Header className="bg-surface-secondary">
            <Table.Column allowsSorting id="createdAt">
              <SortableColumnHeader id="createdAt">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Fecha
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column id="amount" className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Monto
              </span>
            </Table.Column>
            <Table.Column id="method">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Método
              </span>
            </Table.Column>
            <Table.Column allowsSorting id="status">
              <SortableColumnHeader id="status">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Estado
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column id="reference">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Referencia
              </span>
            </Table.Column>
            <Table.Column className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Acciones
              </span>
            </Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <div className="py-10 text-center text-sm text-muted">
                No hay registros de pago aún.
              </div>
            )}
          >
            {payments.map((payment, idx) => (
              <motion.tr
                key={payment.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: idx * 0.05,
                }}
                className="border-b border-border hover:bg-surface-secondary/40"
              >
                <Table.Cell className="py-3 text-sm">
                  {formatDate(payment.createdAt)}
                </Table.Cell>
                <Table.Cell className="py-3 text-right">
                  <span className="font-semibold tabular-nums text-accent">
                    {formatCurrency(payment.amount, payment.currency)}
                  </span>
                </Table.Cell>
                <Table.Cell className="py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span>
                      {PAYMENT_METHOD_CONFIG[payment.method]?.label ||
                        payment.method}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell className="py-3">
                  <PaymentStatusChip status={payment.status} size="sm" />
                </Table.Cell>
                <Table.Cell className="py-3">
                  <code className="text-xs bg-surface px-2 py-1 rounded">
                    {payment.reference || "—"}
                  </code>
                </Table.Cell>
                <Table.Cell className="py-3">
                  <div className="flex items-center justify-center">
                    {payment.status === "failed" && (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        isPending={actingPaymentId === payment.id}
                        onPress={() => handleRetry(payment.id)}
                        className="text-accent"
                      >
                        {actingPaymentId === payment.id ? (
                          <Spinner size="sm" />
                        ) : (
                          <HugeiconsIcon icon={RefreshIcon} size={16} />
                        )}
                      </Button>
                    )}
                    {(payment.status === "pending" ||
                      payment.status === "processing") && (
                      <Dropdown>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          isDisabled={actingPaymentId === payment.id}
                        >
                          <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                        </Button>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            key="retry"
                            className="text-accent"
                            onPress={() => handleRetry(payment.id)}
                          >
                            <HugeiconsIcon icon={RefreshIcon} size={14} />
                            Reintentar
                          </Dropdown.Item>
                          <Dropdown.Item
                            key="cancel"
                            className="text-danger"
                            onPress={() => handleCancel(payment.id)}
                          >
                            Cancelar
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                </Table.Cell>
              </motion.tr>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
