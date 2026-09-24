"use client";
import { Button, Modal, ProgressCircle, useOverlayState } from "@heroui/react";
import { Edit03Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Dispatch, SetStateAction, useState } from "react";
import { INews } from "../../interfaces/news.interface";
import { NewsForm } from "../form/NewsForm";

interface Props {
  news: INews;
  isIcon?: boolean;
  showButton?: boolean;
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

export const EditNewsModal = ({
  news,
  isIcon = false,
  showButton = true,
  isOpen,
  setIsOpen,
}: Props) => {
  const state = useOverlayState({ isOpen, onOpenChange: setIsOpen });
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
          {!isIcon && "Editar Noticia"}
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
                <Modal.Heading>Actualizar Noticia</Modal.Heading>
              </div>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Actualiza la información de la noticia seleccionada.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <NewsForm
                formId="edit-news-form"
                news={news}
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
              <Button type="submit" form="edit-news-form" isPending={isLoading}>
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
