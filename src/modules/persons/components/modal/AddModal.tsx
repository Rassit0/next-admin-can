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
import { FormPerson } from "../form/Form";
import { useState } from "react";
import { ButtonFloating } from "@/ui";

interface Props {
  isIcon?: boolean;
  onSubmited?: () => void;
  buttonFloatingMobile?: boolean;
}

export const AddModal = ({
  isIcon = false,
  onSubmited,
  buttonFloatingMobile = false,
}: Props) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);

  return (
    <Modal key={"cover"}>
      {!isIcon && (
        <Button
          className="hidden lg:flex"
          variant="primary"
          onPress={() => state.open()}
        >
          <HugeiconsIcon icon={Add01Icon} />
          Agregar Miembro
        </Button>
      )}
      {isIcon && (
        <Button
          className="hidden lg:flex"
          variant="primary"
          onPress={() => state.open()}
          isIconOnly
        >
          <HugeiconsIcon icon={Add01Icon} />
        </Button>
      )}
      {buttonFloatingMobile && (
        <ButtonFloating
          icon={
            <HugeiconsIcon
              icon={Add01Icon}
              className="h-6 w-6 text-background"
            />
          }
          onPress={() => state.open()}
          // text="Agregar Disciplina"
        />
      )}
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="center" scroll="outside">
          <Modal.Dialog className="sm:max-w-2xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2">
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                  <HugeiconsIcon icon={Layers01Icon} />
                </Modal.Icon>
                <Modal.Heading>Agregar Miembrosdf</Modal.Heading>
              </div>
            </Modal.Header>
            <Modal.Body className="p-6">
              <FormPerson
                formId="add-person-form"
                onSubmited={() => {
                  onSubmited?.();
                  state.close();
                }}
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
                form="add-person-form"
                isPending={loading}
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
