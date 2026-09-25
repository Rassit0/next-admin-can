"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Label,
  Modal,
  TextArea,
  TextField,
  useOverlayState,
  Checkbox,
  CheckboxGroup,
} from "@heroui/react";
import { Add01Icon, IdentityCardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createRole } from "../../../users/actions/roles";

interface Props {
  permissions: any[];
}

export const AddModal: React.FC<Props> = ({ permissions }) => {
  const router = useRouter();
  const state = useOverlayState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Limpiar el estado al cerrar/abrir
  useEffect(() => {
    if (state.isOpen) {
      setName("");
      setDescription("");
      setSelectedPermissions([]);
    }
  }, [state.isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) {
      toast.error("El nombre del rol es requerido");
      return;
    }

    setIsLoading(true);
    const res = await createRole({
      name,
      description,
      permissionIds: selectedPermissions,
    });
    setIsLoading(false);

    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success("Rol creado exitosamente");
      state.close();
      router.refresh();
    }
  };

  // Agrupar permisos
  const groupedPermissions = permissions.reduce((acc: any, perm: any) => {
    const mod = perm.module?.displayName || perm.module?.name || "Otros";
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(perm);
    return acc;
  }, {});

  return (
    <Modal>
      <Button variant="primary" onPress={() => state.open()}>
        <HugeiconsIcon icon={Add01Icon} />
        Nuevo Rol
      </Button>
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="inside">
          <Modal.Dialog className="sm:max-w-3xl">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <HugeiconsIcon icon={IdentityCardIcon} />
              </Modal.Icon>
              <Modal.Heading>Agregar Nuevo Rol</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Configure un nuevo rol con sus respectivos permisos.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <form
                id="add-role-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField isRequired className="w-full" variant="secondary">
                    <Label>Nombre</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ingrese el nombre del rol"
                    />
                  </TextField>
                  <TextField className="w-full" variant="secondary">
                    <Label>Descripción</Label>
                    <TextArea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Opcional..."
                    />
                  </TextField>
                </div>

                <div className="mt-4">
                  <CheckboxGroup
                    name="permissions"
                    value={selectedPermissions}
                    onChange={setSelectedPermissions}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      {Object.entries(groupedPermissions).map(
                        ([mod, perms]: any) => (
                          <div
                            key={mod}
                            className="border border-divider rounded-lg p-4 bg-background/50"
                          >
                            <Label className="font-semibold text-primary mb-3 pb-2 border-b border-divider block">
                              {mod}
                            </Label>
                            <div className="space-y-3 mt-3">
                              {perms.map((p: any) => (
                                <Checkbox key={p.id} value={p.id}>
                                  <Checkbox.Content>
                                    <Checkbox.Control>
                                      <Checkbox.Indicator />
                                    </Checkbox.Control>
                                    <span className="text-sm font-medium">
                                      {p.name}
                                    </span>
                                  </Checkbox.Content>
                                </Checkbox>
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CheckboxGroup>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={() => state.close()}>
                Cancelar
              </Button>
              <Button
                type="submit"
                form="add-role-form"
                variant="primary"
                isPending={isLoading}
              >
                Crear Rol
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
