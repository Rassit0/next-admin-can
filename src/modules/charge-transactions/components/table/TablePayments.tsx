"use client";

import {
  Table,
  Dropdown,
  Button,
  Chip,
  Label,
  AlertDialog,
  toast,
  Spinner,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreVerticalIcon,
  Delete02Icon,
  Invoice01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { IChargePayment } from "../../interfaces/payments.interface";
import { removePayment } from "../../actions/remove-payment";
import { useState } from "react";
import { PrintReportDialog } from "../dialog/PrintReportDialog";

interface Props {
  payments: IChargePayment[];
}

export const TablePayments = ({ payments }: Props) => {
  const [paymentToVoid, setPaymentToVoid] = useState<string | null>(null);
  const [paymentToView, setPaymentToView] = useState<IChargePayment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Estado para el diálogo de impresión de recibo
  const [printTransactionId, setPrintTransactionId] = useState<string | null>(null);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [printReportType, setPrintReportType] = useState<"payment" | "transaction">("payment");

  const handleConfirmVoid = async () => {
    if (!paymentToVoid) return;
    const id = paymentToVoid;
    setPaymentToVoid(null);
    setIsLoading(true);
    const res = await removePayment(id);
    setIsLoading(false);
    if (res.error) {
      toast.danger(res.message);
    } else {
      toast.success(res.message);
    }
  };

  const getMethodChip = (method: string) => {
    const methodMap: Record<
      string,
      {
        label: string;
        className: string;
      }
    > = {
      CASH: {
        label: "Efectivo",
        className: "bg-success-soft text-success",
      },
      TRANSFER: {
        label: "Transferencia",
        className: "bg-default text-default-foreground",
      },
      QR: {
        label: "QR",
        className: "bg-success-soft text-success",
      },
    };
    const m = methodMap[method] || {
      label: method,
      className: "bg-default text-default-foreground",
    };
    return (
      <Chip key={method} size="sm" variant="soft" className={m.className}>
        {m.label}
      </Chip>
    );
  };

  return (
    <>
      <Table aria-label="Tabla de Pagos Comerciales">
        <Table.ScrollContainer>
          <Table.Content className="min-w-200">
            <Table.Header className="bg-surface-secondary">
              <Table.Column isRowHeader>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  N° Recibo
                </span>
              </Table.Column>
              <Table.Column>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Fecha
                </span>
              </Table.Column>
              <Table.Column>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Monto Total
                </span>
              </Table.Column>
              <Table.Column>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Métodos de Pago
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
                  No hay pagos registrados para este cargo.
                </div>
              )}
            >
              {payments.map((item) => {
                // Obtener los metodos únicos del pago
                const methods = Array.from(
                  new Set(item.transactions?.map((t) => t.paymentMethod) || []),
                );

                return (
                  <Table.Row
                    key={item.id}
                    id={item.id}
                    className="border-b border-border last:border-b-0 hover:bg-surface-secondary/40"
                  >
                    <Table.Cell className="py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {item.receiptSeries}-{item.receiptNumber}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {new Date(item.paymentDate).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span className="text-xs text-default-400">
                          {new Date(item.createdAt).toLocaleTimeString(
                            "es-ES",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="py-3">
                      <span className="font-mono font-bold text-foreground">
                        {Number(item.amount).toFixed(2)} Bs
                      </span>
                    </Table.Cell>
                    <Table.Cell className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {methods.map((m) => getMethodChip(m))}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="py-3">
                      <div className="relative flex justify-center items-center gap-2">
                        <Dropdown>
                          <Button
                            aria-label="Acciones de pago"
                            isIconOnly
                            size="sm"
                            variant="ghost"
                          >
                            <HugeiconsIcon icon={MoreVerticalIcon} />
                          </Button>
                          <Dropdown.Popover>
                            <Dropdown.Menu
                              aria-label="Acciones de Pago"
                              onAction={(key) => {
                                if (key === "view") {
                                  setPaymentToView(item);
                                } else if (key === "print") {
                                  setPrintTransactionId(item.id);
                                  setPrintReportType("payment");
                                  setShowPrintDialog(true);
                                } else if (key === "void") {
                                  setPaymentToVoid(item.id);
                                }
                              }}
                            >
                              <Dropdown.Item id="view" textValue="Ver Detalles">
                                <HugeiconsIcon icon={ViewIcon} />
                                <Label>Ver Detalles</Label>
                              </Dropdown.Item>
                              <Dropdown.Item
                                id="print"
                                textValue="Imprimir Recibo"
                              >
                                <HugeiconsIcon icon={Invoice01Icon} />
                                <Label>Imprimir Recibo</Label>
                              </Dropdown.Item>
                              <Dropdown.Item id="void" textValue="Anular Pago">
                                <HugeiconsIcon
                                  icon={Delete02Icon}
                                  className="text-danger"
                                />
                                <Label className="text-danger">Anular Pago</Label>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown.Popover>
                        </Dropdown>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <AlertDialog.Backdrop
        isOpen={!!paymentToVoid}
        onOpenChange={(isOpen) => !isOpen && setPaymentToVoid(null)}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Anular Pago Comercial</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                ¿Estás seguro de que deseas anular este pago? Se anulará el recibo
                completo y el monto total será devuelto al saldo pendiente de la
                cuota, revirtiendo todas las distribuciones en las cuentas financieras.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                slot="close"
                variant="tertiary"
                onPress={() => setPaymentToVoid(null)}
                isPending={isLoading}
              >
                Cancelar
              </Button>
              <Button
                slot="close"
                variant="danger"
                isPending={isLoading}
                onPress={handleConfirmVoid}
              >
                {isLoading && <Spinner color="current" />}
                Anular Pago
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>

      {/* Payment Details Dialog */}
      <AlertDialog.Backdrop
        isOpen={!!paymentToView}
        onOpenChange={(isOpen) => !isOpen && setPaymentToView(null)}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-md">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Heading>Detalle del Pago</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              {paymentToView && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center bg-surface-secondary p-3 rounded-lg">
                    <div>
                      <p className="text-sm text-default-500">Recibo</p>
                      <p className="font-semibold">{paymentToView.receiptSeries}-{paymentToView.receiptNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-default-500">Total</p>
                      <p className="font-semibold text-lg">{Number(paymentToView.amount).toFixed(2)} Bs</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Distribución Financiera</h3>
                    <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
                      {paymentToView.transactions?.map((t, idx) => (
                        <div key={t.id || idx} className="p-3 flex justify-between items-center bg-background">
                          <div className="flex flex-col">
                            <span className="font-medium">{t.financialAccountName || "Cuenta Desconocida"}</span>
                            <span className="text-xs text-default-500">{t.paymentMethod}</span>
                          </div>
                          <span className="font-mono">{Number(t.amount).toFixed(2)} Bs</span>
                        </div>
                      ))}
                      <div className="p-3 flex justify-between items-center bg-surface-secondary font-semibold">
                        <span>Total distribuido:</span>
                        <span>{Number(paymentToView.amount).toFixed(2)} Bs</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" onPress={() => setPaymentToView(null)}>Cerrar</Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>

      <PrintReportDialog
        transactionId={printTransactionId}
        reportType={printReportType}
        isOpen={showPrintDialog}
        onOpenChange={setShowPrintDialog}
      />
    </>
  );
};
