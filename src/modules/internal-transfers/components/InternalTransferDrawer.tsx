"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  Input,
  Button,
  Select,
  ListBox,
  Label,
  TextField,
  DatePicker,
  DateField,
  Calendar,
} from "@heroui/react";
import { toast } from "sonner";
import { createInternalTransfer } from "../actions/create";
import { FinancialAccount } from "../../financial-accounts/interfaces/financial-account.interface";
import { useRouter } from "next/navigation";
import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: FinancialAccount[];
  onSuccess?: () => void;
}

export const InternalTransferDrawer = ({
  isOpen,
  onOpenChange,
  accounts,
  onSuccess,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState<DateValue | null>(today(getLocalTimeZone()));

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setSourceAccountId("");
      setDestinationAccountId("");
      setDescription("");
      setReference("");
      setDate(today(getLocalTimeZone()));
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!amount || !sourceAccountId || !destinationAccountId) {
      toast.error("Monto, origen y destino son obligatorios");
      return;
    }

    if (sourceAccountId === destinationAccountId) {
      toast.error("La cuenta de origen y destino no pueden ser la misma");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createInternalTransfer({
        amount: Number(amount),
        sourceAccountId,
        destinationAccountId,
        description: description || undefined,
        reference: reference || undefined,
        date: date
          ? new Date(`${date.toString()}T12:00:00`).toISOString()
          : undefined,
      });

      if (response.error) {
        toast.error(response.message || "Error al crear la transferencia");
        return;
      }

      toast.success(
        response.message || "Transferencia registrada exitosamente",
      );
      onOpenChange(false);
      onSuccess?.();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  const activeAccounts = accounts.filter((a) => a.isActive);

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="w-full sm:max-w-md">
          <Drawer.CloseTrigger />
          <Drawer.Header className="flex flex-col gap-1 border-b border-border">
            <Drawer.Heading className="text-lg font-bold">
              Nueva Transferencia Interna
            </Drawer.Heading>
            <p className="text-sm font-normal text-default-500">
              Mueve fondos entre tus cuentas (ej. depósito de caja a banco).
            </p>
          </Drawer.Header>
          <Drawer.Body className="pb-6 mt-4">
            <div className="flex flex-col gap-4">
              <TextField
                className="w-full"
                name="amount"
                type="number"
                isRequired
              >
                <Label>Monto</Label>
                <Input
                  variant="secondary"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </TextField>

              <Select
                isRequired
                className="w-full"
                name="sourceAccountId"
                placeholder="Selecciona cuenta que envía"
                variant="secondary"
                selectedKey={sourceAccountId}
                onSelectionChange={(key) =>
                  setSourceAccountId(key ? String(key) : "")
                }
              >
                <Label>Cuenta de Origen</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {activeAccounts.map((acc) => (
                      <ListBox.Item
                        key={acc.id}
                        id={acc.id}
                        textValue={acc.name}
                      >
                        <div className="flex flex-col">
                          <span className="text-small">{acc.name}</span>
                          <span className="text-tiny text-default-400">
                            Saldo: {Number(acc.cachedBalance).toFixed(2)}
                          </span>
                        </div>
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <Select
                isRequired
                className="w-full"
                name="destinationAccountId"
                placeholder="Selecciona cuenta que recibe"
                variant="secondary"
                selectedKey={destinationAccountId}
                onSelectionChange={(key) =>
                  setDestinationAccountId(key ? String(key) : "")
                }
              >
                <Label>Cuenta de Destino</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {activeAccounts.map((acc) => (
                      <ListBox.Item
                        key={acc.id}
                        id={acc.id}
                        textValue={acc.name}
                      >
                        <div className="flex flex-col">
                          <span className="text-small">{acc.name}</span>
                          <span className="text-tiny text-default-400">
                            Saldo: {Number(acc.cachedBalance).toFixed(2)}
                          </span>
                        </div>
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <DatePicker
                className="w-full"
                name="date"
                value={date}
                onChange={setDate}
              >
                <Label>Fecha</Label>
                <DateField.Group fullWidth variant="secondary">
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
                  <Calendar aria-label="Seleccionar fecha">
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
                        {({ year }) => <Calendar.YearPickerCell year={year} />}
                      </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                  </Calendar>
                </DatePicker.Popover>
              </DatePicker>

              <TextField className="w-full" name="description" type="text">
                <Label>Descripción</Label>
                <Input
                  variant="secondary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej. Depósito del día"
                />
              </TextField>

              <TextField className="w-full" name="reference" type="text">
                <Label>Nro. de Referencia / Comprobante</Label>
                <Input
                  variant="secondary"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Opcional"
                />
              </TextField>
            </div>

            <div className="flex gap-2 justify-end mt-8">
              <Button variant="secondary" onPress={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onPress={handleSubmit}>
                {isLoading ? "Registrando..." : "Registrar Transferencia"}
              </Button>
            </div>
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
