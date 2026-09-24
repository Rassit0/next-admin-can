"use client";
import { Button, Modal, ProgressCircle, useOverlayState } from "@heroui/react";
import { Add01Icon, Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { PromotionForm } from "../form/PromotionForm";

interface Props {
  buttonLabel?: string;
  buttonIcon?: any;
}

export const AddPromotionModal = ({
  buttonLabel = "Ai±adir Promotion",
  buttonIcon = Add01Icon,
}: Props) => {
  const state = useOverlayState();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Button
        onPress={() => state.open()}
        className="bg-on-surface text-surface hover:bg-on-surface-variant flex"
      >
        <HugeiconsIcon icon={buttonIcon} />
        {buttonLabel}
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
                <Modal.Heading>Agregar Promotion</Modal.Heading>
              </div>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Agrega un nuevo promotion para el carrusel de la pi¡gina
                principal.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <PromotionForm
                formId="add-promotion-form"
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
                form="add-promotion-form"
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
