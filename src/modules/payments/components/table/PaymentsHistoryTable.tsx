"use client";
import { Avatar, Button, Table } from "@heroui/react";
import { SecurityCheckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IPayment } from "@/modules/payments/interfaces/payment.interface";
import { PaymentStatusChip } from "@/modules/payments/components/status/PaymentStatusChip";
import { formatCurrency } from "@/modules/player-memberships";

interface Props {
  payments: IPayment[];
  onPay?: (payment: IPayment) => void;
  emptyLabel?: string;
}

const initialsFromName = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();

export const PaymentsHistoryTable = ({
  payments,
  onPay,
  emptyLabel = "No hay pagos en esta categoría.",
}: Props) => {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Historial de pagos" className="min-w-200">
          <Table.Header>
            <Table.Column isRowHeader>ATLETA</Table.Column>
            <Table.Column>CONCEPTO</Table.Column>
            <Table.Column className="text-right">MONTO</Table.Column>
            <Table.Column>MÉTODO</Table.Column>
            <Table.Column>REFERENCIA</Table.Column>
            <Table.Column>ESTADO</Table.Column>
            <Table.Column className="text-center">ACCIÓN</Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <div className="py-10 text-center text-sm text-muted">
                {emptyLabel}
              </div>
            )}
          >
            {payments.map((payment) => (
              <Table.Row key={payment.id} id={payment.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <Avatar size="sm">
                      <Avatar.Image
                        alt={payment.athleteName}
                        src={payment.athleteImageUrl ?? undefined}
                        loading="lazy"
                      />
                      <Avatar.Fallback>
                        {initialsFromName(payment.athleteName)}
                      </Avatar.Fallback>
                    </Avatar>
                    <span className="font-semibold text-foreground">
                      {payment.athleteName}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>{payment.concept}</Table.Cell>
                <Table.Cell className="text-right font-semibold tabular-nums">
                  {formatCurrency(payment.amount, payment.currency)}
                </Table.Cell>
                <Table.Cell>
                  {payment.method === "CARD"
                    ? "Tarjeta"
                    : payment.method === "TRANSFER"
                      ? "Transferencia"
                      : "—"}
                </Table.Cell>
                <Table.Cell className="font-mono text-xs text-muted">
                  {payment.reference ?? "—"}
                </Table.Cell>
                <Table.Cell>
                  <PaymentStatusChip status={payment.status} />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-center">
                    {payment.status === "PENDING" && onPay ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onPress={() => onPay(payment)}
                      >
                        <HugeiconsIcon icon={SecurityCheckIcon} size={16} />
                        Pagar
                      </Button>
                    ) : (
                      <span className="text-xs text-muted">
                        {payment.paidAt
                          ? payment.paidAt.toLocaleDateString("es-BO")
                          : "—"}
                      </span>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
