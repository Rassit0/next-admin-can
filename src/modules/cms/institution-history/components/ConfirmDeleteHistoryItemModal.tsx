"use client";

import { Modal, Button, useOverlayState } from "@heroui/react";
import { useState } from "react";
import { deleteInstitutionHistoryItemAction } from "../actions";
import { InstitutionHistoryItem } from "../services";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

export const ConfirmDeleteHistoryItemModal = ({
  item,
}: {
  item: InstitutionHistoryItem;
}) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteInstitutionHistoryItemAction(item.id);
      if (res.error) {
        toast.error(res.message || "Error al eliminar el hito");
      } else {
        toast.success(res.message || "Hito eliminado correctamente");
        state.setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado al eliminar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button isIconOnly variant="ghost" size="sm" onPress={() => state.open()}>
        <HugeiconsIcon icon={Delete02Icon} size={18} />
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-danger/20 text-danger">
                <HugeiconsIcon icon={Delete02Icon} size={24} />
              </Modal.Icon>
              <Modal.Heading>Confirmar Eliminación</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="px-6 py-4">
              <p>
                ÃÂ¿Estás seguro de que deseas eliminar el hito{" "}
                <strong>
                  {item.year} - {item.title}
                </strong>
                ? Esta acción no se puede deshacer.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={() => state.setOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                isPending={loading}
                onPress={handleDelete}
              >
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
