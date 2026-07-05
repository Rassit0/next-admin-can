"use client";
import { Button, Modal, ProgressCircle, useOverlayState } from "@heroui/react";
import {
  Edit01Icon,
  Edit03Icon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import {
  AlertEditDialog,
  FormCategory,
  ICategory,
  IDisciplineOptions,
} from "@/modules/categories";

interface Props {
  category: ICategory;
  disciplinesOptions: IDisciplineOptions[];
  isIcon?: boolean;
  showButton?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const EditModal = ({
  category,
  disciplinesOptions,
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
                Agrega un nuevo equipo al sistema.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <FormCategory
                formId="edit-category-form"
                category={category}
                disciplinesOptions={disciplinesOptions}
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
              <AlertEditDialog
                isLoading={isLoading}
                category={category}
                formId="edit-category-form"
              />
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
