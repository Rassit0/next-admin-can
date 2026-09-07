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
  Checkbox,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreVerticalIcon,
  Delete02Icon,
  Invoice01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { ITransaction } from "../../interfaces/transactions.interface";
import { useFormStatus } from "react-dom";
import { removeTransaction } from "../../actions/remove-transaction";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
import { PrintReportDialog } from "../dialog/PrintReportDialog";

interface Props {
  transactions: ITransaction[];
}

export const TableTransactions = ({ transactions }: Props) => {
  const router = useRouter();
  const [transactionToVoid, setTransactionToVoid] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  // Estado para el diálogo de impresión de recibo
  const [printTransactionId, setPrintTransactionId] = useState<string | null>(
    null,
  );
  const [printPaymentIds, setPrintPaymentIds] = useState<string[]>([]);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));

  const [printReportType, setPrintReportType] = useState<"payment" | "transaction">("transaction");

  const handleConfirmVoid = async () => {
    if (!transactionToVoid) return;
    const id = transactionToVoid;
    setTransactionToVoid(null);
    setIsLoading(true);
    const res = await removeTransaction(id);
    setIsLoading(false);
    if (res.error) {
      toast.danger(res.message);
    } else {
      toast.success(res.message);
    }
  };

  const selectedPaymentIds = useMemo(() => {
    if (selectedKeys === "all") {
      return Array.from(new Set(transactions.map((t) => t.paymentId || t.id)));
    }
    return Array.from(
      new Set(
        transactions
          .filter((t) => selectedKeys.has(t.id))
          .map((t) => t.paymentId || t.id)
      )
    );
  }, [transactions, selectedKeys]);

  const handlePrintSelected = () => {
    setPrintTransactionId(null);
    setPrintPaymentIds(selectedPaymentIds);
    setShowPrintDialog(true);
  };

  const getMethodChip = (method: string) => {
    const methodMap: Record<
      string,
      {
        label: string;
        className:
          | "bg-accent-soft text-accent"
          | "bg-dedault text-default-foreground"
          | "bg-success-soft text-success";
      }
    > = {
      CASH: {
        label: "Efectivo",
        className: "bg-success-soft text-success",
      },
      TRANSFER: {
        label: "Transferencia",
        className: "bg-dedault text-default-foreground",
      },
      QR: {
        label: "QR",
        className: "bg-success-soft text-success",
      },
    };
    const m = methodMap[method] || {
      label: method,
      className: "bg-dedault text-default-foreground",
    };
    return (
      <Chip size="sm" variant="soft" className={m.className}>
        {m.label}
      </Chip>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {((selectedKeys === "all" && transactions.length > 0) ||
        (selectedKeys !== "all" && selectedKeys.size > 0)) && (
        <div className="flex justify-end mb-2">
          <Button
            variant="primary"
            size="sm"
            onPress={handlePrintSelected}
            className="flex items-center gap-2"
          >
            <HugeiconsIcon icon={Invoice01Icon} size={16} />
            Imprimir seleccionados ({selectedKeys === "all" ? transactions.length : selectedKeys.size})
          </Button>
        </div>
      )}
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Tabla de Transacciones"
            className="min-w-200"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <Table.Header className="bg-surface-secondary">
              <Table.Column className="pe-0 w-10">
                <Checkbox aria-label="Seleccionar todos" slot="selection">
                  <Checkbox.Content>
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                  </Checkbox.Content>
                </Checkbox>
              </Table.Column>
              <Table.Column isRowHeader>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  N° Recibo
                </span>
              </Table.Column>
              <Table.Column>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Pagador
                </span>
              </Table.Column>
              <Table.Column>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Beneficiario
                </span>
              </Table.Column>
              <Table.Column>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Fecha
                </span>
              </Table.Column>
              <Table.Column>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Monto
                </span>
              </Table.Column>
              <Table.Column>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Método
                </span>
              </Table.Column>
              <Table.Column>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Referencia / Notas
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
                  No hay transacciones registradas para este cargo.
                </div>
              )}
            >
              {transactions.map((item) => (
                <Table.Row
                  key={item.id}
                  id={item.id}
                  className="border-b border-border last:border-b-0 hover:bg-surface-secondary/40"
                >
                  <Table.Cell className="pe-0 w-10">
                    <Checkbox
                      aria-label={`Seleccionar recibo ${item.receiptSeries}-${item.receiptNumber}`}
                      slot="selection"
                      variant="secondary"
                    >
                      <Checkbox.Content>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox.Content>
                    </Checkbox>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {item.receiptSeries}-{item.receiptNumber}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {item.payerPerson?.name
                          ? `${item.payerPerson.lastName || ""} ${(item.payerPerson as any).secondLastName || ""} ${item.payerPerson.name}`.replace(/\s+/g, ' ').trim()
                          : "-"}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {item.thirdParty?.name || "-"}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {new Date(item.transactionDate).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <span className="text-xs text-default-400">
                        {new Date(item.createdAt).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <span className="font-mono font-bold text-foreground">
                      {Number(item.amount).toFixed(2)} Bs
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    {getMethodChip(item.paymentMethod)}
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {item.reference || "-"}
                      </span>
                      <span
                        className="text-xs text-default-500 max-w-50 truncate"
                        title={item.notes}
                      >
                        {item.notes}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <div className="relative flex justify-center items-center gap-2">
                      <Dropdown>
                        <Button
                          aria-label="Acciones de transacción"
                          isIconOnly
                          size="sm"
                          variant="ghost"
                        >
                          <HugeiconsIcon icon={MoreVerticalIcon} />
                        </Button>
                        <Dropdown.Popover>
                          <Dropdown.Menu
                            aria-label="Acciones de Transacción"
                            onAction={(key) => {
                              if (key === "print") {
                                setPrintPaymentIds([]);
                                if (item.paymentId) {
                                  setPrintTransactionId(item.paymentId);
                                  setPrintReportType("payment");
                                } else {
                                  setPrintTransactionId(item.id);
                                  setPrintReportType("transaction");
                                }
                                setShowPrintDialog(true);
                              } else if (key === "void") {
                                setTransactionToVoid(item.id);
                              }
                            }}
                          >
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
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <AlertDialog.Backdrop
        isOpen={!!transactionToVoid}
        onOpenChange={(isOpen) => !isOpen && setTransactionToVoid(null)}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Anular Pago</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                ¿Estás seguro de que deseas anular esta transacción? El monto
                será devuelto al saldo pendiente de la cuota.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                slot="close"
                variant="tertiary"
                onPress={() => setTransactionToVoid(null)}
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
                Anular Transacción
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>

      <PrintReportDialog
        transactionId={printTransactionId}
        paymentIds={printPaymentIds}
        reportType={printReportType}
        isOpen={showPrintDialog}
        onOpenChange={setShowPrintDialog}
      />
    </div>
  );
};
