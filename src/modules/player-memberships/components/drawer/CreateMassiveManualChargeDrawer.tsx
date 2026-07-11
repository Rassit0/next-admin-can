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
  AlertDialog,
  useOverlayState,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar02Icon,
  Note01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addMassiveManualCharge } from "../../actions/add-massive-manual-charge";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  teamSeasonId: string;
}

export const CreateMassiveManualChargeDrawer = ({
  isOpen,
  onOpenChange,
  teamSeasonId,
}: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const confirmState = useOverlayState();
  const [pendingData, setPendingData] = useState<{
    amount: number;
    description: string;
    dueDate: string;
  } | null>(null);

  const handlePreSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    const description = formData.get("description") as string;
    const dueDate = formData.get("dueDate") as string;

    if (amount <= 0) {
      toast.error("El monto debe ser mayor a 0.");
      return;
    }

    setPendingData({ amount, description, dueDate });
    confirmState.open();
  };

  const handleConfirm = async () => {
    if (!pendingData) return;

    setIsLoading(true);

    try {
      const res = await addMassiveManualCharge({
        teamSeasonId,
        amount: pendingData.amount,
        description: pendingData.description,
        dueDate: new Date(pendingData.dueDate).toISOString(),
      });

      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.refresh();
        confirmState.close();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado al generar los cargos masivos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Drawer.Content placement="right">
          <Drawer.Dialog className="w-full sm:max-w-md">
            <Drawer.CloseTrigger />
            <form onSubmit={handlePreSubmit} className="flex flex-col h-full">
              <Drawer.Header className="border-b border-border">
                <div>
                  <Drawer.Heading className="text-lg font-bold flex items-center gap-2">
                    <HugeiconsIcon icon={UserGroupIcon} />
                    Generar Cargo Masivo
                  </Drawer.Heading>
                  <p className="mt-1 text-xs font-medium text-warning-500">
                    Atención: Se aplicará este cargo a TODOS los miembros
                    activos y pendientes de esta temporada.
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
                    <InputGroup.Input placeholder="Ej. Inscripción a Torneo, Equipamiento General..." />
                  </InputGroup>
                </TextField>

                <TextField
                  name="amount"
                  isRequired
                  className="w-full"
                  variant="secondary"
                >
                  <Label className="text-sm font-semibold">
                    Monto por Jugador (Bs)
                  </Label>
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
                          {({ year }) => (
                            <Calendar.YearPickerCell year={year} />
                          )}
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
                  className="font-semibold"
                >
                  Generar Cargos Masivos
                </Button>
              </Drawer.Footer>
            </form>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>

      <AlertDialog.Backdrop
        isOpen={confirmState.isOpen}
        onOpenChange={confirmState.setOpen}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                Confirmar Generación Masiva
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                ¿Estás seguro de generar este cargo de{" "}
                <strong>{pendingData?.amount} Bs</strong> a TODOS los miembros
                activos y pendientes?
                <br />
                <br />
                Esta acción no se puede deshacer de forma masiva.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                variant="tertiary"
                onPress={confirmState.close}
                isDisabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onPress={handleConfirm}
                isPending={isLoading}
              >
                Confirmar
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
};
