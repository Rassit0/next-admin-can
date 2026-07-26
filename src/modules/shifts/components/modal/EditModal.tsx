"use client";
import { Button, Modal, useOverlayState } from "@heroui/react";
import { Edit02Icon, Time02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { FormShift, IShift } from "@/modules/shifts";

interface Props {
  shift: IShift;
}

export const EditModal = ({ shift }: Props) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);

  return (
    <Modal>
      <Button
        variant="tertiary"
        size="sm"
        isIconOnly
        onPress={() => state.open()}
      >
        <HugeiconsIcon icon={Edit02Icon} />
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <HugeiconsIcon icon={Time02Icon} />
              </Modal.Icon>
              <Modal.Heading>Editar Turno</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Modifica los detalles del turno seleccionado.
              </p>
            </Modal.Header>
            <Modal.Body className="p-0 md:p-6">
              <FormShift
                shift={shift}
                formId={`edit-shift-form-${shift.id}`}
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
                form={`edit-shift-form-${shift.id}`}
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
