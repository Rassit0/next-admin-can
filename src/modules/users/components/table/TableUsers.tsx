"use client";
import React, { useState } from "react";
import {
  Table,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  MoreVerticalCircle01Icon,
  PencilEdit01Icon,
  UserBlock01Icon,
  UserCheck01Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IUser, deactivateUser, reactivateUser } from "../../actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePermissions } from "@/shared/providers/PermissionsProvider";

interface Props {
  users: IUser[];
}

import { CredentialAlertDialog } from "../modal/CredentialAlertDialog";
import { ConfirmAlertDialog } from "../modal/ConfirmAlertDialog";

export const TableUsers: React.FC<Props> = ({ users }) => {
  const router = useRouter();
  const permissions = usePermissions();
  const canUnlockUsers = permissions.includes("UNLOCK_USERS");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Credential Alert Dialog state
  const [credentialDialog, setCredentialDialog] = useState<{
    isOpen: boolean;
    email: string;
    password?: string;
  }>({ isOpen: false, email: "" });

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

  const handleToggleActive = (user: IUser) => {
    setConfirmDialog({
      isOpen: true,
      title: user.isActive ? "Desactivar Usuario" : "Reactivar Usuario",
      description: `¿Estás seguro de ${user.isActive ? "desactivar" : "reactivar"} a este usuario?`,
      status: user.isActive ? "warning" : "success",
      confirmText: user.isActive ? "Desactivar" : "Reactivar",
      onConfirm: async () => {
        setIsLoading(user.id);
        const action = user.isActive ? deactivateUser : reactivateUser;
        const res = await action(user.id);
        setIsLoading(null);

        if (res.error) {
          toast.error(res.message);
        } else {
          toast.success(res.message);
          router.refresh();
        }
      },
    });
  };

  const handleResetPassword = (user: IUser) => {
    setConfirmDialog({
      isOpen: true,
      title: "Restablecer Contraseña",
      description: `¿Estás seguro de restablecer la contraseña para ${user.email}? Esta acción invalidará su contraseña actual inmediatamente.`,
      status: "danger",
      confirmText: "Restablecer",
      onConfirm: async () => {
        setIsLoading(user.id);
        const { resetPassword } = await import("../../actions/users");
        const res = await resetPassword(user.id);
        setIsLoading(null);

        if (res.error) {
          toast.error(res.message);
        } else {
          toast.success("Contraseña restablecida exitosamente");
          if (res.data?.tempPassword) {
            setCredentialDialog({
              isOpen: true,
              email: user.email,
              password: res.data.tempPassword,
            });
          }
        }
      },
    });
  };

  const handleUnlockUser = (user: IUser) => {
    setConfirmDialog({
      isOpen: true,
      title: "Desbloquear Cuenta",
      description: `¿Deseas desbloquear la cuenta de ${user.email}? Se restablecerá el contador de intentos fallidos y podrá volver a intentar iniciar sesión inmediatamente.`,
      status: "accent",
      confirmText: "Desbloquear",
      onConfirm: async () => {
        setIsLoading(user.id);
        const { unlockUser } = await import("../../actions/users");
        const res = await unlockUser(user.id);
        setIsLoading(null);

        if (res.error) {
          toast.error(res.message);
        } else {
          toast.success(res.message || "Cuenta desbloqueada correctamente.");
        }
      },
    });
  };

  return (
    <>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Tabla de Usuarios" className="min-w-200">
            <Table.Header className="bg-surface-secondary">
              <Table.Column isRowHeader>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  CORREO
                </span>
              </Table.Column>
              <Table.Column>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  ROL
                </span>
              </Table.Column>
              <Table.Column>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  PERSONA VINCULADA
                </span>
              </Table.Column>
              <Table.Column>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  ESTADO
                </span>
              </Table.Column>
              <Table.Column className="text-center">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  ACCIONES
                </span>
              </Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="py-10 text-center text-sm text-muted">
                  Aún no hay usuarios registrados.
                </div>
              )}
            >
              {users.map((user) => (
                <Table.Row
                  key={user.id}
                  id={user.id}
                  className="border-b border-border last:border-b-0 hover:bg-surface-secondary/40"
                >
                  <Table.Cell className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{user.email}</span>
                      {user.role?.isSuperAdmin && (
                        <HugeiconsIcon
                          icon={Alert02Icon}
                          size={14}
                          className="text-danger"
                        />
                      )}
                      {user.isLocked && (
                        <Chip size="sm" variant="soft" color="danger">Bloqueado</Chip>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <Chip
                      size="sm"
                      variant="soft"
                      color={user.role?.isSystem ? "accent" : "default"}
                    >
                      {user.role?.name || "Sin Rol"}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    {user.person ? (
                      <span className="text-sm">
                        {user.person.name} {user.person.lastName}
                      </span>
                    ) : (
                      <span className="text-sm text-default-400 italic">
                        No vinculada
                      </span>
                    )}
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <Chip
                      size="sm"
                      variant="soft"
                      color={user.isActive ? "success" : "danger"}
                    >
                      {user.isActive ? "Activo" : "Inactivo"}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <div className="flex justify-center">
                      <Dropdown>
                        <Button
                          isIconOnly
                          variant="ghost"
                          size="sm"
                          isPending={isLoading === user.id}
                        >
                          <HugeiconsIcon
                            icon={MoreVerticalCircle01Icon}
                            size={20}
                            className="text-default-400"
                          />
                        </Button>
                        <Dropdown.Popover>
                          <Dropdown.Menu aria-label="Acciones de usuario">
                            <Dropdown.Item
                              key="edit"
                              id="edit"
                              href={`/admin/users/${user.id}`}
                            >
                              <div className="flex items-center gap-2">
                                <HugeiconsIcon icon={PencilEdit01Icon} size={18} />
                                Editar Perfil
                              </div>
                            </Dropdown.Item>
                            
                            {canUnlockUsers && user.isLocked && (
                              <Dropdown.Item
                                key="unlock"
                                id="unlock"
                                onAction={() => handleUnlockUser(user)}
                              >
                                <div className="flex items-center gap-2 text-accent">
                                  <HugeiconsIcon icon={UserCheck01Icon} size={18} />
                                  Desbloquear cuenta
                                </div>
                              </Dropdown.Item>
                            )}

                            <Dropdown.Item
                              key="reset_password"
                              id="reset_password"
                              onAction={() => handleResetPassword(user)}
                            >
                              <div className="flex items-center gap-2 text-warning">
                                <HugeiconsIcon icon={Alert02Icon} size={18} />
                                Restablecer Contraseña
                              </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                              key="toggle"
                              id="toggle"
                              className={user.isActive ? "text-danger" : "text-success"}
                              onAction={() => handleToggleActive(user)}
                            >
                              <div className="flex items-center gap-2">
                                <HugeiconsIcon
                                  icon={
                                    user.isActive ? UserBlock01Icon : UserCheck01Icon
                                  }
                                  size={18}
                                />
                                {user.isActive
                                  ? "Desactivar Usuario"
                                  : "Reactivar Usuario"}
                              </div>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <CredentialAlertDialog
        isOpen={credentialDialog.isOpen}
        onOpenChange={(open) => !open && setCredentialDialog({ isOpen: false, email: "" })}
        email={credentialDialog.email}
        password={credentialDialog.password}
      />

      <ConfirmAlertDialog
        isOpen={confirmDialog.isOpen}
        onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, isOpen: false })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        status={confirmDialog.status}
        confirmText={confirmDialog.confirmText}
        onConfirm={confirmDialog.onConfirm}
      />
    </>
  );
};
