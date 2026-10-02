"use client";
import { Button, Modal, ProgressCircle, useOverlayState } from "@heroui/react";
import { Edit02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { SponsorForm } from "../form/SponsorForm";
import { ISponsor } from "../../interfaces/sponsor.interface";

interface Props {
  sponsor: ISponsor;
}

export const EditSponsorModal = ({ sponsor }: Props) => {
  const state = useOverlayState();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        onPress={() => state.open()}
        isIconOnly
        size="sm"
      >
        <HugeiconsIcon icon={Edit02Icon} className="w-4 h-4" />
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-lg bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex gap-2 items-center ">
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                  <HugeiconsIcon icon={UserIcon} />
                </Modal.Icon>
                <Modal.Heading>Editar Auspiciador</Modal.Heading>
              </div>
            </Modal.Header>
            <Modal.Body className="p-6">
              <SponsorForm
                sponsor={sponsor}
                formId={`edit-sponsor-form-${sponsor.id}`}
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
                form={`edit-sponsor-form-${sponsor.id}`}
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
                {!isLoading && "Guardar"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
