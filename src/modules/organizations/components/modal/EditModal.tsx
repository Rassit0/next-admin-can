"use client";
import { Button, Modal, ProgressCircle, useOverlayState } from "@heroui/react";
import { Edit03Icon, Layers01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FormOrganization } from "../form/Form";
import { useState } from "react";
import { IOrganization } from "@/modules/organizations";

interface Props {
  organization: IOrganization;
  isIcon?: boolean;
  showButton?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const EditModal = ({
  organization,
  isIcon = false,
  showButton = true,
  isOpen,
  onOpenChange,
}: Props) => {
  const state = useOverlayState({ isOpen, onOpenChange });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {showButton && (
        <Button
          isIconOnly={isIcon}
          variant={!isIcon ? "primary" : "ghost"}
          onPress={() => state.open()}
        >
          <HugeiconsIcon icon={Edit03Icon} />
          {!isIcon && "Editar"}
        </Button>
      )}
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex gap-2 items-center ">
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                  <HugeiconsIcon icon={Layers01Icon} />
                </Modal.Icon>
                <Modal.Heading>Editar Escuela {organization.id}</Modal.Heading>
              </div>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Edita la información de la escuela {organization.name}.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <FormOrganization
                formId="edit-organization-form"
                organization={organization}
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
                form="edit-organization-form"
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
