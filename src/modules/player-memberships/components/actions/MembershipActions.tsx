"use client";
import {
  AlertDialog,
  Button,
  Dropdown,
  InputGroup,
  Label,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { toast } from "sonner";
import {
  MoreVerticalSquare01Icon,
  PauseIcon,
  PlayIcon,
  CheckmarkCircle02Icon,
  Logout01Icon,
  Settings01Icon,
  Note01Icon,
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

  const confirmState = useOverlayState();
  const [selectedAction, setSelectedAction] = useState<ActionDef | null>(null);

  const allActions: ActionDef[] = [
    { key: "manage", label: "Gestionar", icon: Settings01Icon },
    ...statusActions,
  ];

  const handleActionSelect = (key: string) => {
    if (key === "manage") {
      const manageUrl = `/admin/teams/${params.disciplineId}/${params.clubId}/${params.teamId}/team-seasons/${params.teamSeasonId}/player-memberships/${membership.id}`;
      router.push(manageUrl);
      return;
    }

    const actionDef = allActions.find((a) => a.key === key);
    if (actionDef) {
      setSelectedAction(actionDef);
      confirmState.open();
    }
  };

  const executeAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAction) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const reason = formData.get("reason") as string;
    const action = selectedAction.key as MembershipLifecycleAction;

    const res = await updateMembershipLifecycle({
      id: membership.id,
      action,
      reason,
    });

    if (res.error) {
      toast.error(res.message, { description: res.message });
      setLoading(false);
      return;
    }

    toast.success(res.message, { description: res.message });
    confirmState.close();
    setLoading(false);
    router.refresh();
  };

  return (
    <>
      <Dropdown>
        <Button
          aria-label="Acciones de membresía"
          isIconOnly
          size="sm"
          variant="ghost"
        >
          <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu onAction={(key) => handleActionSelect(key as string)}>
            {allActions.map((action) => (
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

      <AlertDialog.Backdrop
        isOpen={confirmState.isOpen}
        onOpenChange={confirmState.setOpen}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-md">
            <AlertDialog.CloseTrigger />
            <form
              onSubmit={executeAction}
              className="flex flex-col h-full w-full"
            >
              <AlertDialog.Header>
                <AlertDialog.Icon
                  status={selectedAction?.danger ? "danger" : "accent"}
                />
                <AlertDialog.Heading>
                  Confirmar: {selectedAction?.label}
                </AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body className="gap-4 p-2">
                <p>
                  ¿Estás seguro de que deseas ejecutar la acción{" "}
                  <strong>{selectedAction?.label.toLowerCase()}</strong> para
                  esta membresía?
                </p>

                <TextField name="reason" className="w-full">
                  <Label className="text-sm font-semibold">
                    Motivo u Observación (Opcional)
                  </Label>
                  <InputGroup>
                    <InputGroup.Prefix>
                      <HugeiconsIcon
                        icon={Note01Icon}
                        size={18}
                        className="text-muted-foreground"
                      />
                    </InputGroup.Prefix>
                    <InputGroup.Input placeholder="Ej. Retiro voluntario, Falta de pago..." />
                  </InputGroup>
                </TextField>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button
                  variant="tertiary"
                  onPress={confirmState.close}
                  isDisabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant={selectedAction?.danger ? "danger" : "primary"}
                  isPending={loading}
                >
                  Confirmar
                </Button>
              </AlertDialog.Footer>
            </form>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
};
