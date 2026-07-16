"use client";
import React, { useState } from "react";
import {
  Alert,
  AlertDialog,
  Button,
  Tooltip,
  useOverlayState,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PauseIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { toggleBillingEngineCourseSeason } from "../../actions/toggle-billing";
import { toast } from "sonner";
import { ICourseSeasonBillingConfig } from "../../interfaces/course-season.interface";

interface Props {
  courseSeasonId: string;
  billingConfig?: ICourseSeasonBillingConfig;
}

export const ButtonToggleBillingEngine = ({
  courseSeasonId,
  billingConfig,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const state = useOverlayState();

  // Default to true if not provided (assume active)
  const isEngineActive = billingConfig?.isEngineActive ?? true;

  const handleToggle = async () => {
    setLoading(true);
    const result = await toggleBillingEngineCourseSeason(
      courseSeasonId,
      !isEngineActive,
    );

    if (result.error) {
      toast.error("Error", { description: result.message });
    } else {
      toast.success("Motor de cobros actualizado", {
        description: result.message,
      });
      state.close();
    }
    setLoading(false);
  };

  return (
    <AlertDialog>
      <Tooltip delay={0}>
        <Button
          isIconOnly
          size="sm"
          onPress={() => state.open()}
          className={`shadow-md transition-all duration-300 ${
            isEngineActive
              ? "bg-warning text-warning-foreground hover:bg-warning-hover"
              : "bg-success text-success-foreground hover:bg-success-hover"
          }`}
        >
          <HugeiconsIcon
            icon={isEngineActive ? PauseIcon : PlayIcon}
            stroke="2"
            size={18}
          />
        </Button>
        <Tooltip.Content
          className={isEngineActive ? "text-warning-600" : "text-success-600"}
        >
          <p>
            {isEngineActive
              ? "Pausar Motor de Cobros"
              : "Reanudar Motor de Cobros"}
          </p>
        </Tooltip.Content>
      </Tooltip>

      <AlertDialog.Backdrop
        isOpen={state.isOpen}
        onOpenChange={state.setOpen}
        className={
          isEngineActive
            ? "bg-linear-to-t from-warning-900/90 via-warning-900/50 to-transparent dark:from-warning-900/95 dark:via-warning-900/60"
            : "bg-linear-to-t from-success-900/90 via-success-900/50 to-transparent dark:from-success-900/95 dark:via-success-900/60"
        }
        variant="blur"
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-105">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header className="items-center text-center">
              <AlertDialog.Icon status={isEngineActive ? "warning" : "success"}>
                <HugeiconsIcon icon={isEngineActive ? PauseIcon : PlayIcon} />
              </AlertDialog.Icon>
              <AlertDialog.Heading className="flex flex-col">
                <span>
                  {isEngineActive ? "Pausar" : "Reanudar"} Motor de Cobros
                </span>
                <span className="text-muted">
                  Estás por {isEngineActive ? "detener" : "iniciar"} la
                  generación automática
                </span>
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Alert status={isEngineActive ? "warning" : "success"}>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>
                    ¿Estás seguro de {isEngineActive ? "pausar" : "reanudar"} el
                    motor de cobros para esta temporada?
                  </Alert.Title>

                  <Alert.Description>
                    {isEngineActive
                      ? "Al pausarlo, no se generarán nuevos cargos mensuales ni se aplicarán multas por atrasos a los miembros de esta temporada hasta que lo reanudes manualmente. Ideal si necesitas corregir configuraciones de precios."
                      : "Al reanudarlo, el sistema volverá a evaluar a todos los miembros de esta temporada para emitir sus mensualidades y multas correspondientes según el cronograma."}
                  </Alert.Description>
                </Alert.Content>
              </Alert>
            </AlertDialog.Body>
            <AlertDialog.Footer className="flex-col-reverse">
              <Button className="w-full" slot="close" isDisabled={loading}>
                Cancelar
              </Button>
              <Button
                isPending={loading}
                onPress={handleToggle}
                className={
                  isEngineActive
                    ? "bg-warning text-warning-foreground hover:bg-warning-hover"
                    : "bg-success text-success-foreground hover:bg-success-hover"
                }
              >
                Sí, {isEngineActive ? "pausar" : "reanudar"} motor
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};
