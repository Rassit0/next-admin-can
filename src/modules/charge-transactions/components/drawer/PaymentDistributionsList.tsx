"use client";

import {
  Button,
  Select,
  ListBox,
  TextField,
  Label,
  Input,
  Card,
} from "@heroui/react";
import { FinancialAccount } from "@/modules/financial-accounts/interfaces/financial-account.interface";
import { SplitItem } from "./PayChargeDrawer";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  QR: "Código QR",
};

interface PaymentDistributionsListProps {
  splits: SplitItem[];
  setSplits: (splits: SplitItem[]) => void;
  financialAccounts: FinancialAccount[];
}

export const PaymentDistributionsList = ({
  splits,
  setSplits,
  financialAccounts,
}: PaymentDistributionsListProps) => {
  return (
    <>
      {splits.map((split, index) => (
        <Card
          key={split.id}
          className="border border-outline-variant/30 shadow-none bg-surface-container-low"
        >
          <div className="flex flex-col gap-4 p-4 relative">
            {splits.length > 1 && (
              <div className="absolute top-2 right-2 text-xs font-semibold text-primary-500">
                Pago #{index + 1}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Select
                className="w-full"
                variant="secondary"
                placeholder="Caja/Banco"
                selectedKey={split.financialAccountId}
                onSelectionChange={(key) => {
                  const value = key as string;
                  const newSplits = [...splits];
                  newSplits[index].financialAccountId = value;
                  const selectedAcc = financialAccounts.find(
                    (a) => a.id === value,
                  );
                  if (
                    selectedAcc &&
                    (!selectedAcc.allowedPaymentMethods ||
                      !selectedAcc.allowedPaymentMethods.includes(
                        newSplits[index].paymentMethod,
                      ))
                  ) {
                    newSplits[index].paymentMethod =
                      selectedAcc.allowedPaymentMethods?.[0] || "";
                  }
                  setSplits(newSplits);
                }}
              >
                <Label>Cuenta Destino</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {financialAccounts.map((account) => (
                      <ListBox.Item
                        key={account.id}
                        id={account.id}
                        textValue={account.name}
                      >
                        {account.name}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
              <TextField className="w-full" isRequired>
                <Label>Monto (Bs)</Label>
                <Input
                  variant="secondary"
                  type="number"
                  step="0.01"
                  value={split.amount}
                  onChange={(e) => {
                    const newSplits = [...splits];
                    newSplits[index].amount = e.target.value;
                    setSplits(newSplits);
                  }}
                />
              </TextField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(() => {
                const selectedAcc = financialAccounts.find(
                  (a) => a.id === split.financialAccountId,
                );
                const hasMethods =
                  selectedAcc &&
                  selectedAcc.allowedPaymentMethods &&
                  selectedAcc.allowedPaymentMethods.length > 0;
                return (
                  <div className="w-full">
                    <Select
                      isRequired
                      className="w-full"
                      variant="secondary"
                      selectedKey={split.paymentMethod}
                      isDisabled={!hasMethods}
                      onSelectionChange={(key) => {
                        const value = key as string;
                        const newSplits = [...splits];
                        newSplits[index].paymentMethod = value;
                        setSplits(newSplits);
                      }}
                    >
                      <Label>Método de Pago</Label>
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {(selectedAcc?.allowedPaymentMethods || []).map(
                            (method) => (
                              <ListBox.Item
                                key={method}
                                id={method}
                                textValue={
                                  PAYMENT_METHOD_LABELS[method] || method
                                }
                              >
                                {PAYMENT_METHOD_LABELS[method] || method}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ),
                          )}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                    {!hasMethods && split.financialAccountId && (
                      <p className="text-xs text-danger mt-1">
                        Esta cuenta no puede recibir pagos.
                      </p>
                    )}
                  </div>
                );
              })()}
              <TextField className="w-full">
                <Label>Ref / Comprobante</Label>
                <Input
                  variant="secondary"
                  value={split.reference}
                  onChange={(e) => {
                    const newSplits = [...splits];
                    newSplits[index].reference = e.target.value;
                    setSplits(newSplits);
                  }}
                />
              </TextField>
            </div>
            {splits.length > 1 && (
              <Button
                size="sm"
                variant="danger-soft"
                className="mt-2"
                onPress={() =>
                  setSplits(splits.filter((s) => s.id !== split.id))
                }
              >
                Eliminar
              </Button>
            )}
          </div>
        </Card>
      ))}

      <Button
        variant="primary"
        className="w-full"
        onPress={() => {
          const defaultAcc = financialAccounts.find((a) => a.isDefault);
          setSplits([
            ...splits,
            {
              id: Math.random().toString(),
              amount: "",
              paymentMethod: defaultAcc?.allowedPaymentMethods?.[0] || "",
              financialAccountId: defaultAcc?.id || "",
              reference: "",
            },
          ]);
        }}
      >
        + Agregar Método de Pago
      </Button>
    </>
  );
};
