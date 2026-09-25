"use client";
import { Button, Modal, ProgressCircle, useOverlayState } from "@heroui/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { deleteNews } from "../../actions/delete";

interface Props {
  id: string;
  slug: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const DeleteNewsModal = ({ id, slug, isOpen, setIsOpen }: Props) => {
  const state = useOverlayState({ isOpen, onOpenChange: setIsOpen });
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await deleteNews(id, slug);
    setIsLoading(false);

    if (res.error) {
      toast.error("Error al eliminar", { description: res.message });
      return;
    }

    toast.success("Noticia eliminada correctamente");
    state.close();
  };

  return (
    <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Container placement="auto" scroll="outside">
        <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
          <Modal.CloseTrigger />
          <Modal.Header>
            <div className="flex gap-2 items-center ">
              <Modal.Icon className="bg-danger/10 text-danger">
                <HugeiconsIcon icon={Delete02Icon} />
              </Modal.Icon>
              <Modal.Heading>Eliminar Noticia</Modal.Heading>
            </div>
          </Modal.Header>
          <Modal.Body className="p-6">
            <p className="text-sm text-muted">
              ¿Estás seguro de que deseas eliminar esta noticia? Esta accón
              no se puede deshacer.
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
                <ProgressCircle isIndeterminate aria-label="Loading" size="sm">
                  <ProgressCircle.Track>
                    <ProgressCircle.TrackCircle />
                    <ProgressCircle.FillCircle />
                  </ProgressCircle.Track>
                </ProgressCircle>
              )}
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
