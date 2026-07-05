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
  deleteTeamSeason,
  finalizeTeamSeason,
  ITeamSeason,
} from "@/modules/team-membership-offerings";

interface Props {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  teamSeason: ITeamSeason;
}
export const DeleteModal = ({ isOpen, onOpenChange, teamSeason }: Props) => {
  const state = useOverlayState({ isOpen, onOpenChange });
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    const res = await deleteTeamSeason(teamSeason.id);
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
    <AlertDialog.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-[400px]">
          <AlertDialog.CloseTrigger />
          <AlertDialog.Header>
            <AlertDialog.Icon status="danger" />
            <AlertDialog.Heading>
              ¿Eliminar Temporada Permanentemente?
            </AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <p>
              Se eliminará permanentemente la temporada{" "}
              <strong>{teamSeason.name}</strong> y todos sus datos. Esta acción
              no se puede deshacer.
            </p>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button slot="close" variant="tertiary" isDisabled={isLoading}>
              Cancelar
            </Button>
            <Button
              slot="close"
              variant="danger"
              isPending={isLoading}
              onPress={handleDelete}
            >
              Eliminar Temporada
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
};
