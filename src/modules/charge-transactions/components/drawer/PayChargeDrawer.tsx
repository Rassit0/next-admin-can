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
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Wallet01Icon,
  Calendar02Icon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";
// import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ICharge } from "../../interfaces/charges.interface";
import { addTransaction } from "../../actions/add-transaction";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  charge: ICharge;
}

export const PayChargeDrawer = ({ isOpen, onOpenChange, charge }: Props) => {
  const router = useRouter();
  const pendingAmount = Number(charge.pendingAmount || 0);

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [amount, setAmount] = useState<string>(pendingAmount.toString());
  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().slice(0, 16),
  );
  const [reference, setReference] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setAmount(pendingAmount.toString());
      setTransactionDate(new Date().toISOString().slice(0, 16));
      setReference("");
      setNotes("");
      setPaymentMethod("CASH");
      setErrors({});
    }
  }, [isOpen, pendingAmount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const amountNum = Number(amount || pendingAmount);
      const method = paymentMethod as "CASH" | "TRANSFER" | "QR";

      if (pendingAmount > 0 && amountNum <= 0) {
        toast.danger(
          "El monto debe ser mayor a 0 si existe deuda pendiente.",
        );
        return;
      }

      if (amountNum < 0 || amountNum > pendingAmount) {
        toast.danger(
          "El monto no puede exceder el saldo pendiente ni ser negativo.",
        );
        return;
      }

      const res = await addTransaction({
        payerPersonId:
          charge.membershipCharges?.[0]?.playerMembership?.player?.person?.id ||
          charge.studentCharges?.[0]?.studentMembership?.student?.person?.id ||
          "",
        amount: amountNum,
        type: "INCOME",
        paymentMethod: method,
        reference,
        notes,
        transactionDate,
        description: `Pago para: ${charge.description}`,
        chargeTransactions: [
          {
            chargeId: charge.id,
            amountApplied: amountNum,
          },
        ],
      });

      if (res.error) {
        toast.danger(res.message);
      } else {
        toast.success(res.message);
        onOpenChange(false);
      }
    } catch (error) {
      toast.danger("Ocurrió un error inesperado al registrar el pago.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="w-full sm:max-w-md">
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
              <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-primary-600">Monto Base</span>
                  <span className={`font-semibold ${Number(charge.discountAmount) > 0 ? "line-through text-primary-400" : "text-primary-700"}`}>
                    {Number(charge.amount).toFixed(2)} Bs
                  </span>
                </div>
                {Number(charge.discountAmount) > 0 && (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary-600">Descuento</span>
                      <span className="font-semibold text-success-600">-{Number(charge.discountAmount).toFixed(2)} Bs</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-primary-200 border-dashed pt-2 mt-1">
                      <span className="text-primary-600 font-medium">Total Esperado</span>
                      <span className="font-bold text-primary-700">
                        {(Number(charge.amount) - Number(charge.discountAmount)).toFixed(2)} Bs
                      </span>
                    </div>
                  </>
                )}
                
                {Number(charge.amount) - Number(charge.discountAmount || 0) - pendingAmount > 0 && (
                  <div className="flex justify-between items-center text-sm text-warning-600">
                    <span>Abonado hasta ahora</span>
                    <span className="font-semibold text-warning-600">
                      -{(Number(charge.amount) - Number(charge.discountAmount || 0) - pendingAmount).toFixed(2)} Bs
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-primary-200 pt-2 mt-1">
                  <span className="text-primary-700 font-medium">Saldo a Pagar</span>
                  <span className="text-2xl font-bold text-primary font-mono">
                    {pendingAmount.toFixed(2)} Bs
                  </span>
                </div>
              </div>

              <TextField
                className="w-full"
                isRequired
                name="amount"
                isInvalid={!!errors.amount || undefined}
              >
                <Label>Monto a abonar (Bs)</Label>
                <Input
                  variant="secondary"
                  type="number"
                  step="0.01"
                  min={pendingAmount === 0 ? "0" : "0.01"}
                  max={pendingAmount}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setErrors({});
                  }}
                  placeholder="0.00"
                />
                <FieldError children={errors.amount && <> {errors.amount}</>} />
              </TextField>

              <TextField
                className="w-full"
                isRequired
                name="transactionDate"
                isInvalid={!!errors.transactionDate || undefined}
              >
                <Label>Fecha de Pago</Label>
                <Input
                  variant="secondary"
                  type="datetime-local"
                  value={transactionDate}
                  onChange={(e) => {
                    setTransactionDate(e.target.value);
                    setErrors({});
                  }}
                />
                <FieldError
                  children={
                    errors.transactionDate && <> {errors.transactionDate}</>
                  }
                />
              </TextField>

              <Select
                isRequired
                className="w-full"
                name="paymentMethod"
                placeholder="Seleccione el Método de Pago"
                variant="secondary"
                isInvalid={!!errors.paymentMethod || undefined}
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e?.toString() || "CASH");
                  setErrors({});
                }}
              >
                <Label>Método de Pago</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item
                      id="CASH"
                      textValue="Efectivo"
                      onPress={() => setPaymentMethod("CASH")}
                    >
                      Efectivo
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item
                      id="TRANSFER"
                      textValue="Transferencia"
                      onPress={() => setPaymentMethod("TRANSFER")}
                    >
                      Transferencia
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item
                      id="QR"
                      textValue="Código QR"
                      onPress={() => setPaymentMethod("QR")}
                    >
                      Código QR
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
                <FieldError
                  children={
                    errors.paymentMethod && <> {errors.paymentMethod}</>
                  }
                />
              </Select>

              <TextField
                className="w-full"
                name="reference"
                isInvalid={!!errors.reference || undefined}
              >
                <Label>Número de Referencia / Comprobante</Label>
                <Input
                  variant="secondary"
                  placeholder="Ej. 12345678"
                  value={reference}
                  onChange={(e) => {
                    setReference(e.target.value);
                    setErrors({});
                  }}
                />
                <FieldError
                  children={errors.reference && <> {errors.reference}</>}
                />
              </TextField>

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
              <Button variant="danger-soft" onPress={() => onOpenChange(false)}>
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
  );
};
