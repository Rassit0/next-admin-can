"use client";
import { Button, Dropdown, Label, Tooltip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreVerticalSquare01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/shared/providers/PermissionsProvider";
import React from "react";

export interface ActionDef {
  key: string;
  label: string;
  icon: any; // Hugeicon type
  permission?: string;
  danger?: boolean;
  onPress?: () => void;
  href?: string;
}

interface Props {
  actions: ActionDef[];
  mode?: "responsive" | "dropdown" | "buttons";
}

export const TableActions = ({ actions, mode = "responsive" }: Props) => {
  const permissions = usePermissions();
  const router = useRouter();

  // Filtrar las acciones según los permisos del usuario
  const allowedActions = actions.filter(
    (action) => !action.permission || permissions.includes(action.permission)
  );

  if (allowedActions.length === 0) return null;

  const handleAction = (action: ActionDef) => {
    if (action.href) {
      router.push(action.href, { scroll: false });
    } else if (action.onPress) {
      action.onPress();
    }
  };

  const renderButtons = (className: string) => (
    <div className={`items-center gap-1 ${className}`}>
      {allowedActions.map((action) => (
        <Tooltip delay={0} key={action.key}>
          <Button
            isIconOnly
            className={
              action.danger
                ? "hover:bg-danger/20 text-danger"
                : "hover:bg-accent/30"
            }
            size="sm"
            variant="ghost"
            onPress={() => handleAction(action)}
          >
            <HugeiconsIcon icon={action.icon} />
          </Button>
          <Tooltip.Content showArrow placement="bottom">
            <Tooltip.Arrow />
            <p>{action.label}</p>
          </Tooltip.Content>
        </Tooltip>
      ))}
    </div>
  );

  const renderDropdown = (className: string) => (
    <div className={`items-center ${className}`}>
      <Dropdown>
        <Dropdown.Trigger>
          <Button aria-label="Acciones" isIconOnly size="sm" variant="ghost">
            <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Popover>
          <Dropdown.Menu
            onAction={(key) => {
              const action = allowedActions.find((a) => a.key === key);
              if (action) handleAction(action);
            }}
          >
            {allowedActions.map((action) => (
              <Dropdown.Item
                key={action.key}
                id={action.key}
                textValue={action.label}
              >
                <div className="flex items-center gap-2 w-full">
                  <HugeiconsIcon
                    className={action.danger ? "text-danger" : undefined}
                    icon={action.icon}
                  />
                  <Label className={action.danger ? "text-danger w-full cursor-pointer" : "w-full cursor-pointer"}>
                    {action.label}
                  </Label>
                </div>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );

  if (mode === "buttons") return renderButtons("flex");
  if (mode === "dropdown") return renderDropdown("flex");

  // Modo Responsive por defecto
  return (
    <>
      {renderButtons("hidden md:flex")}
      {renderDropdown("flex md:hidden")}
    </>
  );
};
