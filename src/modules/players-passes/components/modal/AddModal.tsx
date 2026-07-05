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
import {
  FormPlayerPass,
  IDisciplineOptions,
  IPlayerPassActiveOptions,
} from "@/modules/players-passes";
import { IPlayer } from "@/modules/players-passes";

interface Props {
  label?: string;
  isIcon?: boolean;
  player: IPlayer;
  disciplineOptions: IDisciplineOptions[];
}
export const AddModal = ({
  label,
  isIcon = false,
  player,
  disciplineOptions,
}: Props) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);

  return (
    <Modal key={"cover"}>
      <Button
        className="hidden lg:flex"
        variant="primary"
        onPress={() => state.open()}
        isIconOnly={isIcon}
      >
        <HugeiconsIcon icon={Add01Icon} />
        {label || "Registrar Nuevo Pase"}
      </Button>
      <ButtonFloating
        icon={
          <HugeiconsIcon icon={Add01Icon} className="h-6 w-6 text-background" />
        }
        onPress={() => state.open()}
        // text="Agregar Disciplina"
      />
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="center" scroll="outside">
          <Modal.Dialog className="sm:max-w-4xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2">
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                  <HugeiconsIcon icon={Layers01Icon} />
                </Modal.Icon>
                <Modal.Heading>Registrar Nuevo Pase</Modal.Heading>
              </div>
            </Modal.Header>
            <Modal.Body className="p-6">
              <FormPlayerPass
                formId="add-player-pass-form"
                player={player}
                disciplineOptions={disciplineOptions}
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
                form="add-player-pass-form"
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
