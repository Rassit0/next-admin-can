"use client";

import { useEffect, useState, startTransition } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Select,
  TextField,
  Label,
  FieldError,
  ListBox,
  TimeField,
  DatePicker,
  DateField,
  Calendar,
  TimeValue,
} from "@heroui/react";
import { parseDate, parseTime, Time, DateValue } from "@internationalized/date";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { getLocations } from "@/modules/locations/actions/get";
import { ILocation } from "@/modules/locations/interfaces/location.interface";
import { createScheduleAction } from "../actions/create-schedule.action";
import { buildSchedulePayload } from "../utils/recurrence.utils";
import {
  ScheduleFormValues,
  scheduleFormSchema,
} from "../schemas/schedule.schema";

interface Props {
  teamSeasonId?: string;
  courseSeasonId?: string;
  onSubmited?: () => void;
  onCancel?: () => void;
}

export const ScheduleForm = ({
  teamSeasonId,
  courseSeasonId,
  onSubmited,
  onCancel,
}: Props) => {
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  const [formData, setFormData] = useState<Partial<ScheduleFormValues>>({
    durationMin: 90,
    days: [],
    timezone: "America/La_Paz",
  });

  // Internationalized Date/Time States
  const [startDateVal, setStartDateVal] = useState<DateValue | null>(null);
  const [untilDateVal, setUntilDateVal] = useState<DateValue | null>(null);
  const [startTimeVal, setStartTimeVal] = useState<TimeValue | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    startTransition(() => {
      getLocations({ per_page: "100", page: "1" }).then((res) => {
        if (!res.error && res.data) {
          // @ts-ignore
          setLocations(res.data.data || []);
        }
        setIsLoadingLocations(false);
      });
    });
  }, []);

  const handleChange = (field: keyof ScheduleFormValues, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Sync Date/Time values to formData
    const submitData = { ...formData };
    if (startDateVal) submitData.startDate = startDateVal.toString();
    if (untilDateVal) submitData.untilDate = untilDateVal.toString();
    if (startTimeVal) {
      // TimeValue toString format depends, safely pad to HH:mm
      const hours = startTimeVal.hour.toString().padStart(2, "0");
      const minutes = startTimeVal.minute.toString().padStart(2, "0");
      submitData.startTime = `${hours}:${minutes}`;
    }

    const parsed = scheduleFormSchema.safeParse(submitData);

    if (!parsed.success) {
      const formErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        if (err.path[0]) {
          formErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    const payload = buildSchedulePayload(parsed.data, {
      teamSeasonId,
      courseSeasonId,
    });

    try {
      const result = await createScheduleAction(payload);
      if (result.error) {
        toast.error(result.message || "Error al programar horario");
      } else {
        toast.success(result.message || "Horario programado con éxito");
        onSubmited?.();
      }
    } catch (error) {
      toast.error("Ocurrió un error de red");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select
        name="locationId"
        placeholder="Selecciona donde será la sesión"
        selectedKey={formData.locationId || undefined}
        onSelectionChange={(key) => handleChange("locationId", key as string)}
      >
        <Label>Ubicación</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {locations.map((loc) => (
              <ListBox.Item key={loc.id} id={loc.id} textValue={loc.name}>
                {loc.name}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      {errors.locationId && (
        <span className="text-red-500 text-sm">{errors.locationId}</span>
      )}

      <div className="flex gap-4">
        <DatePicker
          className="w-full"
          value={startDateVal}
          onChange={(val) => {
            setStartDateVal(val);
            setErrors((prev) => ({ ...prev, startDate: "" }));
          }}
        >
          <Label>Desde (Primera sesión)</Label>
          <DateField.Group>
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
            <Calendar aria-label="Start date">
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
          {errors.startDate && <FieldError>{errors.startDate}</FieldError>}
        </DatePicker>

        <DatePicker
          className="w-full"
          value={untilDateVal}
          onChange={(val) => {
            setUntilDateVal(val);
            setErrors((prev) => ({ ...prev, untilDate: "" }));
          }}
        >
          <Label>Hasta (Límite de recurrencia)</Label>
          <DateField.Group>
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
            <Calendar aria-label="End date">
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
          {errors.untilDate && <FieldError>{errors.untilDate}</FieldError>}
        </DatePicker>
      </div>

      <div className="flex gap-4">
        <TimeField
          className="w-full"
          value={startTimeVal}
          onChange={(val) => {
            setStartTimeVal(val);
            setErrors((prev) => ({ ...prev, startTime: "" }));
          }}
        >
          <Label>Hora de Inicio</Label>
          <TimeField.Group>
            <TimeField.Prefix>
              <HugeiconsIcon
                icon={Clock01Icon}
                className="h-4 w-4 text-muted"
              />
            </TimeField.Prefix>
            <TimeField.Input>
              {(segment) => <TimeField.Segment segment={segment} />}
            </TimeField.Input>
          </TimeField.Group>
          {errors.startTime && <FieldError>{errors.startTime}</FieldError>}
        </TimeField>

        <TextField
          isRequired
          className="w-full"
          isInvalid={!!errors.durationMin}
        >
          <Label>Duración (Minutos)</Label>
          <Input
            type="number"
            variant="secondary"
            value={String(formData.durationMin || "")}
            onChange={(e) =>
              handleChange("durationMin", Number(e.target.value))
            }
          />
          <FieldError
            children={errors.durationMin && <> {errors.durationMin}</>}
          />
        </TextField>
      </div>

      <div className="flex flex-col gap-2">
        <CheckboxGroup
          variant="secondary"
          value={formData.days || []}
          onChange={(val) => handleChange("days", val)}
        >
          <Label>Días de la semana</Label>
          <div className="flex flex-wrap gap-4 mt-2">
            {[
              { id: "MO", label: "Lunes" },
              { id: "TU", label: "Martes" },
              { id: "WE", label: "Miércoles" },
              { id: "TH", label: "Jueves" },
              { id: "FR", label: "Viernes" },
              { id: "SA", label: "Sábado" },
              { id: "SU", label: "Domingo" },
            ].map((day) => (
              <Checkbox key={day.id} value={day.id}>
                <Checkbox.Content>
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Label>{day.label}</Label>
                </Checkbox.Content>
              </Checkbox>
            ))}
          </div>
        </CheckboxGroup>
        {errors.days && (
          <span className="text-red-500 text-sm">{errors.days}</span>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <Button variant="secondary" onPress={onCancel}>
            Cancelar
          </Button>
        )}
        <Button variant="primary" type="submit" isPending={isSubmitting}>
          Guardar Horario
        </Button>
      </div>
    </form>
  );
};
