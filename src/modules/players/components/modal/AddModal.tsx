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
import { FormPlayer, IPlayer } from "@/modules/players";

interface Props {
  label?: string;
  isIcon?: boolean;
  onSubmited?: (player?: IPlayer) => void;
  buttonFloatingMobile?: boolean;
}
export const AddModal = ({
  label,
  isIcon = false,
  onSubmited,
  buttonFloatingMobile = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Modal>
      {!isIcon && (
        <Button
          className="hidden lg:flex"
          variant="primary"
          onPress={() => setIsOpen(true)}
          isIconOnly={isIcon}
        >
          <HugeiconsIcon icon={Add01Icon} />
          {label || "Agregar Jugador"}
        </Button>
      )}
      {isIcon && (
        <Button
          // className="hidden lg:flex"
          variant="primary"
          onPress={() => setIsOpen(true)}
          isIconOnly={isIcon}
        >
          <HugeiconsIcon icon={Add01Icon} />
        </Button>
      )}
      {buttonFloatingMobile && (
        <ButtonFloating
          className="lg:hidden"
          icon={
            <HugeiconsIcon
              icon={Add01Icon}
              className="h-6 w-6 text-background"
            />
          }
          onPress={() => setIsOpen(true)}
          // text="Agregar Disciplina"
        />
      )}
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Container placement="center" scroll="outside">
          <Modal.Dialog className="sm:max-w-2xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                    <HugeiconsIcon icon={IdentityCardIcon} />
                  </Modal.Icon>
                  <Modal.Heading>Registrar Perfil de Jugador</Modal.Heading>
                </div>
                <p className="text-sm text-muted-foreground ml-10">
                  Asigna un perfil deportivo a una persona registrada en el
                  sistema.
                </p>
              </div>
            </Modal.Header>
            <Modal.Body className="p-0 md:p-6">
              <FormPlayer
                formId="add-player-form"
                onSubmited={(player) => {
                  onSubmited?.(player);
                  setIsOpen(false);
                }}
                isLoading={loading}
                setIsLoading={setLoading}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onPress={() => setIsOpen(false)}
                isDisabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="add-player-form"
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
