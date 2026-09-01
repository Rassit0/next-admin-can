"use client";
import React, { useState, useEffect } from "react";
import { Button, Input, Select, ListBox, TextField, Label } from "@heroui/react";
import { PersonAutocomplete } from "@/common/components/form/PersonAutocomplete";
import { getRoles, IRole } from "../../actions/roles";
import { updateUser, IUser } from "../../actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  user: IUser;
}

export const UpdateUserForm: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const [personId, setPersonId] = useState<string | null>(user.personId);
  const [email, setEmail] = useState(user.email);
  const [roleId, setRoleId] = useState(user.roleId || "");
  const [roles, setRoles] = useState<IRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    const res = await getRoles({ per_page: "100" });
    if (!res.error && res.data) {
      setRoles(res.data.data);
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      toast.error("El correo es requerido");
      return;
    }

    setIsLoading(true);
    const res = await updateUser(user.id, {
      email,
      roleId: roleId || undefined,
      personId: personId || null,
    });
    setIsLoading(false);

    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success("Usuario actualizado exitosamente");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-content1 p-6 rounded-xl border border-divider">
      <h3 className="text-lg font-semibold">Datos de Autenticación y Acceso</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          isDisabled={user.role?.isSuperAdmin}
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
      </div>

      <div className="border-t border-divider pt-4">
        <PersonAutocomplete
          label="Persona Vinculada"
          personId={personId}
          setPersonId={setPersonId}
          isRequired={false}
        />
        <p className="text-xs text-default-500 mt-2">
          La persona vinculada permite que el usuario actúe como un Jugador, Estudiante, Staff o Familiar. 
          Puede dejarlo vacío si solo es un administrador técnico.
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="primary" onPress={handleSubmit} isPending={isLoading}>
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
};
