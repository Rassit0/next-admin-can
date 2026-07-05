"use client";
import { Button, Modal, ProgressCircle, useOverlayState } from "@heroui/react";
import {
  Edit01Icon,
  Edit03Icon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FormDiscipline } from "../form/Form";
import { useState } from "react";
import { IDiscipline } from "@/modules/disciplines";

interface Props {
  discipline: IDiscipline;
  isIcon?: boolean;
  showButton?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const EditModal = ({
  discipline,
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
          {!isIcon && "Editar Disciplina"}
        </Button>
      )}
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex gap-2 items-center ">
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                  <HugeiconsIcon icon={Layers01Icon} />
                </Modal.Icon>
                <Modal.Heading>Agregar Disciplina</Modal.Heading>
              </div>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Agrega una nueva disciplina al sistema.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <FormDiscipline
                formId="edit-discipline-form"
                discipline={discipline}
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
                form="edit-discipline-form"
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
