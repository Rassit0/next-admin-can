"use client";

import React, { useState } from "react";
import { Avatar, Button, Chip, Table, toast } from "@heroui/react";
import {
  Copy01Icon,
  Search01Icon,
  EyeIcon,
  Edit03Icon,
  UserBlock01Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SortableColumnHeader, TableActions, ActionDef } from "@/ui";
import { IStaff } from "@/modules/staff";
import { EditModal as EditPersonModal, IPersonBase, TGender } from "@/modules/persons";
import { useRouter } from "next/navigation";
import { StaffDetailModal } from "../modal/StaffDetailModal";
import { ConfirmAlertDialog } from "@/modules/users/components/modal/ConfirmAlertDialog";
import { deactivateStaff } from "../../actions/deactivate";
import { reactivateStaff } from "../../actions/reactivate";

interface Props {
  staffs: IStaff[];
}

export const StaffTable = ({ staffs }: Props) => {
  const router = useRouter();

  const [detailStaff, setDetailStaff] = useState<IStaff | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [selectedPerson, setSelectedPerson] = useState<IPersonBase | null>(null);
  const [isEditPersonOpen, setIsEditPersonOpen] = useState(false);

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

  const genderMap: Record<TGender, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
  };

  const genderClassMap: Record<TGender, string> = {
    MALE: "bg-blue-400 text-blue-50",
    FEMALE: "bg-pink-400 text-pink-50",
  };

  const handleToggleActive = (staff: IStaff) => {
    const fullName = [
      staff.person.name,
      staff.person.lastName,
      staff.person.secondLastName,
    ]
      .filter(Boolean)
      .join(" ");

    setConfirmDialog({
      isOpen: true,
      title: staff.isActive
        ? "Desactivar Miembro del Personal"
        : "Reactivar Miembro del Personal",
      description: staff.isActive
        ? `¿Estás seguro de desactivar a ${fullName}? El personal no podrá ser asignado a nuevos grupos ni operar en el portal de profesores mientras permanezca inactivo.`
        : `¿Estás seguro de reactivar a ${fullName}? La ficha quedará nuevamente habilitada en la institución.`,
      status: staff.isActive ? "warning" : "success",
      confirmText: staff.isActive ? "Desactivar" : "Reactivar",
      onConfirm: async () => {
        const action = staff.isActive ? deactivateStaff : reactivateStaff;
        const res = await action(staff.id);

        if (res.error) {
          toast.danger("Error en la operación", {
            description: res.message,
          });
        } else {
          toast.success(
            staff.isActive
              ? "Personal desactivado exitosamente"
              : "Personal reactivado exitosamente",
            {
              description: res.message,
            },
          );
          router.refresh();
        }
      },
    });
  };

  const getStaffActions = (staff: IStaff): ActionDef[] => {
    const actions: ActionDef[] = [
      {
        key: "view",
        label: "Ver Ficha",
        icon: EyeIcon,
        permission: "READ_STAFF",
        onPress: () => {
          setDetailStaff(staff);
          setIsDetailOpen(true);
        },
      },
      {
        key: "edit_person",
        label: "Editar Datos Personales",
        icon: Edit03Icon,
        permission: "UPDATE_PERSONS",
        onPress: () => {
          setSelectedPerson(staff.person);
          setIsEditPersonOpen(true);
        },
      },
    ];

    if (staff.isActive) {
      actions.push({
        key: "deactivate",
        label: "Desactivar Personal",
        icon: UserBlock01Icon,
        permission: "DELETE_STAFF",
        danger: true,
        onPress: () => handleToggleActive(staff),
      });
    } else {
      actions.push({
        key: "reactivate",
        label: "Reactivar Personal",
        icon: UserCheck01Icon,
        permission: "UPDATE_STAFF",
        onPress: () => handleToggleActive(staff),
      });
    }

    return actions;
  };

  return (
    <>
      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Tabla de Personal"
            className="min-w-200"
          >
            <Table.Header>
              <Table.Column
                allowsSorting
                isRowHeader
                className="after:hidden"
                id="id"
              >
                <SortableColumnHeader id="id">ID</SortableColumnHeader>
              </Table.Column>

              <Table.Column id="image">
                IMAGEN
              </Table.Column>

              <Table.Column allowsSorting id="name">
                <SortableColumnHeader id="name">PERSONAL</SortableColumnHeader>
              </Table.Column>

              <Table.Column allowsSorting id="lastName">
                <SortableColumnHeader id="lastName">
                  Primer Apellido
                </SortableColumnHeader>
              </Table.Column>

              <Table.Column allowsSorting id="secondLastName">
                <SortableColumnHeader id="secondLastName">
                  Segundo Apellido
                </SortableColumnHeader>
              </Table.Column>

              <Table.Column allowsSorting id="documentNumber">
                <SortableColumnHeader id="documentNumber">
                  CI
                </SortableColumnHeader>
              </Table.Column>

              <Table.Column allowsSorting id="birthDate">
                <SortableColumnHeader id="birthDate">
                  FECHA NACIMIENTO
                </SortableColumnHeader>
              </Table.Column>

              <Table.Column>EDAD</Table.Column>

              <Table.Column allowsSorting id="gender">
                <SortableColumnHeader id="gender">GÉNERO</SortableColumnHeader>
              </Table.Column>

              <Table.Column allowsSorting id="isActive">
                <SortableColumnHeader id="isActive">ESTADO</SortableColumnHeader>
              </Table.Column>

              <Table.Column className="text-center">ACCIONES</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-default-100 text-default-500">
                    <HugeiconsIcon icon={Search01Icon} className="size-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-medium font-medium">
                      No se encontró personal
                    </span>
                    <span className="text-sm text-default-400">
                      Intenta con otros términos de búsqueda o agrega nuevo
                      personal.
                    </span>
                  </div>
                </div>
              )}
            >
              {staffs.map((staff) => (
                <Table.Row key={staff.id} id={staff.id}>
                  <Table.Cell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{staff.id.slice(0, 8)}...</span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        onPress={() => {
                          navigator.clipboard.writeText(staff.id);
                          toast.success("ID copiado al portapapeles");
                        }}
                      >
                        <HugeiconsIcon icon={Copy01Icon} />
                      </Button>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Avatar size="sm">
                      <Avatar.Image src={staff.person.imageUrl || undefined} />
                      <Avatar.Fallback>
                        {staff.person.name.charAt(0)}
                        {staff.person.lastName.charAt(0)}
                      </Avatar.Fallback>
                    </Avatar>
                  </Table.Cell>
                  <Table.Cell>{staff.person.name}</Table.Cell>
                  <Table.Cell>{staff.person.lastName}</Table.Cell>
                  <Table.Cell>{staff.person.secondLastName || "-"}</Table.Cell>
                  <Table.Cell>{staff.person.documentNumber || "-"}</Table.Cell>
                  <Table.Cell>
                    {staff.person.birthDate
                      ? new Date(staff.person.birthDate).toLocaleDateString()
                      : "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {staff.person.birthDate
                      ? new Date().getFullYear() -
                        new Date(staff.person.birthDate).getFullYear()
                      : "-"}
                  </Table.Cell>
                  <Table.Cell className="min-w-25">
                    <Chip
                      size="sm"
                      variant="soft"
                      className={genderClassMap[staff.person.gender as TGender]}
                    >
                      {genderMap[staff.person.gender as TGender] || staff.person.gender || "-"}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={staff.isActive ? "success" : "default"}
                    >
                      {staff.isActive ? "Activo" : "Inactivo"}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-center items-center">
                      <TableActions actions={getStaffActions(staff)} />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <StaffDetailModal
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        staff={detailStaff}
        onEditPerson={(person) => {
          setSelectedPerson(person);
          setIsEditPersonOpen(true);
        }}
      />

      {selectedPerson && (
        <EditPersonModal
          key={selectedPerson.id}
          person={selectedPerson}
          showButton={false}
          isOpen={isEditPersonOpen}
          onOpenChange={setIsEditPersonOpen}
          onSuccess={() => router.refresh()}
        />
      )}

      <ConfirmAlertDialog
        isOpen={confirmDialog.isOpen}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, isOpen: open }))
        }
        title={confirmDialog.title}
        description={confirmDialog.description}
        status={confirmDialog.status}
        confirmText={confirmDialog.confirmText}
        onConfirm={confirmDialog.onConfirm}
      />
    </>
  );
};
