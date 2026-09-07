"use client";

import {
  Drawer,
  Button,
  Select,
  ListBox,
  TextArea,
  TextField,
  Label,
  Input,
  FieldError,
  toast,
  DatePicker,
  DateField,
  Calendar,
  Card,
} from "@heroui/react";
import type { DateValue } from "@internationalized/date";
import {
  getLocalTimeZone,
  today,
  toCalendarDateTime,
} from "@internationalized/date";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wallet01Icon,
  Calendar02Icon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ICharge } from "../../interfaces/charges.interface";
import { addTransaction } from "../../actions/add-transaction";
import { SelectOrCreatePerson } from "./SelectOrCreatePerson";
import { IPersonOption } from "@/common/actions/get-persons-options";
import { getFinancialAccounts } from "@/modules/financial-accounts/actions/get-all";
import { FinancialAccount } from "@/modules/financial-accounts/interfaces/financial-account.interface";
import { PrintReportDialog } from "../dialog/PrintReportDialog";
import { PaymentDistributionsList } from "./PaymentDistributionsList";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  charge: ICharge;
}

export interface SplitItem {
  id: string;
  amount: string;
  paymentMethod: string;
  financialAccountId: string;
  reference: string;
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Efectivo",
  TRANSFER: "Transferencia",
  QR: "Código QR",
};

export const PayChargeDrawer = ({ isOpen, onOpenChange, charge }: Props) => {
  const router = useRouter();
  const pendingAmount = Number(charge.pendingAmount || 0);

  const [isLoading, setIsLoading] = useState(false);
  const [personId, setPersonId] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<IPersonOption | null>(
    null,
  );
  const [financialAccounts, setFinancialAccounts] = useState<
    FinancialAccount[]
  >([]);

  const getLocalDatetime = () => {
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    return new Date(Date.now() - tzOffset).toISOString().slice(0, 16);
  };

  const [splits, setSplits] = useState<SplitItem[]>([]);
  const [transactionDate, setTransactionDate] = useState<DateValue | null>(
    today(getLocalTimeZone()),
  );
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estado para el diálogo de impresión de recibo
  const [printTransactionId, setPrintTransactionId] = useState<string | null>(
    null,
  );
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  useEffect(() => {
    getFinancialAccounts().then((res) => {
      if (res.data) setFinancialAccounts(res.data);
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTransactionDate(today(getLocalTimeZone()));
      setNotes("");

      const defaultAcc = financialAccounts.find((a) => a.isDefault);
      setSplits([
        {
          id: Math.random().toString(),
          amount: pendingAmount.toString(),
          paymentMethod: defaultAcc?.allowedPaymentMethods?.[0] || "",
          financialAccountId: defaultAcc ? defaultAcc.id : "",
          reference: "",
        },
      ]);
      setErrors({});
    }
  }, [isOpen, pendingAmount, financialAccounts]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);

    try {
      const totalAmountNum = splits.reduce(
        (acc, curr) => acc + Number(curr.amount || 0),
        0,
      );

      const hasInvalidMethod = splits.some((s) => !s.paymentMethod);
      if (hasInvalidMethod) {
        toast.danger(
          "Debe seleccionar un método de pago válido para cada cuenta.",
        );
        setIsLoading(false);
        return;
      }

      if (!personId) {
        toast.danger("Debe seleccionar una persona.");
        return;
      }

      for (let i = 0; i < splits.length; i++) {
        if (!splits[i].financialAccountId) {
          toast.danger(
            `Debe seleccionar una cuenta financiera en la fila ${i + 1}.`,
          );
          return;
        }
        if (Number(splits[i].amount) <= 0) {
          toast.danger(`El monto debe ser mayor a 0 en la fila ${i + 1}.`);
          return;
        }
      }

      if (totalAmountNum < 0 || totalAmountNum > pendingAmount) {
        toast.danger(
          "El monto total no puede exceder el saldo pendiente ni ser negativo.",
        );
        return;
      }

      const res = await addTransaction({
        payerPersonId: personId!,
        amount: totalAmountNum,
        type: "INCOME",
        paymentMethod: splits[0].paymentMethod as "CASH" | "TRANSFER" | "QR",
        financialAccountId: splits[0].financialAccountId,
        notes,
        transactionDate: transactionDate
          ? transactionDate.toDate(getLocalTimeZone()).toISOString()
          : new Date().toISOString(),
        description: `Pago para: ${charge.description}`,
        chargeId: charge.id,
        splitTransactions: splits.map((s) => ({
          amount: Number(s.amount),
          paymentMethod: s.paymentMethod as "CASH" | "TRANSFER" | "QR",
          financialAccountId: s.financialAccountId,
          reference: s.reference,
        })),
      });

      if (res.error) {
        toast.danger(res.message);
      } else {
        toast.success(res.message);

        console.log("PAYMENT RESPONSE DATA:", res.data);

        // Mostrar diálogo de impresión con el ID de la transacción creada
        if (res.data?.transaction?.id) {
          setPrintTransactionId(res.data.transaction.id);
          setShowPrintDialog(true);
          return;
        }

        onOpenChange(false);
      }
    } catch (error) {
      toast.danger("Ocurrió un error inesperado al registrar el pago.");
    } finally {
      setIsLoading(false);
    }
  };

  let defaultPersonOption: IPersonOption | undefined = undefined;
  if (charge.membershipCharges?.[0]?.playerMembership?.player?.person) {
    const person = charge.membershipCharges[0].playerMembership.player.person;
    defaultPersonOption = {
      id: person.id,
      name: person.name,
      lastName: person.lastName,
      secondLastName: person.secondLastName || null,
      documentNumber: person.documentNumber || null,
      gender: person.gender || null,
      birthDate: person.birthDate || null,
      imageUrl: person.imageUrl || null,
      fullName: `${person.name} ${person.lastName}`.trim(),
    } as IPersonOption;
  } else if (charge.studentCharges?.[0]?.studentMembership?.student?.person) {
    const person = charge.studentCharges[0].studentMembership.student.person;
    defaultPersonOption = {
      id: person.id,
      name: person.name,
      lastName: person.lastName,
      secondLastName: person.secondLastName || null,
      documentNumber: person.documentNumber || null,
      gender: person.gender || null,
      birthDate: person.birthDate || null,
      imageUrl: person.imageUrl || null,
      fullName: `${person.name} ${person.lastName}`.trim(),
    } as IPersonOption;
  }

  return (
    <>
      <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Drawer.Content placement="right">
          <Drawer.Dialog className="w-full sm:max-w-md" aria-label="Registrar Pago">
            <Drawer.CloseTrigger />
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <Drawer.Header className="flex flex-col gap-1 border-b border-border">
                <Drawer.Heading className="text-xl font-bold flex items-center gap-2">
                  <HugeiconsIcon icon={Wallet01Icon} />
                  Registrar Pago
                </Drawer.Heading>
                <p className="mt-1 text-xs font-medium text-muted">
                  {charge.description}
                </p>
              </Drawer.Header>

              <Drawer.Body className="gap-6 pt-6">
                <Card className="border border-outline-variant/30 shadow-none bg-surface-container-low mb-2">
                  <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-primary-600">Monto Base</span>
                    <span
                      className={`font-semibold ${Number(charge.adjustmentAmount) !== 0 ? "line-through text-primary-400" : "text-primary-700"}`}
                    >
                      {Number(charge.amount).toFixed(2)} Bs
                    </span>
                  </div>
                  {Number(charge.adjustmentAmount) !== 0 && (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-primary-600">
                          {Number(charge.adjustmentAmount) < 0 ? "Descuento" : "Recargo"}
                        </span>
                        <span className={`font-semibold ${Number(charge.adjustmentAmount) < 0 ? "text-success-600" : "text-danger-600"}`}>
                          {Number(charge.adjustmentAmount) > 0 ? "+" : "-"}{Math.abs(Number(charge.adjustmentAmount)).toFixed(2)} Bs
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-t border-primary-200 border-dashed pt-2 mt-1">
                        <span className="text-primary-600 font-medium">
                          Total Esperado
                        </span>
                        <span className="font-bold text-primary-700">
                          {(
                            Number(charge.amount) +
                            Number(charge.adjustmentAmount)
                          ).toFixed(2)}{" "}
                          Bs
                        </span>
                      </div>
                    </>
                  )}

                  {Number(charge.amount) +
                    Number(charge.adjustmentAmount || 0) -
                    pendingAmount >
                    0 && (
                    <div className="flex justify-between items-center text-sm text-warning-600">
                      <span>Abonado hasta ahora</span>
                      <span className="font-semibold text-warning-600">
                        -
                        {(
                          Number(charge.amount) +
                          Number(charge.adjustmentAmount || 0) -
                          pendingAmount
                        ).toFixed(2)}{" "}
                        Bs
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-primary-200 pt-2 mt-1">
                    <span className="text-primary-700 font-medium">
                      Saldo a Pagar
                    </span>
                    <span className="text-2xl font-bold text-primary font-mono">
                      {pendingAmount.toFixed(2)} Bs
                    </span>
                  </div>
                </div>
                </Card>

                <SelectOrCreatePerson
                  personId={personId}
                  setPersonId={setPersonId}
                  setSelectedPerson={setSelectedPerson}
                  defaultPerson={defaultPersonOption}
                  // isDisabled={noPlayers}
                  label="Pagador"
                  errors={errors}
                />

                <PaymentDistributionsList
                  splits={splits}
                  setSplits={setSplits}
                  financialAccounts={financialAccounts}
                />

                <div className="w-full">
                  <DatePicker
                    className="w-full"
                    name="date"
                    value={transactionDate}
                    onChange={setTransactionDate}
                  >
                    <Label>Fecha de Recepción (Comprobante)</Label>
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
                      <Calendar aria-label="Event date">
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
                </div>

                <TextField
                  className="w-full"
                  name="notes"
                  isInvalid={!!errors.notes || undefined}
                >
                  <Label>Notas adicionales</Label>
                  <TextArea
                    variant="secondary"
                    placeholder="Opcional..."
                    rows={3}
                    value={notes}
                    onChange={(e) => {
                      setNotes(e.target.value);
                      setErrors({});
                    }}
                  />
                  <FieldError children={errors.notes && <> {errors.notes}</>} />
                </TextField>
              </Drawer.Body>
              <Drawer.Footer className="border-t border-border flex justify-end gap-3">
                <Button
                  variant="danger-soft"
                  onPress={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button variant="primary" type="submit" isPending={isLoading}>
                  Confirmar Pago
                </Button>
              </Drawer.Footer>
            </form>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>

      <PrintReportDialog
        transactionId={printTransactionId}
        isOpen={showPrintDialog}
        onOpenChange={(isOpen) => {
          setShowPrintDialog(isOpen);
          if (!isOpen) {
            onOpenChange(false);
            setPrintTransactionId(null);
          }
        }}
        onSuccess={() => {
          onOpenChange(false);
        }}
      />
    </>
  );
};

