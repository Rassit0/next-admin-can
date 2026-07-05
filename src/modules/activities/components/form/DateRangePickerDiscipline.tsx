"use client";
import type { TimeValue } from "@heroui/react";
import type { DateValue } from "@internationalized/date";

import {
  DateField,
  DateRangePicker,
  FieldError,
  Label,
  ListBox,
  RangeCalendar,
  Select,
  Separator,
  Switch,
  TimeField,
  useLocale,
} from "@heroui/react";
import {
  DateFormatter,
  getLocalTimeZone,
  parseAbsolute,
  parseDate,
  parseZonedDateTime,
} from "@internationalized/date";
import { useEffect, useMemo, useState } from "react";

type Granularity = "day" | "hour" | "minute" | "second";
type HourCycle = 12 | 24;
type DateRange = {
  start: DateValue;
  end: DateValue;
};

const granularityOptions: { label: string; value: Granularity }[] = [
  { label: "Día", value: "day" },
  { label: "Hora", value: "hour" },
  { label: "Minuto", value: "minute" },
  { label: "Segundo", value: "second" },
];

const hourCycleOptions: { label: string; value: HourCycle }[] = [
  { label: "12 horas", value: 12 },
  { label: "24 horas", value: 24 },
];

interface Props {
  rangeDate: {
    startDate: Date;
    endDate: Date;
  } | null;
  setRangeDate: (
    rangeDate: {
      startDate: Date;
      endDate: Date;
    } | null,
  ) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  handleRemoveError: (fieldName: string) => void;
}
export const DateRangePickerDiscipline = ({
  rangeDate,
  setRangeDate,
  errors,
  setErrors,
  handleRemoveError,
}: Props) => {
  const [mounted, setMounted] = useState(false);
  const initialGranularity = useMemo(() => {
    if (!rangeDate) return "day";

    const { startDate, endDate } = rangeDate;

    // Verificamos si alguna fecha tiene horas, minutos o segundos fuera de cero
    const hasTime =
      startDate.getHours() !== 0 ||
      startDate.getMinutes() !== 0 ||
      startDate.getSeconds() !== 0 ||
      endDate.getHours() !== 0 ||
      endDate.getMinutes() !== 0 ||
      endDate.getSeconds() !== 0;

    return hasTime ? "minute" : "day";
  }, [rangeDate]);
  const [granularity, setGranularity] =
    useState<Granularity>(initialGranularity);
  const [hourCycle, setHourCycle] = useState<HourCycle>(12);
  const [shouldForceLeadingZeros, setShouldForceLeadingZeros] = useState(false);
  const { locale } = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  const dateFormatter = new DateFormatter(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formatDate = (date: DateRange) => {
    const localTimeZone = getLocalTimeZone();
    const start = date.start.toDate(localTimeZone);
    const end = date.end.toDate(localTimeZone);

    return dateFormatter.formatRange(start, end);
  };

  // Si no ha montado, renderizamos un placeholder o nada para evitar el mismatch
  if (!mounted) {
    return (
      <div className="flex w-full h-12 animate-pulse bg-gray-100 rounded-md" />
    );
  }
  const timeGranularity = granularity !== "day" ? granularity : undefined;
  const showTimeField = !!timeGranularity;

  return (
    <div className="flex w-full flex-col gap-2">
      <DateRangePicker
        isRequired
        key={granularity}
        className="w-full"
        // defaultValue={defaultValue}
        endName="endDate"
        granularity={granularity}
        hourCycle={24}
        shouldForceLeadingZeros={false}
        startName="startDate"
        value={
          rangeDate
            ? {
                start: parseAbsolute(
                  rangeDate.startDate.toISOString(),
                  getLocalTimeZone(),
                ),
                end: parseAbsolute(
                  rangeDate.endDate.toISOString(),
                  getLocalTimeZone(),
                ),
              }
            : null
        }
        onChange={(v) => {
          setRangeDate(
            v
              ? {
                  startDate: v.start.toDate(),
                  endDate: v.end.toDate(),
                }
              : null,
          );
        }}
      >
        {({ state }) => (
          <>
            <Label>Rango de fechas</Label>
            <DateField.Group variant="secondary">
              <DateField.InputContainer>
                <DateField.Input slot="start">
                  {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
                <DateRangePicker.RangeSeparator />
                <DateField.Input slot="end">
                  {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
              </DateField.InputContainer>
              <DateField.Suffix>
                <DateRangePicker.Trigger>
                  <DateRangePicker.TriggerIndicator />
                </DateRangePicker.Trigger>
              </DateField.Suffix>
            </DateField.Group>
            <FieldError />
            <DateRangePicker.Popover className="flex w-full max-w-md flex-col gap-3">
              <RangeCalendar aria-label="Trip dates" className="w-full">
                <RangeCalendar.Header>
                  <RangeCalendar.YearPickerTrigger>
                    <RangeCalendar.YearPickerTriggerHeading />
                    <RangeCalendar.YearPickerTriggerIndicator />
                  </RangeCalendar.YearPickerTrigger>
                  <RangeCalendar.NavButton slot="previous" />
                  <RangeCalendar.NavButton slot="next" />
                </RangeCalendar.Header>
                <RangeCalendar.Grid>
                  <RangeCalendar.GridHeader>
                    {(day) => (
                      <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
                    )}
                  </RangeCalendar.GridHeader>
                  <RangeCalendar.GridBody>
                    {(date) => <RangeCalendar.Cell date={date} />}
                  </RangeCalendar.GridBody>
                </RangeCalendar.Grid>
                <RangeCalendar.YearPickerGrid>
                  <RangeCalendar.YearPickerGridBody>
                    {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
                  </RangeCalendar.YearPickerGridBody>
                </RangeCalendar.YearPickerGrid>
              </RangeCalendar>
              {!!showTimeField && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Label>Hora de inicio</Label>
                    <TimeField
                      aria-label="Hora de inicio"
                      granularity={timeGranularity}
                      hideTimeZone={true}
                      hourCycle={24}
                      name="startTime"
                      shouldForceLeadingZeros={false}
                      value={state.timeRange?.start ?? null}
                      onChange={(v) =>
                        state.setTimeRange({
                          end: state.timeRange?.end as TimeValue,
                          start: v as TimeValue,
                        })
                      }
                    >
                      <TimeField.Group variant="secondary">
                        <TimeField.Input>
                          {(segment) => <TimeField.Segment segment={segment} />}
                        </TimeField.Input>
                      </TimeField.Group>
                    </TimeField>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Hora de finalización</Label>
                    <TimeField
                      aria-label="Hora de finalización"
                      granularity={timeGranularity}
                      hideTimeZone={true}
                      hourCycle={24}
                      name="endTime"
                      shouldForceLeadingZeros={false}
                      value={state.timeRange?.end ?? null}
                      onChange={(v) =>
                        state.setTimeRange({
                          end: v as TimeValue,
                          start: state.timeRange?.start as TimeValue,
                        })
                      }
                    >
                      <TimeField.Group variant="secondary">
                        <TimeField.Input>
                          {(segment) => <TimeField.Segment segment={segment} />}
                        </TimeField.Input>
                      </TimeField.Group>
                    </TimeField>
                  </div>
                </div>
              )}
              <span className="mt-1 text-xs text-muted">
                Rango de fechas:{" "}
                {state.value && state.value.start && state.value.end
                  ? formatDate({
                      end: state.value.end,
                      start: state.value.start,
                    })
                  : "No seleccionado"}
              </span>
            </DateRangePicker.Popover>
          </>
        )}
      </DateRangePicker>

      <Separator className="my-1" />

      <Label className="text-xs font-medium text-muted">
        Opciones de formato
      </Label>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <Select
            className="w-30"
            name="granularity"
            value={granularity}
            variant="secondary"
            onChange={(value) => setGranularity(value as Granularity)}
          >
            <Label>Granularidad</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {granularityOptions.map((option) => (
                  <ListBox.Item
                    key={option.value}
                    id={option.value}
                    textValue={option.label}
                  >
                    {option.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>
    </div>
  );
};
