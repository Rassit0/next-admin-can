"use client";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  Select,
  ListBox,
  TextField,
  Label,
} from "@heroui/react";
import { PersonAutocomplete } from "@/common/components/form/PersonAutocomplete";
import { IPersonOption } from "@/common/actions/get-persons-options";
import { createUser } from "../../actions/users";
import { getRoles, IRole } from "../../actions/roles";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

export const CreateUserModal: React.FC<Props> = ({ isOpen, onOpenChange, onSuccess }) => {
  const router = useRouter();
  const [personId, setPersonId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState<IRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  const loadRoles = async () => {
    const res = await getRoles({ per_page: "100" });
    if (!res.error && res.data) {
      setRoles(res.data.data);
    }
  };

  const handleSubmit = async (onClose: () => void) => {
    if (!email || !roleId) {
      toast.error("Correo y rol son requeridos");
      return;
    }

    setIsLoading(true);
    const res = await createUser({
      email,
      roleId,
      personId: personId || undefined,
    });
    setIsLoading(false);

    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success("Usuario creado exitosamente");
      if (res.data?.tempPassword) {
        // En un entorno real, enviaríamos un correo. Aquí mostramos un alert o toast extendido
        alert(`La contraseña temporal es: ${res.data.tempPassword}\n\nPor favor, cópiela.`);
      }
      if (onSuccess) onSuccess();
      onClose();
      router.refresh();
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container placement="auto" scroll="inside">
          <Modal.Dialog className="sm:max-w-2xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Crear Nuevo Usuario</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-4">
                <PersonAutocomplete
                  label="Vincular a una Persona (Opcional)"
                  personId={personId}
                  setPersonId={setPersonId}
                  isRequired={false}
                />
                
                <TextField isRequired variant="secondary" className="w-full">
                  <Label>Correo Electrónico</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </TextField>

                <Select
                  isRequired
                  className="w-full"
                  variant="secondary"
                  value={roleId}
                  onChange={(e) => setRoleId(e ? (e as string) : "")}
                >
                  <Label>Rol del Usuario</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {roles.map((role) => (
                        <ListBox.Item id={role.id} key={role.id} textValue={role.name}>
                          {role.name} {role.isSystem ? "(Sistema)" : ""}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
                
                <p className="text-xs text-default-500">
                  La contraseña se generará automáticamente y se mostrará al finalizar la creación.
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" className="text-danger" onPress={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onPress={() => handleSubmit(() => onOpenChange(false))} isPending={isLoading}>
                Crear Usuario
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
