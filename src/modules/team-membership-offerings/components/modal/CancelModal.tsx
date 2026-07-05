"use client";
import {
  Alert,
  AlertDialog,
  Button,
  Card,
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
  cancelTeamSeason,
  finalizeTeamSeason,
  ITeamSeason,
} from "@/modules/team-membership-offerings";

interface Props {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  teamSeason: ITeamSeason;
}
export const CancelModal = ({ isOpen, onOpenChange, teamSeason }: Props) => {
  const state = useOverlayState({ isOpen, onOpenChange });
  const [isLoading, setIsLoading] = useState(false);
  const [statusNotes, setStatusNotes] = useState("");
  const handleFinalize = async () => {
    if (!statusNotes) {
      toast.danger("Debe ingresar un motivo de cancelación");
      return;
    }
    setIsLoading(true);
    const res = await cancelTeamSeason(teamSeason.id, statusNotes);
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
      toast.danger(res.message, {
        description: errorDescription,
      });
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
      className="bg-linear-to-t from-red-950/90 via-red-950/50 to-transparent dark:from-red-950/95 dark:via-red-950/60"
      variant="blur"
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-105">
          <AlertDialog.CloseTrigger />
          <AlertDialog.Header className="items-center text-center">
            <AlertDialog.Icon status="danger">
              <HugeiconsIcon icon={Alert02Icon} />
            </AlertDialog.Icon>
            <AlertDialog.Heading className="flex flex-col">
              <span>Cancelar Temporada</span>
              <span className="text-muted">
                Estás por cancelar el ciclo de {teamSeason.name}: Esta acción es
                irreversible
              </span>
            </AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>
                  ¿Estás seguro de cancelar la temporada?
                </Alert.Title>
                <Alert.Description>
                  Se bloquearán nuevas inscripciones y las membresías activas se
                  moverán al historial.
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
            <TextField
              isRequired
              className="w-full p-2"
              isInvalid={!statusNotes}
              name="reason"
              value={statusNotes}
              onChange={setStatusNotes}
            >
              <Label>Motivo de Cancelación</Label>
              <TextArea placeholder="Describe brevemente los motivos de la cancelación..." />
              <FieldError>
                {!statusNotes && "Debe ingresar un motivo de cancelación"}
              </FieldError>
            </TextField>
          </AlertDialog.Body>
          <AlertDialog.Footer className="flex-col-reverse">
            <Button className="w-full" slot="close" isDisabled={isLoading}>
              Cancelar
            </Button>
            <Button
              className="w-full"
              onPress={handleFinalize}
              isPending={isLoading}
              variant="danger"
            >
              Sí, cancelar
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
};
