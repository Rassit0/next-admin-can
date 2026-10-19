"use client";

import React from "react";
import { Avatar, Button, Chip, Modal, toast } from "@heroui/react";
import {
  Copy01Icon,
  Mail01Icon,
  CallIcon,
  Location01Icon,
  Calendar03Icon,
  IdentityCardIcon,
  UserIcon,
  Edit03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IStaff } from "@/modules/staff";
import { IPersonBase, TGender } from "@/modules/persons";
import { usePermissions } from "@/shared/providers/PermissionsProvider";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  staff: IStaff | null;
  onEditPerson?: (person: IPersonBase) => void;
}

export const StaffDetailModal: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  staff,
  onEditPerson,
}) => {
  const permissions = usePermissions();
  const canEditPerson = permissions.includes("UPDATE_PERSONS");

  if (!staff) return null;

  const { person } = staff;

  const genderMap: Record<TGender, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const calculateAge = (birthDate: Date | null | undefined): number | string => {
    if (!birthDate) return "-";
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const fullName = [person.name, person.lastName, person.secondLastName]
    .filter(Boolean)
    .join(" ");

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container placement="center">
        <Modal.Dialog className="sm:max-w-lg">
          <Modal.CloseTrigger />
          <Modal.Header className="flex flex-col gap-1 pb-2">
            <Modal.Heading className="text-xl font-bold font-headline">
              Ficha del Personal
            </Modal.Heading>
            <p className="text-xs text-default-400">
              Detalle administrativo del miembro de la institución
            </p>
          </Modal.Header>

          <Modal.Body className="space-y-6 pb-6">
            {/* Header Profile Card */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-default/40 border border-default-200">
              <Avatar size="lg" className="h-16 w-16 text-lg">
                <Avatar.Image src={person.imageUrl || undefined} />
                <Avatar.Fallback>
                  {person.name.charAt(0)}
                  {person.lastName.charAt(0)}
                </Avatar.Fallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base truncate">{fullName}</h3>
                  <Chip
                    size="sm"
                    variant="soft"
                    color={staff.isActive ? "success" : "default"}
                  >
                    {staff.isActive ? "Activo" : "Inactivo"}
                  </Chip>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-default-500">
                  <span className="font-mono">ID: {staff.id.slice(0, 8)}...</span>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 min-w-5"
                    onPress={() => copyToClipboard(staff.id, "ID")}
                  >
                    <HugeiconsIcon icon={Copy01Icon} size={12} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Personal Information Group */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-default-400 mb-3 flex items-center gap-1.5">
                <HugeiconsIcon icon={UserIcon} size={14} />
                Datos Personales
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-surface-secondary/40 border border-default-100">
                  <span className="text-xs text-default-400 block mb-0.5">
                    Documento de Identidad
                  </span>
                  <span className="font-medium flex items-center gap-1.5">
                    <HugeiconsIcon icon={IdentityCardIcon} size={15} className="text-default-400" />
                    {person.documentType ? `${person.documentType}: ` : ""}
                    {person.documentNumber || "No registrado"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-secondary/40 border border-default-100">
                  <span className="text-xs text-default-400 block mb-0.5">
                    Género
                  </span>
                  <span className="font-medium">
                    {person.gender ? genderMap[person.gender as TGender] || person.gender : "-"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-secondary/40 border border-default-100">
                  <span className="text-xs text-default-400 block mb-0.5">
                    Fecha de Nacimiento
                  </span>
                  <span className="font-medium flex items-center gap-1.5">
                    <HugeiconsIcon icon={Calendar03Icon} size={15} className="text-default-400" />
                    {person.birthDate ? new Date(person.birthDate).toLocaleDateString() : "-"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-secondary/40 border border-default-100">
                  <span className="text-xs text-default-400 block mb-0.5">
                    Edad
                  </span>
                  <span className="font-medium">
                    {person.birthDate ? `${calculateAge(person.birthDate)} años` : "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information Group */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-default-400 mb-3 flex items-center gap-1.5">
                <HugeiconsIcon icon={CallIcon} size={14} />
                Información de Contacto
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-secondary/40 border border-default-100">
                  <HugeiconsIcon icon={CallIcon} size={16} className="text-default-400" />
                  <div>
                    <span className="text-xs text-default-400 block">Teléfono / Celular</span>
                    <span className="font-medium">{person.phone || "No registrado"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-secondary/40 border border-default-100">
                  <HugeiconsIcon icon={Mail01Icon} size={16} className="text-default-400" />
                  <div>
                    <span className="text-xs text-default-400 block">Correo Electrónico</span>
                    <span className="font-medium">{person.email || "No registrado"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-secondary/40 border border-default-100">
                  <HugeiconsIcon icon={Location01Icon} size={16} className="text-default-400" />
                  <div>
                    <span className="text-xs text-default-400 block">Dirección</span>
                    <span className="font-medium">{person.address || "No registrada"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit / Registration Info */}
            <div className="pt-2 border-t border-default-200 flex justify-between items-center text-xs text-default-400">
              <span>Registrado el: {new Date(staff.createdAt).toLocaleDateString()}</span>
              <span>Última modif.: {new Date(staff.updatedAt).toLocaleDateString()}</span>
            </div>
          </Modal.Body>

          <Modal.Footer className="flex justify-between items-center">
            <div>
              {canEditPerson && onEditPerson && (
                <Button
                  variant="tertiary"
                  size="sm"
                  onPress={() => {
                    onOpenChange(false);
                    onEditPerson(person);
                  }}
                >
                  <HugeiconsIcon icon={Edit03Icon} size={16} />
                  Editar Datos Personales
                </Button>
              )}
            </div>
            <Button
              variant="secondary"
              onPress={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
