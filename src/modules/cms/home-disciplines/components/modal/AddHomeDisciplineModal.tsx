"use client";
import { Button, Modal, ProgressCircle, useOverlayState } from "@heroui/react";
import { Add01Icon, Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { HomeDisciplineForm } from "../form/HomeDisciplineForm";

interface Props {
  buttonFloatingMobile?: boolean;
}

export const AddHomeDisciplineModal = ({ buttonFloatingMobile }: Props) => {
  const state = useOverlayState();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Button
        onPress={() => state.open()}
        className={`bg-on-surface text-surface hover:bg-on-surface-variant flex ${
          buttonFloatingMobile
            ? "fixed md:relative bottom-6 md:bottom-auto right-6 md:right-auto shadow-xl md:shadow-none z-50 md:z-auto"
            : ""
        }`}
      >
        <HugeiconsIcon icon={Add01Icon} />
        Crear Bloque
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-4xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex gap-2 items-center ">
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                  <HugeiconsIcon icon={Image01Icon} />
                </Modal.Icon>
                <Modal.Heading>Agregar Bloque (Equipos/Escuela)</Modal.Heading>
              </div>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Agrega un nuevo bloque de Equipos o Escuela de Fútbol para el Home.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <HomeDisciplineForm
                formId="add-home-discipline-form"
                onSubmited={() => state.close()}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onPress={() => state.close()}
                isDisabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="add-home-discipline-form"
                isPending={isLoading}
              >
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
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
