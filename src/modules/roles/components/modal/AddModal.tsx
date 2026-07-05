"use client";
import {
  Button,
  Form,
  Input,
  Label,
  Modal,
  Surface,
  TextArea,
  TextField,
  useOverlayState,
} from "@heroui/react";
import {
  Add01Icon,
  Envelope,
  IdentityCardIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

export const AddModal = () => {
  const state = useOverlayState();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  };

  return (
    <Modal>
      <Button variant="primary" onPress={() => state.open()}>
        <HugeiconsIcon icon={Add01Icon} />
        Agregar Rol
      </Button>
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <HugeiconsIcon icon={IdentityCardIcon} />
              </Modal.Icon>
              <Modal.Heading>Agregar Rol</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Agrega un nuevo rol al sistema.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <Surface variant="default">
                <Form
                  id="add-role-form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <TextField
                    isRequired
                    className="w-full"
                    name="name"
                    type="text"
                  >
                    <Label>Nombre</Label>
                    <Input
                      variant="secondary"
                      placeholder="Ingrese el nombre del rol"
                    />
                  </TextField>
                  <TextField className="w-full" name="description" type="text">
                    <Label>Descripción</Label>
                    <TextArea
                      variant="secondary"
                      aria-label="Quick project update"
                      placeholder="Share a quick project update..."
                    />
                  </TextField>
                </Form>
              </Surface>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={() => state.close()}>
                Cancelar
              </Button>
              <Button type="submit" form="add-role-form">
                Guardar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
