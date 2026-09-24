"use client";
import { Button, Modal, ProgressCircle, useOverlayState } from "@heroui/react";
import { Add01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { NewsForm } from "../form/NewsForm";

interface Props {
  label?: string;
  isIcon?: boolean;
  buttonFloatingMobile?: boolean;
}

export const AddNewsModal = ({
  label,
  isIcon = false,
  buttonFloatingMobile,
}: Props) => {
  const state = useOverlayState();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {!isIcon && (
        <Button
          className="hidden lg:flex"
          variant="primary"
          onPress={() => state.open()}
          isIconOnly={isIcon}
        >
          <HugeiconsIcon icon={Add01Icon} />
          {label || "Crear Nota"}
        </Button>
      )}
      {isIcon && (
        <Button
          variant="primary"
          onPress={() => state.open()}
          isIconOnly={isIcon}
        >
          <HugeiconsIcon icon={Add01Icon} />
        </Button>
      )}

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-2xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex gap-2 items-center ">
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                  <HugeiconsIcon icon={File01Icon} />
                </Modal.Icon>
                <Modal.Heading>Agregar Noticia</Modal.Heading>
              </div>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Redacta una nueva noticia para publicar en el portal web.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <NewsForm
                formId="add-news-form"
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
              <Button type="submit" form="add-news-form" isPending={isLoading}>
                {isLoading && (
                  <ProgressCircle isIndeterminate aria-label="Loading">
                    <ProgressCircle.Track>
                      <ProgressCircle.TrackCircle />
                      <ProgressCircle.FillCircle />
                    </ProgressCircle.Track>
                  </ProgressCircle>
                )}
                Guardar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
