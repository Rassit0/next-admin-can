"use client";
import { iconMap } from "@/utils/iconMap";
import {
  FieldError,
  Form,
  Input,
  Label,
  Surface,
  TextField,
  toast,
  ComboBox,
  ListBox,
  DateValue,
  DateField,
  DatePicker,
  Calendar,
  Button,
  TagGroup,
  Tag,
  Description,
  TextArea,
} from "@heroui/react";
import React, { useState } from "react";
import {
  getLocalTimeZone,
  parseAbsolute,
  parseDate,
} from "@internationalized/date";
import { addSeason, editSeason, ISeason } from "@/modules/seasons";
import clsx from "clsx";

interface Props {
  season?: ISeason;
  institutionId: string;
  disciplineId: string;
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormSeason = ({
  season,
  disciplineId,
  institutionId,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [name, setName] = useState(season?.name || null);
  const [description, setDescription] = useState(season?.description || null);
  const [startDate, setStartDate] = useState<DateValue | null>(
    season?.startDate
      ? parseDate(
          `${season.startDate.getFullYear()}-${(season.startDate.getMonth() + 1).toString().padStart(2, "0")}-${season.startDate.getDate().toString().padStart(2, "0")}`,
        )
      : null,
  );
  const [endDate, setEndDate] = useState<DateValue | null>(
    season?.endDate
      ? parseDate(
          `${season.endDate.getFullYear()}-${(season.endDate.getMonth() + 1).toString().padStart(2, "0")}-${season.endDate.getDate().toString().padStart(2, "0")}`,
        )
      : null,
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!name) {
      newErrors.name = "Debe ingresar un nombre";
    }
    if (!startDate) {
      newErrors.startDate = "Debe ingresar una fecha de inicio";
    }
    if (!endDate) {
      newErrors.endDate = "Debe ingresar una fecha de fin";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    let res;
    const data = {
      name: name!,
      description: description || undefined,
      startDate: startDate!.toDate(getLocalTimeZone()),
      endDate: endDate!.toDate(getLocalTimeZone()),
      institutionId,
      disciplineId,
    };
    if (season) {
      res = await editSeason({ id: season.id, data });
    } else {
      res = await addSeason(data);
    }
    setIsLoading?.(false);
    if (res.error) {
      let errorDescription = res.message;

      if (res.errors) {
        // Convertimos el objeto { type: ["msg"] } en una lista de strings limpia
        errorDescription = Object.entries(res.errors)
          .map(([field, messages]) => {
            const msgList = Array.isArray(messages)
              ? messages.join(", ")
              : messages;
            return `${field}: ${msgList}`;
          })
          .join("\n"); // Los separamos por saltos de línea para el toast
      }

      // 2. Pasamos la descripción formateada al componente de notificaciones
      toast.danger(res.message, {
        description: errorDescription,
      });
      if (res.errors) {
        setErrors(res.errors);
      }
      return;
    }
    toast.success(res.message, {
      description: res.message,
    });
    onSubmited?.();
  };
  return (
    <Surface variant="transparent">
      <Form id={formId} onSubmit={handleSubmit}>
        <div className="col-span-full flex flex-col gap-4">
          <TextField
            isRequired
            className="w-full"
            name="name"
            type="text"
            isInvalid={!!errors.name || undefined}
          >
            <Label>Nombre</Label>
            <Input
              variant="secondary"
              value={name || ""}
              onChange={(e) => {
                setName(e.target.value || null);
                setErrors({});
              }}
              placeholder="Ingrese el nombre de la temporada"
            />
            <FieldError children={errors.name && <> {errors.name}</>} />
          </TextField>

          <DatePicker
            isRequired
            isInvalid={!!errors.startDate || undefined}
            name="startDate"
            hideTimeZone
            value={startDate}
            onChange={setStartDate}
          >
            <Label>Fecha de inicio</Label>
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
            <FieldError
              children={errors.startDate && <> {errors.startDate}</>}
            />

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

          <DatePicker
            isRequired
            isInvalid={!!errors.startDate || undefined}
            name="endDate"
            value={endDate}
            onChange={setEndDate}
          >
            <Label>Fecha de fin</Label>
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
            <FieldError
              children={errors.startDate && <> {errors.startDate}</>}
            />

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

          <TextField
            className="w-full"
            name="description"
            isInvalid={!!errors.description || undefined}
          >
            <Label>Descripción</Label>
            <TextArea
              variant="secondary"
              placeholder="Ingrese la descripción de la temporada"
              rows={4}
              value={description || ""}
              onChange={(e) => {
                setDescription(e.target.value || null);
                setErrors({});
              }}
            />
            {/* <Description>Maximum 500 characters</Description> */}
            <FieldError
              children={errors.description && <> {errors.description}</>}
            />
          </TextField>
        </div>
      </Form>
    </Surface>
  );
};
