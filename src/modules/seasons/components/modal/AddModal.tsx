"use client";
import { Button, Modal, useOverlayState } from "@heroui/react";
import { Add01Icon, Layers01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { ButtonFloating } from "@/ui";
import { FormSeason } from "@/modules/seasons";

interface Props {
  isIcon?: boolean;
  institutionId: string;
  disciplineId: string;
}
export const AddModal = ({
  isIcon = false,
  institutionId,
  disciplineId,
}: Props) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);

  return (
    <Modal isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Button
        className="hidden md:flex"
        variant="primary"
        onPress={() => state.open()}
        isIconOnly={isIcon}
      >
        <HugeiconsIcon icon={Add01Icon} />
        {!isIcon && "Apertura de Temporada"}
      </Button>
      <ButtonFloating
        icon={
          <HugeiconsIcon icon={Add01Icon} className="h-6 w-6 text-background" />
        }
        onPress={() => state.open()}
        // text="Agregar Disciplina"
      />
      <Modal.Backdrop>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <HugeiconsIcon icon={Layers01Icon} />
              </Modal.Icon>
              <Modal.Heading>Agregar Club</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Agrega un nuevo club al sistema.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <FormSeason
                formId="add-season-form"
                institutionId={institutionId}
                disciplineId={disciplineId}
                onSubmited={() => state.close()}
                isLoading={loading}
                setIsLoading={setLoading}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onPress={() => state.close()}
                isDisabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="add-season-form"
                // isDisabled={loading}
                isPending={loading}
              >
                Guardar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
