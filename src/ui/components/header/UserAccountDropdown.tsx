"use client";
import React, { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (key: React.Key) => {
    setIsOpen(false);
    if (key === "logout") {
      logoutAction();
    }
    if (key === "profile") {
      router.push("/admin/profile");
    }
  };

  const displayName = person
    ? `${person.name} ${person.lastName}`
    : user?.email || "Mi cuenta";
  const displayEmail = user?.email || "";
  const initial =
    person?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <div className="text-right hidden sm:block min-w-0">
        <p className="text-sm font-semibold text-foreground font-heading leading-tight truncate max-w-36 md:max-w-48">
          {displayName}
        </p>
        {person && displayEmail && (
          <p className="text-[11px] text-muted leading-tight truncate max-w-36 md:max-w-48">
            {displayEmail}
          </p>
        )}
      </div>

      <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger>
          <button
            type="button"
            aria-label={`Menú de cuenta de ${displayName}`}
            className="inline-flex items-center justify-center cursor-pointer rounded-full p-0.5 border border-border hover:border-primary/40 hover:bg-surface-secondary/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
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
          </button>
        </Popover.Trigger>

        <Popover.Content className="p-0 min-w-56">
          <Popover.Dialog className="w-full outline-none p-0">
            <div className="w-full flex flex-col">
              <div className="px-4 py-3 flex items-center gap-3 border-b border-border">
                <Avatar size="sm">
                  {person?.imageUrl && (
                    <Avatar.Image alt={displayName} src={person.imageUrl} />
                  )}
                  <Avatar.Fallback
                    delayMs={600}
                    className="bg-primary text-white"
                  >
                    {initial}
                  </Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    {displayName}
                  </p>
                  {displayEmail && (
                    <p className="text-xs text-muted truncate">
                      {displayEmail}
                    </p>
                  )}
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
