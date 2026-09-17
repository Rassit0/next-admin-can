"use client";
import {
  Button,
  Modal,
  ProgressCircle,
} from "@heroui/react";
import { Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, Dispatch, SetStateAction } from "react";
import { HomeDisciplineForm } from "../form/HomeDisciplineForm";
import { IHomeDiscipline } from "../../interfaces/home-discipline.interface";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  homeDiscipline: IHomeDiscipline;
  showButton?: boolean;
}

export const EditHomeDisciplineModal = ({ isOpen, setIsOpen, homeDiscipline, showButton }: Props) => {
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
              <Modal.Heading>Editar Bloque</Modal.Heading>
            </div>
            <p className="mt-1.5 text-sm leading-5 text-muted">
              Actualice la información del bloque seleccionado.
            </p>
          </Modal.Header>
          <Modal.Body className="p-6">
            <HomeDisciplineForm
              homeDiscipline={homeDiscipline}
              formId={`edit-home-discipline-form-${homeDiscipline.id}`}
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
              form={`edit-home-discipline-form-${homeDiscipline.id}`}
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
