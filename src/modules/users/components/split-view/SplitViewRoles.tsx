"use client";
import React, { useState, useEffect } from "react";
import {
  IRole,
  getPermissions,
  updateRole,
  createRole,
  deleteRole,
} from "../../actions/roles";
import {
  Button,
  Input,
  TextField,
  Label,
  ListBox,
  ListBoxItem,
  Chip,
  Checkbox,
  Spinner,
} from "@heroui/react";
import {
  PlusSignIcon,
  FloppyDiskIcon,
  Delete01Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  initialRoles: IRole[];
}

export const SplitViewRoles: React.FC<Props> = ({ initialRoles }) => {
  const router = useRouter();
  const [roles, setRoles] = useState<IRole[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Set<string>>(
    new Set(),
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    const res = await getPermissions({ per_page: "500" });
    if (!res.error && res.data) {
      setPermissions(res.data.data);
    }
  };

  const handleSelectRole = (roleId: string) => {
    if (roleId === "new") {
      setSelectedRole({
        id: "new",
        name: "Nuevo Rol",
        description: "",
        isSystem: false,
        isSuperAdmin: false,
      });
      setEditName("");
      setEditDesc("");
      setRolePermissions(new Set());
      setIsEditing(true);
      return;
    }

    const role = roles.find((r) => r.id === roleId);
    if (role) {
      setSelectedRole(role);
      setEditName(role.name);
      setEditDesc(role.description);
      // @ts-ignore
      const permIds = role.permissions?.map((p: any) => p.permission.id) || [];
      setRolePermissions(new Set(permIds));
      setIsEditing(false);
    }
  };

  const handleTogglePermission = (permId: string) => {
    if (!isEditing) return;
    const newSet = new Set(rolePermissions);
    if (newSet.has(permId)) {
      newSet.delete(permId);
    } else {
      newSet.add(permId);
    }
    setRolePermissions(newSet);
  };

  const handleSave = async () => {
    if (!editName) {
      toast.error("El nombre del rol es requerido");
      return;
    }

    setIsLoading(true);
    let res;
    if (selectedRole?.id === "new") {
      res = await createRole({
        name: editName,
        description: editDesc,
        permissionIds: Array.from(rolePermissions),
      });
    } else if (selectedRole) {
      res = await updateRole(selectedRole.id, {
        name: editName,
        description: editDesc,
        permissionIds: Array.from(rolePermissions),
      });
    }
    setIsLoading(false);

    if (res?.error) {
      toast.error(res.message);
    } else {
      toast.success(
        selectedRole?.id === "new"
          ? "Rol creado exitosamente"
          : "Rol actualizado",
      );
      setIsEditing(false);
      router.refresh();
      // Refetch local roles to update view
      // Just a reload is fine
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (!selectedRole || selectedRole.id === "new") return;
    if (
      !confirm(
        "¿Está seguro de eliminar este rol? Esta acción no se puede deshacer y fallará si hay usuarios asignados.",
      )
    )
      return;

    setIsLoading(true);
    const res = await deleteRole(selectedRole.id);
    setIsLoading(false);

    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success("Rol eliminado");
      window.location.reload();
    }
  };

  // Agrupar permisos por módulo
  const groupedPermissions = permissions.reduce((acc: any, perm: any) => {
    const mod = perm.module?.displayName || perm.module?.name || "Otros";
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(perm);
    return acc;
  }, {});

  return (
    <div className="flex h-full gap-4">
      {/* Lista de Roles */}
      <div className="w-1/3 bg-content1 rounded-xl border border-divider flex flex-col overflow-hidden">
        <div className="p-4 border-b border-divider flex justify-between items-center bg-content2/50">
          <h3 className="font-semibold text-lg">Roles</h3>
          <Button
            size="sm"
            variant="primary"
            onPress={() => handleSelectRole("new")}
          >
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              Nuevo Rol
            </div>
          </Button>
        </div>
        <ListBox
          aria-label="Lista de roles"
          className="p-2 flex-1 overflow-y-auto"
          selectedKeys={selectedRole ? [selectedRole.id] : []}
          selectionMode="single"
          items={roles}
          onSelectionChange={(keys: any) => {
            const arr = Array.from(keys);
            if (arr.length > 0) handleSelectRole(arr[0] as string);
          }}
        >
          {(role) => (
            <ListBoxItem key={role.id} textValue={role.name} className="py-3">
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full">
                  <span className="font-medium">{role.name}</span>
                  {role.isSuperAdmin && (
                    <HugeiconsIcon
                      icon={Alert02Icon}
                      size={16}
                      className="text-danger"
                    />
                  )}
                </div>
                {role.isSystem && (
                  <span className="text-xs text-default-400">
                    Rol del Sistema
                  </span>
                )}
              </div>
            </ListBoxItem>
          )}
        </ListBox>
      </div>

      {/* Editor de Permisos */}
      <div className="w-2/3 bg-content1 rounded-xl border border-divider flex flex-col overflow-hidden">
        {selectedRole ? (
          <>
            <div className="p-4 border-b border-divider bg-content2/50 flex justify-between items-center">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {isEditing ? (
                  <TextField className="w-64">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nombre del Rol"
                    />
                  </TextField>
                ) : (
                  <span>{selectedRole.name}</span>
                )}
                {selectedRole.isSystem && (
                  <Chip size="sm" color="warning" variant="soft">
                    Protegido
                  </Chip>
                )}
              </h3>

              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onPress={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onPress={handleSave}
                      isPending={isLoading}
                    >
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={FloppyDiskIcon} size={16} />
                        Guardar
                      </div>
                    </Button>
                  </>
                ) : (
                  <>
                    {!selectedRole.isSystem && (
                      <Button
                        size="sm"
                        variant="danger-soft"
                        onPress={handleDelete}
                      >
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon icon={Delete01Icon} size={16} />
                          Eliminar
                        </div>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="primary"
                      onPress={() => setIsEditing(true)}
                    >
                      Editar Rol
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              {isEditing && (
                <div className="mb-6">
                  <TextField variant="secondary">
                    <Label>Descripción (Opcional)</Label>
                    <Input
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    />
                  </TextField>
                </div>
              )}

              {!isEditing && selectedRole.description && (
                <p className="text-default-600 mb-6">
                  {selectedRole.description}
                </p>
              )}

              {selectedRole.isSuperAdmin ? (
                <div className="flex flex-col items-center justify-center py-20 text-default-500 gap-4">
                  <HugeiconsIcon
                    icon={Alert02Icon}
                    size={48}
                    className="text-danger/50"
                  />
                  <p className="text-lg">
                    Este rol tiene acceso total al sistema.
                  </p>
                  <p className="text-sm">
                    Sus permisos no pueden ser editados manualmente.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {Object.entries(groupedPermissions).map(
                    ([moduleName, perms]: any) => (
                      <div
                        key={moduleName}
                        className="border border-divider rounded-lg p-4 bg-background/50"
                      >
                        <h4 className="font-semibold text-primary mb-3 pb-2 border-b border-divider">
                          {moduleName}
                        </h4>
                        <div className="space-y-3">
                          {perms.map((p: any) => (
                            <label
                              key={p.id}
                              className={`flex items-center gap-3 ${isEditing ? "cursor-pointer hover:bg-content2" : ""} p-2 rounded-md transition-colors`}
                            >
                              <Checkbox
                                isSelected={rolePermissions.has(p.id)}
                                onChange={() => handleTogglePermission(p.id)}
                                isReadOnly={!isEditing}
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {p.name}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-default-400">
            <p>Seleccione un rol para ver sus detalles</p>
          </div>
        )}
      </div>
    </div>
  );
};
