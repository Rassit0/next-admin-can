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
  CheckmarkCircle02Icon,
  Logout01Icon,
  Note01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ITeamSeason,
  cancelTeamSeason,
  finalizeTeamSeason,
  createTeamSeasonPause,
} from "@/modules/team-seasons";

interface Props {
  teamSeason: ITeamSeason;
}

interface ActionDef {
  key: string;
  label: string;
  icon: typeof CheckmarkCircle02Icon;
  danger?: boolean;
}

const ACTIONS_BY_STATUS: Record<ITeamSeason["status"], ActionDef[]> = {
  ACTIVE: [
    { key: "pause", label: "Programar pausa", icon: Calendar01Icon },
    { key: "finish", label: "Finalizar", icon: CheckmarkCircle02Icon },
    { key: "cancel", label: "Cancelar", icon: Logout01Icon, danger: true },
  ],
  DRAFT: [
    { key: "cancel", label: "Cancelar", icon: Logout01Icon, danger: true },
  ],
  CANCELLED: [],
  FINISHED: [],
};

export const TeamSeasonActions = ({ teamSeason }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const statusActions = ACTIONS_BY_STATUS[teamSeason.status] ?? [];

  const confirmState = useOverlayState();
  const [selectedAction, setSelectedAction] = useState<ActionDef | null>(null);

  if (statusActions.length === 0) {
    return null;
  }

  const handleActionSelect = (key: string) => {
    const actionDef = statusActions.find((a) => a.key === key);
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
    const action = selectedAction.key;

    let res;
    if (action === "pause") {
      const startDate = formData.get("startDate") as string;
      const endDate = formData.get("endDate") as string;
      
      if (!startDate || !endDate) {
        toast.error("Debes seleccionar las fechas de inicio y fin");
        setLoading(false);
        return;
      }
      
      res = await createTeamSeasonPause({
        teamSeasonId: teamSeason.id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        reason,
      });
    } else if (action === "finish") {
      res = await finalizeTeamSeason(teamSeason.id, reason);
    } else if (action === "cancel") {
      res = await cancelTeamSeason(teamSeason.id, reason);
    }

    if (!res || res.error) {
      toast.error(res?.message || "Ocurrió un error");
      setLoading(false);
      return;
    }

    toast.success(res.message);
    confirmState.close();
    setLoading(false);
    router.refresh();
  };

  return (
    <>
      <Dropdown>
        <Button
          aria-label="Acciones del equipo"
          isIconOnly
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu onAction={(key) => handleActionSelect(key as string)}>
            {statusActions.map((action) => (
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
                  este equipo?
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

                <TextField name="reason" className="w-full" isRequired>
                  <Label className="text-sm font-semibold">
                    Motivo u Observación
                  </Label>
                  <InputGroup>
                    <InputGroup.Prefix>
                      <HugeiconsIcon
                        icon={Note01Icon}
                        size={18}
                        className="text-muted-foreground"
                      />
                    </InputGroup.Prefix>
                    <InputGroup.Input placeholder="Ej. Falta de alumnos, decisión técnica..." />
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
