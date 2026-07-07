"use client";
import { Button, Modal, useOverlayState } from "@heroui/react";
import { Add01Icon, Layers01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { ButtonFloating } from "@/ui";
import { FormTeam } from "@/modules/teams";

interface Props {
  clubId: string;
  buttonFloatingMobile?: boolean;
}

export const AddModal = ({ clubId, buttonFloatingMobile }: Props) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);

  return (
    <Modal>
      <Button
        className="hidden md:flex"
        variant="primary"
        onPress={() => state.open()}
      >
        <HugeiconsIcon icon={Add01Icon} />
        Agregar Equipo
      </Button>
      <ButtonFloating
        icon={
          <HugeiconsIcon icon={Add01Icon} className="h-6 w-6 text-background" />
        }
        onPress={() => state.open()}
        // text="Agregar Disciplina"
      />
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <HugeiconsIcon icon={Layers01Icon} />
              </Modal.Icon>
              <Modal.Heading>Agregar Equipo</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Agrega un nuevo equipo al sistema.
              </p>
            </Modal.Header>
            <Modal.Body className="p-0 md:p-6">
              <FormTeam
                formId="add-team-form"
                clubId={clubId}
                onSubmited={() => state.close()}
                isLoading={loading}
                setIsLoading={setLoading}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onPress={() => state.close()}
                isDisabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="add-team-form"
                // isDisabled={loading}
                // isPending={true}
              >
                Guardar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
