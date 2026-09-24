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
import { updateInstitutionHistoryItemAction } from "../actions";
import { InstitutionHistoryItem } from "../services";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

export const EditInstitutionHistoryItemModal = ({
  item,
}: {
  item: InstitutionHistoryItem;
}) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(item.isActive);

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

      const res = await updateInstitutionHistoryItemAction(item.id, data);
      if (res.error) {
        toast.error(res.message || "Error al actualizar el hito");
      } else {
        toast.success(res.message || "Hito actualizado correctamente");
        state.setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado al actualizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button isIconOnly variant="ghost" size="sm" onPress={() => state.open()}>
        <HugeiconsIcon icon={Edit02Icon} size={18} />
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-2xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Editar Hito</Modal.Heading>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
              <Modal.Body className="px-6 py-4 flex flex-col gap-4">
                <TextField name="year" defaultValue={item.year} isRequired>
                  <Label>Ai±o / Periodo</Label>
                  <Input />
                </TextField>

                <TextField name="title" defaultValue={item.title} isRequired>
                  <Label>Ti­tulo</Label>
                  <Input />
                </TextField>

                <TextField
                  name="description"
                  defaultValue={item.description}
                  isRequired
                >
                  <Label>Descripción</Label>
                  <TextArea />
                </TextField>

                <TextField
                  name="sortOrder"
                  type="number"
                  defaultValue={item.sortOrder.toString()}
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
                  Guardar Cambios
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
