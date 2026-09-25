"use client";
import { Button, Modal, ProgressCircle, useOverlayState } from "@heroui/react";
import { Folder01Icon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { NewsCategoryForm } from "../form/NewsCategoryForm";
import { INewsCategory } from "../../interfaces/news-categories.interface";

interface Props {
  category: INewsCategory;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  showButton?: boolean;
}

export const EditNewsCategoryModal = ({
  category,
  isOpen,
  setIsOpen,
  showButton = true,
}: Props) => {
  const state = useOverlayState({
    isOpen: isOpen,
    onOpenChange: setIsOpen,
  });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {showButton && (
        <Button
          onPress={() => state.open()}
          variant="secondary"
          size="sm"
          className="text-default-600 w-full justify-start"
        >
          <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
          Editar Categoría
        </Button>
      )}

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex gap-2 items-center ">
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                  <HugeiconsIcon icon={Folder01Icon} />
                </Modal.Icon>
                <Modal.Heading>Editar Categoría</Modal.Heading>
              </div>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Modifica los datos de la categoría. El slug no puede ser
                alterado.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <NewsCategoryForm
                formId={`edit-news-category-form-${category.id}`}
                category={category}
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
              <Button
                type="submit"
                form={`edit-news-category-form-${category.id}`}
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
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
