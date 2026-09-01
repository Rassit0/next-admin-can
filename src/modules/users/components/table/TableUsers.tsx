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

interface Props {
  users: IUser[];
}

export const TableUsers: React.FC<Props> = ({ users }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleToggleActive = async (user: IUser) => {
    // Protección contra error tonto
    if (
      !confirm(
        `¿Estás seguro de ${user.isActive ? "desactivar" : "reactivar"} a este usuario?`,
      )
    )
      return;

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
  };

  return (
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
                            href={`/admin/users/usuarios/${user.id}`}
                          >
                            <div className="flex items-center gap-2">
                              <HugeiconsIcon icon={PencilEdit01Icon} size={18} />
                              Editar Perfil
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
  );
};
