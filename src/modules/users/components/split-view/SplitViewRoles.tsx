"use client";

import React, { useState, useMemo } from "react";
import {
  Button,
  Input,
  InputGroup,
  Label,
  Surface,
  TextArea,
  TextField,
  Checkbox,
  CheckboxGroup,
} from "@heroui/react";
import {
  Add01Icon,
  CheckmarkBadge01Icon,
  CheckmarkCircle01Icon,
  Delete01Icon,
  LockPasswordIcon,
  PencilEdit01Icon,
  SafeIcon,
  SecurityPasswordIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IRole, createRole, updateRole, deleteRole } from "../../actions/roles";
import { ConfirmAlertDialog } from "../modal/ConfirmAlertDialog";

interface Props {
  initialRoles: IRole[];
  permissions: any[];
}

export const SplitViewRoles: React.FC<Props> = ({
  initialRoles,
  permissions,
}) => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Confirm Alert Dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void | Promise<void>;
    status?: "danger" | "warning" | "success" | "accent";
    confirmText?: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionSearch, setPermissionSearch] = useState("");

  // Handle select role
  const handleSelect = (role: IRole) => {
    setSelectedRole(role);
    setIsCreating(false);
    setIsEditing(false);
    setName(role.name);
    setDescription(role.description || "");
    setSelectedPermissions(
      (role as any).permissions?.map((p: any) => p.permission.id) || [],
    );
  };

  // Handle create new
  const handleCreateNew = () => {
    setSelectedRole(null);
    setIsCreating(true);
    setIsEditing(true);
    setName("");
    setDescription("");
    setSelectedPermissions([]);
  };

  // Handle Save
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) {
      toast.error("El nombre del rol es requerido");
      return;
    }

    setIsLoading(true);
    let res;

    if (isCreating) {
      res = await createRole({
        name,
        description,
        permissionIds: selectedPermissions,
      });
    } else if (selectedRole) {
      res = await updateRole(selectedRole.id, {
        name,
        description,
        permissionIds: selectedPermissions,
      });
    }

    setIsLoading(false);

    if (res?.error) {
      toast.error(res.message);
    } else {
      toast.success(
        isCreating ? "Rol creado exitosamente" : "Rol actualizado exitosamente",
      );
      setIsCreating(false);
      setIsEditing(false);
      router.refresh();
      if (res?.data) {
        handleSelect(res.data as IRole);
      }
    }
  };

  // Handle Delete
  const handleDelete = () => {
    if (!selectedRole || selectedRole.isSystem) return;

    setConfirmDialog({
      isOpen: true,
      title: "Eliminar Rol",
      description: `¿Está seguro de eliminar el rol "${selectedRole.name}"? Esta acción fallará si hay usuarios asignados a él.`,
      status: "danger",
      confirmText: "Eliminar",
      onConfirm: async () => {
        setIsLoading(true);
        const res = await deleteRole(selectedRole.id);
        setIsLoading(false);

        if (res.error) {
          toast.error(res.message);
        } else {
          toast.success("Rol eliminado exitosamente");
          setSelectedRole(null);
          setIsEditing(false);
          router.refresh();
        }
      },
    });
  };

  // Agrupar y ordenar permisos alfabéticamente por módulo y nombre
  const groupedPermissions = useMemo(() => {
    const grouped = permissions.reduce(
      (acc: Record<string, any[]>, perm: any) => {
        const mod = perm.module?.displayName || perm.module?.name || "Otros";
        if (!acc[mod]) acc[mod] = [];
        acc[mod].push(perm);
        return acc;
      },
      {},
    );

    // Ordenar los permisos dentro de cada módulo alfabéticamente
    Object.values(grouped).forEach((perms) => {
      perms.sort((a, b) =>
        a.name.localeCompare(b.name, "es", { sensitivity: "base" }),
      );
    });

    // Ordenar los módulos alfabéticamente
    const sortedEntries = Object.entries(grouped).sort(([modA], [modB]) =>
      modA.localeCompare(modB, "es", { sensitivity: "base" }),
    );

    // Filtrar si hay búsqueda activa
    const query = permissionSearch.trim().toLowerCase();
    if (!query) return sortedEntries;

    return sortedEntries
      .map(([mod, perms]) => {
        const matchModule = mod.toLowerCase().includes(query);
        if (matchModule) {
          return [mod, perms] as [string, any[]];
        }
        const filteredPerms = perms.filter(
          (p: any) =>
            p.name.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query),
        );
        return [mod, filteredPerms] as [string, any[]];
      })
      .filter(([_, perms]) => perms.length > 0);
  }, [permissions, permissionSearch]);

  const handleToggleModulePermissions = (modulePerms: any[]) => {
    if (!isEditing) return;
    const modulePermIds = modulePerms.map((p) => p.id);
    const allSelected = modulePermIds.every((id) =>
      selectedPermissions.includes(id),
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !modulePermIds.includes(id)),
      );
    } else {
      setSelectedPermissions((prev) => [
        ...prev,
        ...modulePermIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  return (
    <div className="flex h-full w-full gap-6 overflow-hidden">
      {/* LEFT PANE: List */}
      <Surface
        variant="default"
        className="w-[320px] shrink-0 flex flex-col border border-border rounded-xl bg-surface-secondary/20"
      >
        <div className="p-4 border-b border-border bg-background flex items-center justify-between">
          <h3 className="font-semibold text-lg">Roles</h3>
          <Button
            variant="primary"
            size="sm"
            isIconOnly
            onPress={handleCreateNew}
          >
            <HugeiconsIcon icon={Add01Icon} size={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {initialRoles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleSelect(role)}
              className={`w-full text-left p-3 rounded-lg flex flex-col transition-colors ${
                selectedRole?.id === role.id && !isCreating
                  ? "bg-accent-soft border border-accent/20"
                  : "hover:bg-surface-secondary border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-medium ${selectedRole?.id === role.id && !isCreating ? "text-accent-soft-foreground" : "text-foreground"}`}
                >
                  {role.name}
                </span>
                {role.isSystem && (
                  <HugeiconsIcon
                    icon={SafeIcon}
                    size={14}
                    className="text-muted"
                  />
                )}
              </div>
              <span
                className={`text-xs truncate ${selectedRole?.id === role.id && !isCreating ? "text-accent-soft-foreground/70" : "text-muted"}`}
              >
                {role.description || "Sin descripción"}
              </span>
            </button>
          ))}
        </div>
      </Surface>

      {/* RIGHT PANE: Detail / Form */}
      <Surface
        variant="default"
        className="flex-1 border border-border rounded-xl bg-background flex flex-col overflow-hidden"
      >
        {!selectedRole && !isCreating ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted p-10">
            <div className="w-16 h-16 rounded-full bg-surface-secondary flex items-center justify-center mb-4">
              <HugeiconsIcon icon={SecurityPasswordIcon} size={32} />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              Seleccione un Rol
            </h3>
            <p className="text-sm text-center max-w-sm mt-2">
              Elija un rol de la lista para ver o modificar sus permisos, o cree
              uno nuevo.
            </p>
          </div>
        ) : (
          <form
            id="role-form"
            onSubmit={handleSave}
            className="flex flex-col h-full overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between bg-surface-secondary/20">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {isCreating ? "Crear Nuevo Rol" : selectedRole?.name}
                  {selectedRole?.isSystem && (
                    <span className="text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full font-medium">
                      Sistema
                    </span>
                  )}
                  {selectedRole?.isSuperAdmin && (
                    <span className="text-xs bg-danger/10 text-danger border border-danger/20 px-2 py-0.5 rounded-full font-medium">
                      Super Admin
                    </span>
                  )}
                </h2>
                <p className="text-sm text-muted mt-1">
                  {isCreating
                    ? "Configure los datos básicos y asigne los permisos."
                    : "Gestione la configuración de este rol."}
                </p>
              </div>

              {!isCreating && !selectedRole?.isSuperAdmin && (
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <Button
                      variant="secondary"
                      onPress={() => setIsEditing(true)}
                    >
                      <HugeiconsIcon icon={PencilEdit01Icon} size={18} />
                      Editar
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      onPress={() => {
                        setIsEditing(false);
                        handleSelect(selectedRole!);
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                  {!selectedRole?.isSystem && (
                    <Button
                      variant="ghost"
                      className="text-danger"
                      onPress={handleDelete}
                    >
                      <HugeiconsIcon icon={Delete01Icon} size={18} />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <TextField isRequired className="w-full">
                  <Label>Nombre</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Entrenador Principal"
                    readOnly={!isEditing}
                    variant={!isEditing ? undefined : "secondary"}
                    className={
                      !isEditing
                        ? "bg-transparent px-0 border-transparent pointer-events-none"
                        : ""
                    }
                  />
                </TextField>

                <TextField className="w-full">
                  <Label>Descripción</Label>
                  <TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe el propósito del rol"
                    readOnly={!isEditing}
                    variant={!isEditing ? undefined : "secondary"}
                    className={
                      !isEditing
                        ? "bg-transparent px-0 border-transparent pointer-events-none resize-none"
                        : ""
                    }
                  />
                </TextField>
              </div>

              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    Permisos del Sistema
                  </h3>
                  <p className="text-xs text-muted">
                    {groupedPermissions.length} módulo{groupedPermissions.length !== 1 ? "s" : ""} ordenado{groupedPermissions.length !== 1 ? "s" : ""} alfabéticamente
                    {selectedPermissions.length > 0 && ` • ${selectedPermissions.length} seleccionado${selectedPermissions.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
                <div className="w-full sm:w-72">
                  <InputGroup className="w-full" variant="secondary">
                    <InputGroup.Prefix>
                      <HugeiconsIcon
                        icon={Search01Icon}
                        size={16}
                        className="text-muted"
                      />
                    </InputGroup.Prefix>
                    <InputGroup.Input
                      value={permissionSearch}
                      onChange={(e) => setPermissionSearch(e.target.value)}
                      placeholder="Buscar módulo o permiso..."
                    />
                  </InputGroup>
                </div>
              </div>

              {selectedRole?.isSuperAdmin ? (
                <div className="p-8 border border-danger/20 bg-danger/5 rounded-xl flex flex-col items-center justify-center text-center">
                  <HugeiconsIcon
                    icon={LockPasswordIcon}
                    size={48}
                    className="text-danger mb-4"
                  />
                  <h4 className="text-danger font-bold text-lg">
                    Acceso Total
                  </h4>
                  <p className="text-danger/80 max-w-md mt-2">
                    Este rol tiene privilegios de Super Administrador. No es
                    necesario (ni posible) asignarle permisos individuales
                    porque hereda todos automáticamente.
                  </p>
                </div>
              ) : (
                <CheckboxGroup
                  value={selectedPermissions}
                  onChange={setSelectedPermissions}
                  isDisabled={!isEditing}
                >
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-6">
                    {groupedPermissions.length === 0 ? (
                      <div className="col-span-full py-12 text-center text-muted">
                        <p className="text-sm">
                          No se encontraron permisos o módulos que coincidan con &ldquo;{permissionSearch}&rdquo;.
                        </p>
                      </div>
                    ) : (
                      groupedPermissions.map(([mod, perms]: [string, any[]]) => {
                        const selectedCount = perms.filter((p: any) =>
                          selectedPermissions.includes(p.id),
                        ).length;
                        const allSelected =
                          perms.length > 0 && selectedCount === perms.length;

                        return (
                          <div
                            key={mod}
                            className={`border border-border rounded-xl p-5 transition-colors ${!isEditing ? "bg-surface-secondary/10 opacity-80" : "bg-background"}`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-border">
                              <div className="flex items-center gap-2">
                                <Label className="font-semibold text-foreground m-0">
                                  {mod}
                                </Label>
                                <span className="text-xs text-muted font-normal">
                                  ({selectedCount}/{perms.length})
                                </span>
                              </div>
                              {isEditing && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleModulePermissions(perms)}
                                  className="text-xs font-medium text-accent hover:underline cursor-pointer transition-colors"
                                >
                                  {allSelected
                                    ? "Deseleccionar todos"
                                    : "Seleccionar todos"}
                                </button>
                              )}
                            </div>
                            <div className="space-y-3">
                              {perms.map((p: any) => (
                                <Checkbox key={p.id} value={p.id}>
                                  <Checkbox.Content>
                                    <Checkbox.Control>
                                      <Checkbox.Indicator />
                                    </Checkbox.Control>
                                    <div className="flex flex-col ml-1">
                                      <span className="text-sm font-medium leading-none mb-1">
                                        {p.name}
                                      </span>
                                      {p.description && (
                                        <span className="text-xs text-muted font-normal line-clamp-1">
                                          {p.description}
                                        </span>
                                      )}
                                    </div>
                                  </Checkbox.Content>
                                </Checkbox>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CheckboxGroup>
              )}
            </div>

            {isEditing && (
              <div className="p-4 border-t border-border bg-surface-secondary/30 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onPress={() =>
                    isCreating
                      ? handleSelect(initialRoles[0])
                      : handleSelect(selectedRole!)
                  }
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  form="role-form"
                  variant="primary"
                  isPending={isLoading}
                >
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
                  Guardar Rol
                </Button>
              </div>
            )}
          </form>
        )}
      </Surface>

      <ConfirmAlertDialog
        isOpen={confirmDialog.isOpen}
        onOpenChange={(open) =>
          !open && setConfirmDialog({ ...confirmDialog, isOpen: false })
        }
        title={confirmDialog.title}
        description={confirmDialog.description}
        status={confirmDialog.status}
        confirmText={confirmDialog.confirmText}
        onConfirm={confirmDialog.onConfirm}
      />
    </div>
  );
};
