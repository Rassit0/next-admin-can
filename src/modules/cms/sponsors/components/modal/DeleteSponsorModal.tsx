"use client";
import { Button, Modal, ProgressCircle, useOverlayState } from "@heroui/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";
import { ISponsor } from "../../interfaces/sponsor.interface";
import { deleteSponsor } from "../../actions/delete";

interface Props {
  sponsor: ISponsor;
}

export const DeleteSponsorModal = ({ sponsor }: Props) => {
  const state = useOverlayState();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await deleteSponsor(sponsor.id);
    setIsLoading(false);

    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      state.close();
    }
  };

  return (
    <>
      <Button
        variant="danger"
        onPress={() => state.open()}
        isIconOnly
        size="sm"
      >
        <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" />
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-sm">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex gap-2 items-center text-danger">
                <Modal.Icon className="bg-danger/20 text-danger">
                  <HugeiconsIcon icon={Delete02Icon} />
                </Modal.Icon>
                <Modal.Heading>Eliminar auspiciador</Modal.Heading>
              </div>
            </Modal.Header>
            <Modal.Body className="p-6">
              <p className="text-sm">
                ¿Estás seguro que deseas eliminar el auspiciador{" "}
                <strong>{sponsor.name}</strong>? Esta acción no se puede
                deshacer.
              </p>
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
                variant="danger"
                onPress={handleDelete}
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
                {!isLoading && "Eliminar"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
