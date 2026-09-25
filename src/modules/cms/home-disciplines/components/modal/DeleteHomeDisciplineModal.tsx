"use client";
import { Button, Modal } from "@heroui/react";
import { DeleteIcon, Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteHomeDiscipline } from "../../actions/delete";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
}

export const DeleteHomeDisciplineModal = ({ isOpen, setIsOpen, id }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await deleteHomeDiscipline(id);
    setIsLoading(false);

    if (res.error) {
      toast.error("Error al eliminar", { description: res.message });
      return;
    }

    toast.success("Bloque eliminado correctamente");
    setIsOpen(false);
    router.refresh();
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
      <Modal.Container placement="auto" scroll="outside">
        <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
          <Modal.CloseTrigger />
          <Modal.Header>
            <div className="flex gap-2 items-center ">
              <Modal.Icon className="bg-danger/20 text-danger">
                <HugeiconsIcon icon={Alert02Icon} />
              </Modal.Icon>
              <Modal.Heading>Eliminar Bloque</Modal.Heading>
            </div>
          </Modal.Header>
          <Modal.Body className="px-6 py-4">
            <p className="text-sm text-default-500">
              ¿Estás seguro de que deseas eliminar este bloque? Esta acción no
              se puede deshacer y el bloque dejará de ser visible de inmediato.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onPress={() => setIsOpen(false)}
              isDisabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              className="text-white"
              onPress={handleDelete}
              isPending={isLoading}
            >
              Sí­, eliminar
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
