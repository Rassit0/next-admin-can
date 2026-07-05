"use client";
import { ITeam } from "@/modules/teams";
import {
  Alert,
  AlertDialog,
  Button,
  Card,
  ProgressCircle,
  useOverlayState,
} from "@heroui/react";
import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface Props {
  isLoading: boolean;
  team: ITeam;
  formId: string;
}

export const AlertEditDialog = ({ isLoading, team, formId }: Props) => {
  const state = useOverlayState();

  return (
    <AlertDialog>
      <Button type="button" onPress={() => state.open()}>
        {isLoading && (
          <ProgressCircle isIndeterminate aria-label="Loading">
            <ProgressCircle.Track>
              <ProgressCircle.TrackCircle />
              <ProgressCircle.FillCircle />
            </ProgressCircle.Track>
          </ProgressCircle>
        )}
        Guardar
      </Button>
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
                <span>Actualizar Equipo</span>
                <span className="text-muted">
                  Estás por modificar la configuración de {team.name}
                </span>
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Alert status="warning">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>
                    ¿Estás seguro de modificar la configuración del equipo?
                  </Alert.Title>

                  <Alert.Description>
                    Los cambios en el género o en los límites de edad pueden
                    afectar a los jugadores asociados a este equipo. Los pases
                    que ya no cumplan con los criterios establecidos podrán ser
                    marcados para revisión o inactivados.
                  </Alert.Description>
                </Alert.Content>
              </Alert>
            </AlertDialog.Body>
            <AlertDialog.Footer className="flex-col-reverse">
              <Button className="w-full" slot="close" isDisabled={isLoading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                form={formId}
                className="w-full"
                isPending={isLoading}
                onPress={() => state.close()}
                variant="danger"
              >
                Sí, modificar
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};
