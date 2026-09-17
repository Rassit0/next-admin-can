"use client";
import {
  Button,
  Modal,
  ProgressCircle,
} from "@heroui/react";
import { Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, Dispatch, SetStateAction } from "react";
import { PromotionForm } from "../form/PromotionForm";
import { IPromotion } from "../../interfaces/promotions.interface";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  promotion: IPromotion;
  showButton?: boolean;
}

export const EditPromotionModal = ({
  isOpen,
  setIsOpen,
  promotion,
  showButton = true,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
      <Modal.Container placement="auto" scroll="outside">
        <Modal.Dialog className="sm:max-w-4xl bg-background-tertiary">
          <Modal.CloseTrigger />
          <Modal.Header>
            <div className="flex gap-2 items-center ">
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <HugeiconsIcon icon={Image01Icon} />
              </Modal.Icon>
              <Modal.Heading>Editar Promotion</Modal.Heading>
            </div>
            <p className="mt-1.5 text-sm leading-5 text-muted">
              Actualice la información del promotion seleccionado.
            </p>
          </Modal.Header>
          <Modal.Body className="p-6">
            <PromotionForm
              promotion={promotion}
              formId={`edit-promotion-form-${promotion.id}`}
              onSubmited={() => setIsOpen(false)}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
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
              type="submit"
              form={`edit-promotion-form-${promotion.id}`}
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
              Actualizar
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
