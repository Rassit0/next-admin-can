"use client";

import {
  Drawer,
  Button,
  InputGroup,
  TextField,
  Label,
  DatePicker,
  DateField,
  Calendar,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Money01Icon,
  Calendar02Icon,
  Note01Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addManualCharge } from "../../actions/add-manual-charge";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  studentMembershipId: string;
}

export const CreateManualChargeDrawer = ({
  isOpen,
  onOpenChange,
  studentMembershipId,
}: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const amount = Number(formData.get("amount"));
      const description = formData.get("description") as string;
      const dueDate = formData.get("dueDate") as string;

      if (amount <= 0) {
        toast.error("El monto debe ser mayor a 0.");
        return;
      }

      const res = await addManualCharge({
        membershipId: studentMembershipId,
        amount,
        description,
        dueDate: new Date(dueDate).toISOString(),
      });

      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.refresh();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado al registrar el cargo extra.");
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
            <Drawer.Header className="border-b border-border">
              <div>
                <Drawer.Heading className="text-lg font-bold flex items-center gap-2">
                  <HugeiconsIcon icon={Money01Icon} />
                  Crear Cargo Extra
                </Drawer.Heading>
                <p className="mt-1 text-xs font-medium text-muted">
                  Asigna un cargo manual (ej. multas, uniformes) a este jugador.
                </p>
              </div>
            </Drawer.Header>

            <Drawer.Body className="flex flex-col gap-5 pt-6">
              <TextField
                name="description"
                isRequired
                className="w-full"
                variant="secondary"
              >
                <Label className="text-sm font-semibold">
                  Descripción del Cargo
                </Label>
                <InputGroup>
                  <InputGroup.Prefix>
                    <HugeiconsIcon
                      icon={Note01Icon}
                      size={18}
                      className="text-muted-foreground"
                    />
                  </InputGroup.Prefix>
                  <InputGroup.Input placeholder="Ej. Cuota de Equipamiento Extra" />
                </InputGroup>
              </TextField>

              <TextField
                name="amount"
                isRequired
                className="w-full"
                variant="secondary"
              >
                <Label className="text-sm font-semibold">Monto (Bs)</Label>
                <InputGroup>
                  <InputGroup.Prefix>
                    <span className="text-muted-foreground font-bold text-sm">
                      Bs
                    </span>
                  </InputGroup.Prefix>
                  <InputGroup.Input type="number" step="0.01" min="0.01" />
                </InputGroup>
              </TextField>

              <DatePicker
                name="dueDate"
                isRequired
                className="w-full"
                defaultValue={today(getLocalTimeZone())}
              >
                <Label className="text-sm font-semibold">
                  Fecha Límite de Pago (Vencimiento)
                </Label>
                <DateField.Group variant="secondary">
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
                  <Calendar aria-label="Fecha Límite de Pago">
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
            </Drawer.Body>

            <Drawer.Footer className="border-t border-border">
              <Button
                variant="secondary"
                onPress={() => onOpenChange(false)}
                className="font-medium"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                isPending={isLoading}
                className="font-semibold"
              >
                Generar Cargo
              </Button>
            </Drawer.Footer>
          </form>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
