"use client";

import {
  Drawer,
  Button,
  Select,
  ListBox,
  TextField,
  Label,
  Input,
  FieldError,
  toast,
  DatePicker,
  DateField,
  Calendar,
  Card,
  TextArea,
} from "@heroui/react";
import type { DateValue } from "@internationalized/date";
import {
  getLocalTimeZone,
  today,
  toCalendarDateTime,
} from "@internationalized/date";
import { HugeiconsIcon } from "@hugeicons/react";
import { Wallet01Icon, Calendar02Icon } from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IChargeSummary } from "@/modules/quick-operations/interfaces/secretary-summary.interface";
import { addBulk } from "../../actions/add-bulk";
import { getFinancialAccounts } from "@/modules/financial-accounts/actions/get-all";
import { FinancialAccount } from "@/modules/financial-accounts/interfaces/financial-account.interface";
import { formatCurrency } from "@/utils/constants";
import { IPersonOption } from "@/common/actions/get-persons-options";
import { PrintReportDialog } from "../dialog/PrintReportDialog";
import { PaymentDistributionsList } from "./PaymentDistributionsList";
import { SplitItem } from "./PayChargeDrawer";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  charges: IChargeSummary[];
  payerPerson: IPersonOption | null;
  onSuccess: () => void;
  onError?: () => void;
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  QR: "Código QR",
};

export const BulkPaymentDrawer = ({
  isOpen,
  onOpenChange,
  charges,
  payerPerson,
  onSuccess,
  onError,
}: Props) => {
  const router = useRouter();

  const totalAmount = charges.reduce(
    (sum, charge) => sum + Number(charge.pendingAmount || 0),
    0,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [financialAccounts, setFinancialAccounts] = useState<
    FinancialAccount[]
  >([]);

  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [financialAccountId, setFinancialAccountId] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [customSplits, setCustomSplits] = useState<Record<string, SplitItem[]>>(
    {},
  );
  const [expandedChargeId, setExpandedChargeId] = useState<string | null>(null);

  const [transactionDate, setTransactionDate] = useState<DateValue | null>(
    today(getLocalTimeZone()),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [printPaymentIds, setPrintPaymentIds] = useState<string[]>([]);

  useEffect(() => {
    getFinancialAccounts().then((res) => {
      if (res.data) setFinancialAccounts(res.data);
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTransactionDate(today(getLocalTimeZone()));
      const defaultAccount =
        financialAccounts.find((a) => a.isDefault) || financialAccounts[0];
      if (defaultAccount) {
        setFinancialAccountId(defaultAccount.id);
        if (defaultAccount.allowedPaymentMethods?.length > 0) {
          setPaymentMethod(defaultAccount.allowedPaymentMethods[0]);
        } else {
          setPaymentMethod("");
        }
      } else {
        setFinancialAccountId("");
        setPaymentMethod("");
      }
      setReference("");
      setNotes("");
      setCustomSplits({});
      setExpandedChargeId(null);
      setErrors({});
    }
  }, [isOpen, financialAccounts]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (charges.length === 0)
      newErrors.general = "No hay cargos seleccionados.";

    // Check if there are un-customized charges. If so, global method and account are required.
    const hasUncustomizedCharges = charges.some((c) => !customSplits[c.id]);
    if (hasUncustomizedCharges) {
      if (!paymentMethod)
        newErrors.paymentMethod =
          "Seleccione un método de pago global por defecto";
      if (!financialAccountId)
        newErrors.financialAccountId =
          "Seleccione una cuenta financiera global por defecto";
      // TODO: (Opcional temporalmente) Volver a obligar a ingresar Referencia Global para transferencias/QR en el futuro
      // if ((paymentMethod === "TRANSFER" || paymentMethod === "QR") && !reference.trim()) {
      //   newErrors.reference = "La referencia es obligatoria para este método de pago";
      // }
    }

    // Check customized charges
    for (const charge of charges) {
      const splits = customSplits[charge.id];
      if (splits) {
        const sum = splits.reduce(
          (acc, curr) => acc + Number(curr.amount || 0),
          0,
        );
        if (
          Number(sum.toFixed(2)) !==
          Number(Number(charge.pendingAmount).toFixed(2))
        ) {
          newErrors[`charge_${charge.id}`] =
            "La suma de la distribución no coincide con el saldo del cargo.";
        }
        const hasInvalidMethod = splits.some(
          (s) =>
            !s.paymentMethod || !s.financialAccountId || Number(s.amount) <= 0,
        );
        if (hasInvalidMethod) {
          newErrors[`charge_${charge.id}`] =
            "La distribución tiene cuentas, métodos o montos inválidos.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      const chargeItems = charges.map((c) => {
        const splits = customSplits[c.id];
        return {
          chargeId: c.id,
          splitTransactions: splits
            ? splits.map((s) => ({
                amount: Number(s.amount),
                paymentMethod: s.paymentMethod,
                financialAccountId: s.financialAccountId,
                reference: s.reference,
              }))
            : [
                {
                  amount: Number(c.pendingAmount),
                  paymentMethod: paymentMethod,
                  financialAccountId: financialAccountId,
                  reference: reference.trim() || undefined,
                },
              ],
        };
      });

      const payloadDate = transactionDate
        ? transactionDate.toDate(getLocalTimeZone()).toISOString()
        : new Date().toISOString();

      const res = await addBulk({
        payerPersonId: payerPerson?.id,
        charges: chargeItems,
        totalAmount: totalAmount,
        paymentMethod: (paymentMethod || undefined) as
          | "CASH"
          | "TRANSFER"
          | "QR"
          | undefined,
        financialAccountId: financialAccountId,
        reference: reference.trim() || undefined,
        notes: notes.trim() || undefined,
        transactionDate: payloadDate,
      });

      if (res.error) {
        toast.danger(
          res.message || "Es posible que el saldo de los cargos haya cambiado.",
        );
        if (onError) onError();
      } else {
        toast.success(
          res.message || "Los cargos han sido pagados exitosamente.",
        );

        const paymentIds = res.data?.receiptIds ?? [];
        if (paymentIds.length > 0) {
          setPrintPaymentIds(paymentIds);
          setShowPrintDialog(true);
        } else {
          onSuccess();
        }
      }
    } catch (error: any) {
      toast.danger(error.message || "No se pudo completar el pago masivo.");
      if (onError) onError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Drawer.Content placement="right">
          <Drawer.Dialog
            className="w-full sm:max-w-md"
            aria-label="Cobrar Múltiples Cargos"
          >
            <Drawer.CloseTrigger />
            <form onSubmit={handleConfirm} className="flex flex-col h-full">
              <Drawer.Header className="flex flex-col gap-1 border-b border-border">
                <Drawer.Heading className="text-xl font-bold flex items-center gap-2">
                  <HugeiconsIcon icon={Wallet01Icon} />
                  Cobrar Múltiples Cargos
                </Drawer.Heading>
                <p className="text-sm text-default-500">
                  Está a punto de cobrar {charges.length} cargos.
                </p>
              </Drawer.Header>

              <Drawer.Body className="gap-6 pt-6 overflow-y-auto">
                {errors.general && (
                  <div className="bg-danger/10 text-danger-600 p-3 rounded-md text-sm border border-danger/20">
                    {errors.general}
                  </div>
                )}

                {/* Selección Global Default */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2 border-b border-default-200 pb-2">
                    Distribución por Defecto
                  </h3>

                  {/* Cuenta Financiera */}
                  <Select
                    className="w-full"
                    variant="secondary"
                    value={financialAccountId}
                    onChange={(key) => {
                      const val = key as string;
                      if (val) {
                        setFinancialAccountId(val);
                        const account = financialAccounts.find(
                          (a) => a.id === val,
                        );
                        if (
                          account &&
                          account.allowedPaymentMethods?.length > 0
                        ) {
                          setPaymentMethod(account.allowedPaymentMethods[0]);
                        } else {
                          setPaymentMethod("");
                        }
                      }
                    }}
                    isInvalid={!!errors.financialAccountId}
                  >
                    <Label>Cuenta Destino Global</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {financialAccounts.map((acc) => (
                          <ListBox.Item
                            key={acc.id}
                            id={acc.id}
                            textValue={acc.name}
                          >
                            {acc.name} - {acc.currency}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  {/* Método de Pago */}
                  <Select
                    className="w-full"
                    variant="secondary"
                    value={paymentMethod}
                    isDisabled={!financialAccountId}
                    onChange={(val) => {
                      if (val) setPaymentMethod(val as string);
                    }}
                    isInvalid={!!errors.paymentMethod}
                  >
                    <Label>Método de Pago Global</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {(
                          financialAccounts.find(
                            (a) => a.id === financialAccountId,
                          )?.allowedPaymentMethods || []
                        ).map((method) => (
                          <ListBox.Item 
                            key={method} 
                            id={method}
                            textValue={PAYMENT_METHOD_LABELS[method] || method}
                          >
                            {PAYMENT_METHOD_LABELS[method] || method}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  {/* Referencia (condicional o siempre opcional) */}
                  <TextField
                    isInvalid={!!errors.reference}
                    value={reference}
                    onChange={setReference}
                  >
                    <Label>
                      Referencia Global
                      {/* TODO: Volver a mostrar el asterisco cuando sea obligatorio */}
                      {/* {(paymentMethod === "TRANSFER" || paymentMethod === "QR") && (
                        <span className="text-danger ml-1">*</span>
                      )} */}
                    </Label>
                    <Input placeholder="Ej. Número de operación" />
                    {errors.reference && (
                      <FieldError>{errors.reference}</FieldError>
                    )}
                  </TextField>
                </div>

                {/* Resumen de Cargos y Personalización */}
                <Card className="border border-outline-variant/30 shadow-none bg-surface-container-low mb-2">
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <HugeiconsIcon icon={Wallet01Icon} size={16} />
                      Resumen de Cargos
                    </h3>

                    <div className="flex flex-col gap-4 max-h-80 overflow-y-auto pr-2">
                      {charges.map((charge) => {
                        const isCustom = !!customSplits[charge.id];
                        const isExpanded = expandedChargeId === charge.id;

                        return (
                          <div
                            key={charge.id}
                            className="flex flex-col gap-2 border-b border-default-100 pb-2"
                          >
                            <div className="flex justify-between items-center text-sm">
                              <span
                                className="text-default-700 line-clamp-1 flex-1 pr-2"
                                title={charge.description}
                              >
                                {charge.description}
                              </span>
                              <span className="font-medium text-right shrink-0">
                                Bs{" "}
                                {formatCurrency(
                                  Number(charge.pendingAmount || 0),
                                )}
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-xs">
                              {isCustom ? (
                                <span className="text-primary-600 font-semibold bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">
                                  Personalizado (
                                  {customSplits[charge.id].length} split
                                  {customSplits[charge.id].length !== 1 && "s"})
                                </span>
                              ) : (
                                <span className="text-default-400">
                                  Usa default global
                                </span>
                              )}

                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 min-h-6 text-xs px-2"
                                onPress={() => {
                                  if (isExpanded) {
                                    setExpandedChargeId(null);
                                  } else {
                                    if (!customSplits[charge.id]) {
                                      // Initialize with 100%
                                      const defaultAcc =
                                        financialAccounts.find(
                                          (a) => a.id === financialAccountId,
                                        ) ||
                                        financialAccounts.find(
                                          (a) => a.isDefault,
                                        );
                                      setCustomSplits((prev) => ({
                                        ...prev,
                                        [charge.id]: [
                                          {
                                            id: Math.random().toString(),
                                            amount: Number(
                                              charge.pendingAmount,
                                            ).toString(),
                                            paymentMethod:
                                              paymentMethod ||
                                              defaultAcc
                                                ?.allowedPaymentMethods?.[0] ||
                                              "",
                                            financialAccountId:
                                              financialAccountId ||
                                              defaultAcc?.id ||
                                              "",
                                            reference: "",
                                          },
                                        ],
                                      }));
                                    }
                                    setExpandedChargeId(charge.id);
                                  }
                                }}
                              >
                                {isExpanded
                                  ? "Ocultar"
                                  : isCustom
                                    ? "Editar"
                                    : "Personalizar"}
                              </Button>
                            </div>

                            {errors[`charge_${charge.id}`] && (
                              <p className="text-xs text-danger-500 font-medium">
                                {errors[`charge_${charge.id}`]}
                              </p>
                            )}

                            {isExpanded && customSplits[charge.id] && (
                              <div className="mt-2 bg-default-50/50 p-2 rounded-md border border-default-200 shadow-inner flex flex-col gap-2">
                                <PaymentDistributionsList
                                  splits={customSplits[charge.id]}
                                  setSplits={(newSplits) => {
                                    setCustomSplits((prev) => ({
                                      ...prev,
                                      [charge.id]: newSplits,
                                    }));
                                  }}
                                  financialAccounts={financialAccounts}
                                />
                                {isCustom && (
                                  <Button
                                    size="sm"
                                    variant="danger-soft"
                                    className="w-full"
                                    onPress={() => {
                                      const newCustomSplits = {
                                        ...customSplits,
                                      };
                                      delete newCustomSplits[charge.id];
                                      setCustomSplits(newCustomSplits);
                                      setExpandedChargeId(null);
                                    }}
                                  >
                                    Quitar personalización (Usar Default)
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-3 pt-3 border-t border-default-200 flex justify-between items-center font-bold">
                      <span>Total a cobrar</span>
                      <span className="text-success-600 text-lg">
                        Bs {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Fecha de Pago */}
                <DatePicker
                  className="w-full"
                  name="date"
                  value={transactionDate}
                  onChange={setTransactionDate}
                >
                  <Label>Fecha de Pago</Label>
                  <DateField.Group fullWidth>
                    <DateField.Input>
                      {(segment) => <DateField.Segment segment={segment} />}
                    </DateField.Input>
                    <DateField.Suffix>
                      <DatePicker.Trigger>
                        <DatePicker.TriggerIndicator />
                      </DatePicker.Trigger>
                    </DateField.Suffix>
                  </DateField.Group>
                  <DatePicker.Popover>
                    <Calendar aria-label="Fecha de pago">
                      <Calendar.Header>
                        <Calendar.YearPickerTrigger>
                          <Calendar.YearPickerTriggerHeading />
                          <Calendar.YearPickerTriggerIndicator />
                        </Calendar.YearPickerTrigger>
                        <Calendar.NavButton slot="previous" />
                        <Calendar.NavButton slot="next" />
                      </Calendar.Header>
                      <Calendar.Grid>
                        <Calendar.GridHeader>
                          {(day) => (
                            <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                          )}
                        </Calendar.GridHeader>
                        <Calendar.GridBody>
                          {(date) => <Calendar.Cell date={date} />}
                        </Calendar.GridBody>
                      </Calendar.Grid>
                      <Calendar.YearPickerGrid>
                        <Calendar.YearPickerGridBody>
                          {({ year }) => (
                            <Calendar.YearPickerCell year={year} />
                          )}
                        </Calendar.YearPickerGridBody>
                      </Calendar.YearPickerGrid>
                    </Calendar>
                  </DatePicker.Popover>
                </DatePicker>

                {/* Notas opcionales */}
                <TextField value={notes} onChange={setNotes}>
                  <Label>Notas Generales (Opcional)</Label>
                  <TextArea placeholder="Observaciones adicionales" />
                </TextField>
              </Drawer.Body>

              <Drawer.Footer className="border-t border-border flex justify-end gap-3">
                <Button
                  variant="outline"
                  onPress={() => {
                    if (!isLoading) onOpenChange(false);
                  }}
                  isDisabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  isDisabled={isLoading}
                  isPending={isLoading}
                >
                  Confirmar Cobro
                </Button>
              </Drawer.Footer>
            </form>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>

      <PrintReportDialog
        paymentIds={printPaymentIds}
        isOpen={showPrintDialog}
        onOpenChange={(isOpen) => {
          setShowPrintDialog(isOpen);
          if (!isOpen) {
            onSuccess();
            setPrintPaymentIds([]);
          }
        }}
      />
    </>
  );
};
