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
import { toast } from "sonner";
import {
  MoreVerticalSquare01Icon,
  CheckmarkCircle02Icon,
  CancelCircleIcon,
  Calendar01Icon,
  Note01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ISeason, SeasonStatus } from "../../interfaces/season.interface";
import {
  SeasonLifecycleAction,
  updateSeasonLifecycle,
} from "../../actions/update-lifecycle";
import { getLocalTimeZone, today, parseDate, CalendarDate } from "@internationalized/date";

interface Props {
  season: ISeason;
}

interface ActionDef {
  key: string;
  label: string;
  icon: typeof CancelCircleIcon;
  danger?: boolean;
}

const ACTIONS_BY_STATUS: Record<SeasonStatus, ActionDef[]> = {
  ACTIVE: [
    { key: "extend", label: "Extender fecha", icon: Calendar01Icon },
    { key: "finish", label: "Finalizar", icon: CheckmarkCircle02Icon },
    { key: "cancel", label: "Cancelar", icon: CancelCircleIcon, danger: true },
  ],
  FINISHED: [],
  CANCELLED: [],
};

export const SeasonActions = ({ season }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const statusActions = ACTIONS_BY_STATUS[season.status] ?? [];

  const confirmState = useOverlayState();
  const [selectedAction, setSelectedAction] = useState<ActionDef | null>(null);

  // Parse the current end date for the DatePicker (format YYYY-MM-DD)
  const seasonEndDateObj = new Date(season.endDate);
  const [newEndDate, setNewEndDate] = useState<CalendarDate>(
    new CalendarDate(
      seasonEndDateObj.getUTCFullYear(),
      seasonEndDateObj.getUTCMonth() + 1,
      seasonEndDateObj.getUTCDate()
    )
  );

  const allActions: ActionDef[] = [...statusActions];

  const handleActionSelect = (key: string) => {
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
    const action = selectedAction.key as SeasonLifecycleAction;

    let payloadNewEndDate: string | undefined = undefined;
    if (action === "extend") {
      // Create a string in ISO format for the API
      payloadNewEndDate = new Date(
        Date.UTC(newEndDate.year, newEndDate.month - 1, newEndDate.day)
      ).toISOString();
    }

    const res = await updateSeasonLifecycle({
      id: season.id,
      action,
      reason,
      newEndDate: payloadNewEndDate,
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

  if (allActions.length === 0) return null;

  return (
    <>
      <Dropdown>
        <Button
          aria-label="Acciones de temporada"
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
          <AlertDialog.Dialog className="sm:max-w-md overflow-visible">
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
              <AlertDialog.Body className="gap-4 p-2 overflow-visible">
                <p>
                  ¿Estás seguro de que deseas ejecutar la acción{" "}
                  <strong>{selectedAction?.label.toLowerCase()}</strong> para
                  la temporada <strong>{season.name}</strong>?
                </p>

                {selectedAction?.key === "extend" && (
                  <DatePicker
                    isRequired
                    name="newEndDate"
                    hideTimeZone
                    value={newEndDate}
                    onChange={(val) => val && setNewEndDate(val)}
                    minValue={today(getLocalTimeZone())}
                  >
                    <Label className="text-sm font-semibold">Nueva fecha de fin</Label>
                    <DateField.Group variant="secondary" fullWidth>
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
                      <Calendar aria-label="Event date">
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
                            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                          </Calendar.GridHeader>
                          <Calendar.GridBody>
                            {(date) => <Calendar.Cell date={date} />}
                          </Calendar.GridBody>
                        </Calendar.Grid>
                        <Calendar.YearPickerGrid>
                          <Calendar.YearPickerGridBody>
                            {({ year }) => <Calendar.YearPickerCell year={year} />}
                          </Calendar.YearPickerGridBody>
                        </Calendar.YearPickerGrid>
                      </Calendar>
                    </DatePicker.Popover>
                  </DatePicker>
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
                    <InputGroup.Input placeholder="Ej. Torneo de verano, Falta de alumnos..." />
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
