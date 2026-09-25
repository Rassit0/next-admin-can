"use client";

import {
  Modal,
  Button,
  useOverlayState,
  Input,
  TextArea,
  Switch,
  TextField,
  Label,
} from "@heroui/react";
import { useState } from "react";
import { createInstitutionHistoryItemAction } from "../actions";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { ButtonFloating } from "@/ui";

interface Props {
  label?: string;
  isIcon?: boolean;
  buttonFloatingMobile?: boolean;
}

export const AddInstitutionHistoryItemModal = ({
  label,
  isIcon = false,
  buttonFloatingMobile,
}: Props) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      const data = {
        year: form.get("year"),
        title: form.get("title"),
        description: form.get("description"),
        sortOrder: Number(form.get("sortOrder")),
        isActive,
      };

      const res = await createInstitutionHistoryItemAction(data);
      if (res.error) {
        toast.error(res.message || "Error al crear el hito");
      } else {
        toast.success(res.message || "Hito creado correctamente");
        state.setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurró un error inesperado al guardar");
    } finally {
      setLoading(false);
    }
  };

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
          {label || "Agregar Hito"}
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
      {buttonFloatingMobile && (
        <ButtonFloating
          className="lg:hidden"
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
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-2xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Agregar Hito a la Historia</Modal.Heading>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
              <Modal.Body className="px-6 py-4 flex flex-col gap-4">
                <TextField name="year" isRequired>
                  <Label>Año / Periodo</Label>
                  <Input placeholder="Ej. 1950" />
                </TextField>

                <TextField name="title" isRequired>
                  <Label>Título</Label>
                  <Input placeholder="Ej. Fundacón del Club" />
                </TextField>

                <TextField name="description" isRequired>
                  <Label>Descripcón</Label>
                  <TextArea placeholder="Detalles del hito..." />
                </TextField>

                <TextField
                  name="sortOrder"
                  type="number"
                  defaultValue="0"
                  isRequired
                >
                  <Label>Ordenamiento</Label>
                  <Input />
                </TextField>

                <div className="flex items-center gap-3">
                  <Switch isSelected={isActive} onChange={setIsActive}>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                    <Switch.Content>
                      <span className="text-sm font-medium">
                        Activo / Visible
                      </span>
                    </Switch.Content>
                  </Switch>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="ghost" onPress={() => state.setOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit" isPending={loading}>
                  Guardar
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
