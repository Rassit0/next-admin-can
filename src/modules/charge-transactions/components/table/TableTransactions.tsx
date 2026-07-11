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
} from "@hugeicons/core-free-icons";
import { ITransaction } from "../../interfaces/transactions.interface";
import { useFormStatus } from "react-dom";
import { removeTransaction } from "../../actions/remove-transaction";
// import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Props {
  transactions: ITransaction[];
}

export const TableTransactions = ({ transactions }: Props) => {
  const router = useRouter();
  const [transactionToVoid, setTransactionToVoid] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmVoid = async () => {
    if (!transactionToVoid) return;
    const id = transactionToVoid;
    setTransactionToVoid(null);
    // const loadingId = toast("Anulando transacción...", {
    //   isLoading: true,
    //   timeout: 0,
    // });
    setIsLoading(true);
    const res = await removeTransaction(id);
    setIsLoading(false);
    // toast.close(loadingId);
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
    <>
      <Table aria-label="Tabla de Transacciones">
        <Table.ScrollContainer>
          <Table.Content className="min-w-200">
            <Table.Header className="bg-surface-secondary">
              <Table.Column isRowHeader>
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
                                toast.info(
                                  "Descarga de recibo en desarrollo...",
                                );
                                // window.open(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${item.id}/receipt`, "_blank");
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
    </>
  );
};
