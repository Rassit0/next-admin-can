"use client";
import React from "react";
import { Avatar, Popover, Label, Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, Logout01Icon } from "@hugeicons/core-free-icons";
import { CurrentPerson, AuthIdentity } from "@/shared/helpers/server-context";
import { logoutAction } from "@/modules/auth/actions/logout";
import { useRouter } from "next/navigation";

interface Props {
  user?: AuthIdentity;
  person?: CurrentPerson | null;
}

export const UserAccountDropdown = ({ user, person }: Props) => {
  const router = useRouter();

  const handleAction = (key: React.Key) => {
    if (key === "logout") {
      logoutAction();
    }
    if (key === "profile") {
      router.push("/admin/profile");
    }
  };

  const displayName = person
    ? `${person.name} ${person.lastName}`
    : user?.email || "Admin CAN";
  const displayEmail = user?.email || "";
  const initial =
    person?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "A";

  return (
    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-semibold text-on-surface font-headline leading-tight">
          {displayName}
        </p>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
          Administrador
        </p>
      </div>

      <Popover>
        <Popover.Trigger>
          <div className="cursor-pointer rounded-full border-2 border-primary-container/20">
            <Avatar size="sm">
              {person?.imageUrl && (
                <Avatar.Image
                  alt={`Avatar de ${person.name}`}
                  src={person.imageUrl}
                />
              )}
              <Avatar.Fallback delayMs={600} className="font-bold text-primary">
                {initial}
              </Avatar.Fallback>
            </Avatar>
          </div>
        </Popover.Trigger>

        <Popover.Content className="p-0 min-w-50">
          <Popover.Dialog className="w-full outline-none p-0">
            <div className="w-full flex flex-col">
              <div className="px-4 py-3 flex items-center gap-3 border-b border-outline-variant/30">
                <Avatar size="sm">
                  {person?.imageUrl && (
                    <Avatar.Image alt={displayName} src={person.imageUrl} />
                  )}
                  <Avatar.Fallback
                    delayMs={600}
                    className="bg-primary text-on-primary"
                  >
                    {initial}
                  </Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-bold text-on-surface">
                    {displayName}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {displayEmail}
                  </p>
                </div>
              </div>

              <div className="p-1 flex flex-col gap-1 w-full">
                <Button
                  variant="ghost"
                  className="justify-between w-full h-10 px-2"
                  onPress={() => handleAction("profile")}
                >
                  <Label className="cursor-pointer font-medium text-sm">
                    Mi Perfil
                  </Label>
                  <HugeiconsIcon
                    icon={UserIcon}
                    className="size-4 text-muted"
                  />
                </Button>

                <Button
                  variant="danger-soft"
                  className="justify-between w-full h-10 px-2"
                  onPress={() => handleAction("logout")}
                >
                  <Label className="cursor-pointer font-medium text-sm text-danger">
                    Cerrar sesión
                  </Label>
                  <HugeiconsIcon
                    icon={Logout01Icon}
                    className="size-4 text-danger"
                  />
                </Button>
              </div>
            </div>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
};
