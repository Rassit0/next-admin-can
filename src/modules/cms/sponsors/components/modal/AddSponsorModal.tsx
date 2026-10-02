"use client";
import { Button, Modal, ProgressCircle, useOverlayState } from "@heroui/react";
import { Add01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { SponsorForm } from "../form/SponsorForm";
import { ButtonFloating } from "@/ui";

interface Props {
  label?: string;
  isIcon?: boolean;
  buttonFloatingMobile?: boolean;
}

export const AddSponsorModal = ({
  label,
  isIcon = false,
  buttonFloatingMobile,
}: Props) => {
  const state = useOverlayState();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {!isIcon && (
        <Button
          className="hidden lg:flex"
          variant="primary"
          onPress={() => state.open()}
          isIconOnly={isIcon}
        >
          <HugeiconsIcon icon={Add01Icon} />
          {label || "Agregar auspiciador"}
        </Button>
      )}
      {isIcon && (
        <Button
          variant="primary"
          onPress={() => state.open()}
          isIconOnly={isIcon}
        >
          <HugeiconsIcon icon={Add01Icon} />
        </Button>
      )}
      {buttonFloatingMobile && (
        <ButtonFloating
          className="lg:hidden"
          icon={
            <HugeiconsIcon
              icon={Add01Icon}
              className="h-6 w-6 text-background"
            />
          }
          onPress={() => state.open()}
        />
      )}

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-lg bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex gap-2 items-center ">
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                  <HugeiconsIcon icon={UserIcon} />
                </Modal.Icon>
                <Modal.Heading>Agregar Auspiciador</Modal.Heading>
              </div>
            </Modal.Header>
            <Modal.Body className="p-6">
              <SponsorForm
                formId="add-sponsor-form"
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
                form="add-sponsor-form"
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
                {!isLoading && "Crear"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
