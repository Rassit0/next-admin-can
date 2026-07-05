"use client";
import {
  Alert,
  AlertDialog,
  Button,
  Calendar,
  Card,
  DateField,
  DatePicker,
  FieldError,
  Label,
  TextArea,
  TextField,
  toast,
  useOverlayState,
} from "@heroui/react";
import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  extendTeamSeason,
  finalizeTeamSeason,
  ITeamSeason,
} from "@/modules/team-membership-offerings";
import { DateValue, getLocalTimeZone } from "@internationalized/date";

interface Props {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  teamSeason: ITeamSeason;
}
export const ExtendModal = ({ isOpen, onOpenChange, teamSeason }: Props) => {
  const state = useOverlayState({ isOpen, onOpenChange });
  const [isLoading, setIsLoading] = useState(false);
  const [newEndDate, setNewEndDate] = useState<DateValue | null>(null);
  const [reason, setReason] = useState("");

  const handleExtend = async () => {
    if (!reason) {
      toast.danger("Debe ingresar un motivo de extensión");
      return;
    }
    if (!newEndDate) {
      toast.danger("Debe seleccionar una fecha de finalización");
      return;
    }
    setIsLoading(true);
    const res = await extendTeamSeason(teamSeason.id, {
      newEndDate: newEndDate.toDate(getLocalTimeZone()),
      reason,
    });
    setIsLoading(false);
    if (res.error) {
      let errorDescription = res.message;

      if (res.errors) {
        // Convertimos el objeto { type: ["msg"] } en una lista de strings limpia
        errorDescription = Object.entries(res.errors)
          .map(([field, messages]) => {
            const msgList = Array.isArray(messages)
              ? messages.join(", ")
              : messages;
            return `${field}: ${msgList}`;
          })
          .join("\n"); // Los separamos por saltos de línea para el toast
      }

      // 2. Pasamos la descripción formateada al componente de notificaciones
      toast.danger(
        res.errors ? "Error al extender la temporada" : res.message,
        {
          description: errorDescription,
        },
      );
      return;
    }
    toast.success(res.message, {
      description: res.message,
    });
    state.setOpen(false);
  };

  return (
    <AlertDialog.Backdrop
      isOpen={state.isOpen}
      onOpenChange={state.setOpen}
      className="bg-linear-to-t from-yellow-900/90 via-yellow-900/50 to-transparent dark:from-yellow-900/95 dark:via-yellow-900/60"
      variant="blur"
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-105">
          <AlertDialog.CloseTrigger />
          <AlertDialog.Header className="items-center text-center">
            <AlertDialog.Icon status="warning">
              <HugeiconsIcon icon={Alert02Icon} />
            </AlertDialog.Icon>
            <AlertDialog.Heading className="flex flex-col">
              <span>Extender Temporada</span>
              <span className="text-muted">
                Estás por extender el ciclo de {teamSeason.name}
              </span>
            </AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <Alert status="warning">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>
                  ¿Estás seguro de extender la temporada?
                </Alert.Title>
                <Alert.Description>
                  Se extenderá la temporada y las membresías se actualizarán
                  automáticamente.
                </Alert.Description>
              </Alert.Content>
            </Alert>
            <div className="flex justify-between">
              <Card variant="tertiary">
                <Card.Header>
                  <Card.Title>MIEMBROS ACTIVOS</Card.Title>
                </Card.Header>
                <Card.Content className="text-2xl font-bold text-accent">
                  43
                </Card.Content>
              </Card>
              <Card variant="tertiary">
                <Card.Header>
                  <Card.Title>COBRANZA COMPLETADA</Card.Title>
                </Card.Header>
                <Card.Content className="text-2xl font-bold text-accent">
                  85%
                </Card.Content>
              </Card>
            </div>

            <div className="p-2">
              <DatePicker
                isRequired
                isInvalid={!newEndDate}
                name="new"
                hideTimeZone
                value={newEndDate}
                onChange={setNewEndDate}
              >
                <Label>Nueva Fecha de Finalización</Label>
                <DateField.Group variant="secondary" fullWidth>
                  <DateField.Input>
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                  <DateField.Suffix>
                    <DatePicker.Trigger>
                      <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                  </DateField.Suffix>
                </DateField.Group>
                <FieldError
                  children={
                    !newEndDate && (
                      <>Debe seleccionar una fecha de finalización</>
                    )
                  }
                />

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
                        {({ year }) => <Calendar.YearPickerCell year={year} />}
                      </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                  </Calendar>
                </DatePicker.Popover>
              </DatePicker>

              <TextField
                isRequired
                className="w-full"
                isInvalid={!reason}
                name="reason"
                value={reason}
                onChange={setReason}
              >
                <Label>Motivo de Finalización</Label>
                <TextArea placeholder="Describe brevemente los motivos de la finalización anticipada..." />
                <FieldError>
                  {!reason && "Debe ingresar un motivo de cancelación"}
                </FieldError>
              </TextField>
            </div>
          </AlertDialog.Body>
          <AlertDialog.Footer className="flex-col-reverse">
            <Button className="w-full" slot="close" isDisabled={isLoading}>
              Cancelar
            </Button>
            <Button
              className="w-full"
              onPress={handleExtend}
              isPending={isLoading}
              variant="danger"
            >
              Sí, extender
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
};
