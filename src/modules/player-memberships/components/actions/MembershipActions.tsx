"use client";
import {
  AlertDialog,
  Button,
  Dropdown,
  InputGroup,
  Label,
  TextField,
  useOverlayState,
  DatePicker,
  DateField,
  Calendar,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { toast } from "sonner";
import {
  MoreVerticalSquare01Icon,
  PauseIcon,
  PlayIcon,
  CheckmarkCircle02Icon,
  Logout01Icon,
  Settings01Icon,
  Note01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  IPlayerMembership,
  MembershipLifecycleAction,
  updateMembershipLifecycle,
  createMembershipPause,
  removeMembership,
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
    { key: "pause", label: "Programar pausa", icon: Calendar01Icon },
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
  PENDING_ACTIVE: [
    { key: "pause", label: "Programar pausa", icon: Calendar01Icon },
    { key: "activate", label: "Activar", icon: PlayIcon },
    { key: "withdraw", label: "Dar de baja", icon: Logout01Icon, danger: true },
  ],
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

  if (membership.totalPaidAmount === 0) {
    allActions.push({
      key: "remove",
      label: "Eliminar Membresía",
      icon: Logout01Icon, // Using Logout01Icon as standard for danger
      danger: true,
    });
  }

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
    const confirmDelete = formData.get("confirmDelete") as string;
    const action = selectedAction.key;

    if (action === "remove" && confirmDelete !== "ELIMINAR") {
      toast.error("Debes escribir ELIMINAR para confirmar");
      setLoading(false);
      return;
    }

    if (action !== "remove" && action !== "activate" && !reason?.trim()) {
      toast.error("El motivo es obligatorio para esta acción");
      setLoading(false);
      return;
    }

    let res;

    if (action === "remove") {
      res = await removeMembership(membership.id);
    } else if (action === "pause") {
      const startDate = formData.get("startDate") as string;
      const endDate = formData.get("endDate") as string;
      
      if (!startDate || !endDate) {
        toast.error("Debes seleccionar las fechas de inicio y fin");
        setLoading(false);
        return;
      }
      
      res = await createMembershipPause({
        id: membership.id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        reason,
      });
    } else {
      res = await updateMembershipLifecycle({
        id: membership.id,
        action: action as MembershipLifecycleAction,
        reason,
      });
    }

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

                {selectedAction?.key === "pause" && (
                  <div className="flex gap-4 w-full">
                    <DatePicker
                      name="startDate"
                      isRequired
                      className="w-full"
                      defaultValue={today(getLocalTimeZone())}
                    >
                      <Label className="text-sm font-semibold">
                        Fecha inicio
                      </Label>
                      <DateField.Group variant="secondary">
                        <DateField.Input>
                          {(segment) => <DateField.Segment segment={segment} />}
                        </DateField.Input>
                        <DateField.Suffix>
                          <DatePicker.Trigger>
                            <DatePicker.TriggerIndicator />
                          </DatePicker.Trigger>
                        </DateField.Suffix>
                      </DateField.Group>
                      <DatePicker.Popover>
                        <Calendar aria-label="Fecha inicio">
                          <Calendar.Header>
                            <Calendar.YearPickerTrigger>
                              <Calendar.YearPickerTriggerHeading />
                              <Calendar.YearPickerTriggerIndicator />
                            </Calendar.YearPickerTrigger>
                            <Calendar.NavButton slot="previous" />
                            <Calendar.NavButton slot="next" />
                          </Calendar.Header>
                          <Calendar.Grid>
                            <Calendar.GridHeader>
                              {(day) => (
                                <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                              )}
                            </Calendar.GridHeader>
                            <Calendar.GridBody>
                              {(date) => <Calendar.Cell date={date} />}
                            </Calendar.GridBody>
                          </Calendar.Grid>
                          <Calendar.YearPickerGrid>
                            <Calendar.YearPickerGridBody>
                              {({ year }) => (
                                <Calendar.YearPickerCell year={year} />
                              )}
                            </Calendar.YearPickerGridBody>
                          </Calendar.YearPickerGrid>
                        </Calendar>
                      </DatePicker.Popover>
                    </DatePicker>

                    <DatePicker
                      name="endDate"
                      isRequired
                      className="w-full"
                      defaultValue={today(getLocalTimeZone())}
                    >
                      <Label className="text-sm font-semibold">
                        Fecha fin
                      </Label>
                      <DateField.Group variant="secondary">
                        <DateField.Input>
                          {(segment) => <DateField.Segment segment={segment} />}
                        </DateField.Input>
                        <DateField.Suffix>
                          <DatePicker.Trigger>
                            <DatePicker.TriggerIndicator />
                          </DatePicker.Trigger>
                        </DateField.Suffix>
                      </DateField.Group>
                      <DatePicker.Popover>
                        <Calendar aria-label="Fecha fin">
                          <Calendar.Header>
                            <Calendar.YearPickerTrigger>
                              <Calendar.YearPickerTriggerHeading />
                              <Calendar.YearPickerTriggerIndicator />
                            </Calendar.YearPickerTrigger>
                            <Calendar.NavButton slot="previous" />
                            <Calendar.NavButton slot="next" />
                          </Calendar.Header>
                          <Calendar.Grid>
                            <Calendar.GridHeader>
                              {(day) => (
                                <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                              )}
                            </Calendar.GridHeader>
                            <Calendar.GridBody>
                              {(date) => <Calendar.Cell date={date} />}
                            </Calendar.GridBody>
                          </Calendar.Grid>
                          <Calendar.YearPickerGrid>
                            <Calendar.YearPickerGridBody>
                              {({ year }) => (
                                <Calendar.YearPickerCell year={year} />
                              )}
                            </Calendar.YearPickerGridBody>
                          </Calendar.YearPickerGrid>
                        </Calendar>
                      </DatePicker.Popover>
                    </DatePicker>
                  </div>
                )}

                {selectedAction?.key === "remove" && (
                  <TextField name="confirmDelete" isRequired className="w-full">
                    <Label className="text-sm font-semibold">
                      Escriba ELIMINAR para confirmar
                    </Label>
                    <InputGroup>
                      <InputGroup.Input placeholder="ELIMINAR" />
                    </InputGroup>
                  </TextField>
                )}

                {selectedAction?.key !== "remove" && (
                  <TextField 
                    name="reason" 
                    className="w-full"
                    isRequired={selectedAction?.key !== "activate"}
                  >
                    <Label className="text-sm font-semibold">
                      Motivo u Observación {selectedAction?.key === "activate" && "(Opcional)"}
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
                )}
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
