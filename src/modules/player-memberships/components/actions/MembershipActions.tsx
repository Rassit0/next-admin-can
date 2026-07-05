"use client";
import { Button, Dropdown, Label, toast } from "@heroui/react";
import {
  MoreVerticalSquare01Icon,
  PauseIcon,
  PlayIcon,
  CheckmarkCircle02Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IPlayerMembership,
  MembershipLifecycleAction,
  updateMembershipLifecycle,
} from "@/modules/player-memberships";

interface Props {
  membership: IPlayerMembership;
}

interface ActionDef {
  key: MembershipLifecycleAction;
  label: string;
  icon: typeof PauseIcon;
  danger?: boolean;
}

const ACTIONS_BY_STATUS: Record<IPlayerMembership["status"], ActionDef[]> = {
  ACTIVE: [
    { key: "suspend", label: "Suspender", icon: PauseIcon },
    { key: "finish", label: "Finalizar", icon: CheckmarkCircle02Icon },
    { key: "withdraw", label: "Dar de baja", icon: Logout01Icon, danger: true },
  ],
  SUSPENDED: [
    { key: "reactivate", label: "Reactivar", icon: PlayIcon },
    { key: "finish", label: "Finalizar", icon: CheckmarkCircle02Icon },
    { key: "withdraw", label: "Dar de baja", icon: Logout01Icon, danger: true },
  ],
  WITHDRAWN: [{ key: "reactivate", label: "Reactivar", icon: PlayIcon }],
  FINISHED: [],
  PENDING_ACTIVE: [{ key: "activate", label: "Activar", icon: PlayIcon }],
};

export const MembershipActions = ({ membership }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const actions = ACTIONS_BY_STATUS[membership.status] ?? [];

  const run = async (action: MembershipLifecycleAction) => {
    setLoading(true);
    const res = await updateMembershipLifecycle({ id: membership.id, action });
    setLoading(false);
    if (res.error) {
      toast.danger(res.message, { description: res.message });
      return;
    }
    toast.success(res.message, { description: res.message });
    router.refresh();
  };

  if (actions.length === 0) {
    return (
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        isDisabled
        aria-label="Sin acciones"
      >
        <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
      </Button>
    );
  }

  return (
    <Dropdown>
      <Button
        aria-label="Acciones de membresía"
        isIconOnly
        size="sm"
        variant="ghost"
        isPending={loading}
      >
        <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          onAction={(key) => run(key as MembershipLifecycleAction)}
        >
          {actions.map((action) => (
            <Dropdown.Item
              key={action.key}
              id={action.key}
              textValue={action.label}
            >
              <HugeiconsIcon
                className={action.danger ? "text-danger" : undefined}
                icon={action.icon}
              />
              <Label className={action.danger ? "text-danger" : undefined}>
                {action.label}
              </Label>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
