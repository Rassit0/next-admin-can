"use client";
import { useState } from "react";
import { AlertDialog, Button } from "@heroui/react";
import { toast } from "sonner";
import { deletePersonContact } from "@/modules/persons/actions/delete-person-contact";
import { revalidatePersonContactsCache } from "../../actions/revalidate-contacts";
import { IPersonContact } from "@/modules/persons/interfaces/person-contact.interface";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  personId: string;
  contact: IPersonContact | null;
  onSuccess?: () => void;
}

export const DeleteContactModal = ({
  isOpen,
  onOpenChange,
  personId,
  contact,
  onSuccess,
}: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!contact) return;
    setIsDeleting(true);
    try {
      const res = await deletePersonContact(personId, contact.contactPersonId);
      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        await revalidatePersonContactsCache(personId);
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error) {
      toast.error("Error inesperado al eliminar el contacto");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog.Backdrop
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-md">
          <AlertDialog.CloseTrigger />
          <AlertDialog.Header>
            <AlertDialog.Icon status="danger" />
            <AlertDialog.Heading>Eliminar Contacto</AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <p>
              ¿Estás seguro que deseas eliminar a{" "}
              <strong>
                {contact?.contactPerson.name} {contact?.contactPerson.lastName}
              </strong>{" "}
              de los contactos? Esta acción no se puede deshacer.
            </p>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              variant="outline"
              onPress={() => onOpenChange(false)}
              isDisabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onPress={handleDelete}
              isDisabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
};
