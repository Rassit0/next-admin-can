import React from "react";
import { Card } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Mail01Icon,
  SmartPhone01Icon,
  IdentificationIcon,
  Home01Icon,
} from "@hugeicons/core-free-icons";
import { AvatarEditor } from "./AvatarEditor";
import { updateSelfAvatar } from "@/modules/users/actions/update-self-avatar";
import { ISelfProfile } from "@/modules/users/actions/get-detailed-profile";

interface Props {
  profile: ISelfProfile;
}

export function SelfProfileContent({ profile }: Props) {
  const { user, person } = profile;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* AVATAR SECTION */}
      <Card className="col-span-1 shadow-sm border border-outline-variant/30 h-fit">
        <div className="flex flex-col items-center justify-center p-6 gap-4">
          {person ? (
            <AvatarEditor
              initialImageUrl={person.imageUrl}
              initials={person.name.charAt(0).toUpperCase()}
              altText={`Avatar de ${person.name}`}
              updateAction={updateSelfAvatar}
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-4 border-primary-container/20">
              <span className="text-4xl font-bold text-primary">
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="text-center mt-2">
            <h3 className="font-bold text-lg text-on-surface">
              {person ? `${person.name} ${person.lastName}` : user.email}
            </h3>
            <p className="text-sm text-on-surface-variant uppercase tracking-wide font-semibold mt-1">
              {user.role || "Administrador"}
            </p>
          </div>
        </div>
      </Card>

      {/* INFO SECTION */}
      <Card className="col-span-1 md:col-span-2 shadow-sm border border-outline-variant/30">
        <Card.Header className="border-b border-outline-variant/30 px-6 py-4">
          <h3 className="font-semibold text-on-surface flex items-center gap-2">
            <HugeiconsIcon icon={IdentificationIcon} className="w-5 h-5" />
            Datos Personales
          </h3>
        </Card.Header>
        <Card.Content className="p-6">
          {!person ? (
            <div className="flex flex-col items-center justify-center py-10 text-on-surface-variant">
              <HugeiconsIcon
                icon={UserIcon}
                className="w-12 h-12 mb-4 opacity-50"
              />
              <p>Sin información personal vinculada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wide">
                  Nombres
                </p>
                <p className="font-medium text-on-surface">{person.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wide">
                  Apellidos
                </p>
                <p className="font-medium text-on-surface">
                  {person.lastName} {person.secondLastName || ""}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wide">
                  Tipo de Documento
                </p>
                <p className="font-medium text-on-surface">
                  {person.documentType || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wide">
                  Nro. de Documento
                </p>
                <p className="font-medium text-on-surface">
                  {person.documentNumber || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wide flex items-center gap-1">
                  <HugeiconsIcon icon={Mail01Icon} className="w-3 h-3" /> Email
                  de Cuenta
                </p>
                <p className="font-medium text-on-surface">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wide flex items-center gap-1">
                  <HugeiconsIcon icon={SmartPhone01Icon} className="w-3 h-3" />{" "}
                  Teli©fono
                </p>
                <p className="font-medium text-on-surface">
                  {person.phone || "-"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wide flex items-center gap-1">
                  <HugeiconsIcon icon={Home01Icon} className="w-3 h-3" />{" "}
                  Dirección
                </p>
                <p className="font-medium text-on-surface">
                  {person.address || "-"}
                </p>
              </div>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
