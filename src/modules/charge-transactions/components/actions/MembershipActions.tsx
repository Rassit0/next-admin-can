"use client";
import { Button, Dropdown, Label } from "@heroui/react";
import { toast } from "sonner";
import {
  MoreVerticalSquare01Icon,
  PauseIcon,
  PlayIcon,
  CheckmarkCircle02Icon,
  Logout01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  IPlayerMembership,
  MembershipLifecycleAction,
  updateMembershipLifecycle,
} from "@/modules/player-memberships";

interface Props {
  membership: IPlayerMembership;
}

interface ActionDef {
  key: string;
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
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const statusActions = ACTIONS_BY_STATUS[membership.status] ?? [];

  const allActions: ActionDef[] = [
    { key: "manage", label: "Gestionar", icon: Settings01Icon },
    ...statusActions,
  ];

  const run = async (key: string) => {
    if (key === "manage") {
      const manageUrl = `/admin/teams/${params.disciplineId}/${params.clubId}/${params.teamId}/team-seasons/${params.teamSeasonId}/player-memberships/${membership.id}`;
      router.push(manageUrl);
      return;
    }

    setLoading(true);
    const action = key as MembershipLifecycleAction;
    const res = await updateMembershipLifecycle({ id: membership.id, action });
    setLoading(false);
    if (res.error) {
      toast.error(res.message, { description: res.message });
      return;
    }
    toast.success(res.message, { description: res.message });
    router.refresh();
  };

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
        <Dropdown.Menu onAction={(key) => run(key as string)}>
          {allActions.map((action) => (
            <Dropdown.Item
              key={action.key}
              id={action.key}
              textValue={action.label}
              href={
                action.key === "manage"
                  ? `/admin/teams/${params.disciplineId}/${params.clubId}/${params.teamId}/team-seasons/${params.teamSeasonId}/player-memberships/${membership.id}`
                  : undefined
              }
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
