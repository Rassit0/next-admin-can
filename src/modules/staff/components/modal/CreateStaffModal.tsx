"use client";
import {
  Button,
  Modal,
} from "@heroui/react";
import { useState } from "react";
import { SelectOrCreatePerson } from "../form/SelectOrCreatePerson";
import { createStaff, IStaff } from "@/modules/staff";
import { toast } from "@heroui/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface Props {
  onSubmited?: (staff: IStaff) => void;
  isIcon?: boolean;
}

export const CreateStaffModal = ({ onSubmited, isIcon }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [personId, setPersonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRemoveError = (fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const handleSubmit = async () => {
    if (!personId) {
      setErrors({ personId: "Seleccione una persona" });
      return;
    }

    setLoading(true);
    const res = await createStaff(personId);
    setLoading(false);

    if (res.error) {
      toast.danger("Error al registrar personal", {
        description: res.message,
      });
      return;
    }

    if (res.data) {
      toast.success("Personal registrado", {
        description: res.message,
      });
      if (onSubmited) {
        onSubmited(res.data);
      }
      setIsOpen(false);
      setPersonId(null);
    }
  };

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        variant="primary"
        isIconOnly={isIcon}
      >
        <HugeiconsIcon icon={Add01Icon} size={20} />
        {!isIcon && "Nuevo Personal"}
      </Button>

      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Container placement="center">
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Registrar Personal</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="pb-4">
              <SelectOrCreatePerson
                label="Seleccionar Persona"
                personId={personId}
                setPersonId={setPersonId}
                errors={errors}
                handleRemoveError={handleRemoveError}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onPress={handleSubmit}
                isDisabled={loading}
              >
                Registrar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
