"use client";
import { iconMap } from "@/utils/iconMap";
import {
  Button,
  Form,
  Input,
  Label,
  Modal,
  Surface,
  TextArea,
  TextField,
  toast,
  Toast,
  ToggleButton,
  useOverlayState,
} from "@heroui/react";
import {
  Add01Icon,
  Envelope,
  IdentityCardIcon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { ButtonFloating } from "@/ui";
import { FormActivity } from "../form/Form";

export const AddModal = () => {
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
        Agregar Disciplina
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
              <Modal.Heading>Agregar Actividad</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Agrega una nueva actividad al sistema.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              {/* <FormActivity
                formId="add-location-form"
                onSubmited={() => state.close()}
                isLoading={loading}
                setIsLoading={setLoading}
              /> */}
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
                form="add-location-form"
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
