"use client";
import { Button, Modal, toast, useOverlayState } from "@heroui/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { deleteShift } from "@/modules/shifts";

interface Props {
  id: string;
}
export const DeleteModal = ({ id }: Props) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteShift(id);
    setLoading(false);
    if (res.error) {
      toast.danger(res.message);
      return;
    }
    toast.success(res.message);
    state.close();
  };

  return (
    <Modal>
      <Button
        variant="danger-soft"
        size="sm"
        isIconOnly
        onPress={() => state.open()}
      >
        <HugeiconsIcon icon={Delete02Icon} />
      </Button>
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-danger/10 text-danger">
                <HugeiconsIcon icon={Delete02Icon} />
              </Modal.Icon>
              <Modal.Heading>Eliminar Turno</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                ¿Estás seguro de que deseas eliminar este turno? Esta acción no
                se puede deshacer.
              </p>
            </Modal.Header>
            <Modal.Body className="hidden" />
            <Modal.Footer>
              <Button
                variant="secondary"
                onPress={() => state.close()}
                isDisabled={loading}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onPress={handleDelete}
                isPending={loading}
              >
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
