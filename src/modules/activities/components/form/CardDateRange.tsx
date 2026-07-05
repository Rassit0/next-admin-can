import {
  Calendar,
  Card,
  DateField,
  DatePicker,
  FieldError,
  Label,
  TimeField,
  TimeValue,
} from "@heroui/react";
import { Calendar04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Dispatch, SetStateAction } from "react";
import {
  DateFormatter,
  getLocalTimeZone,
  parseAbsolute,
  toCalendarDate,
} from "@internationalized/date";
import { ActivityType } from "@/modules/activities";

interface Props {
  activityType: ActivityType;
  startDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}
export const CardDateRange = ({
  activityType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <Card className="col-span-12 p-8 xl:col-span-6 bg-accent/10">
      <div className="flex items-center gap-4 mb-2">
        <HugeiconsIcon
          className="text-accent"
          icon={Calendar04Icon}
          strokeWidth={2}
        />
        <Card.Header>
          <Card.Title className="text-xl font-bold">Vigencia</Card.Title>
        </Card.Header>
      </div>
      <Card.Content>
        <DatePicker
          isRequired
          isInvalid={!!errors.startDate || undefined}
          granularity="minute"
          hourCycle={24}
          name="startDate"
          hideTimeZone
          value={
            startDate
              ? parseAbsolute(startDate.toISOString(), getLocalTimeZone())
              : null
          }
          onChange={(v) => {
            setStartDate(v?.toDate() || null);
            handleRemoveError("startDate");
          }}
        >
          {({ state }) => (
            <>
              <Label>Fecha de inicio</Label>
              <DateField.Group fullWidth>
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
                      {({ year }) => <Calendar.YearPickerCell year={year} />}
                    </Calendar.YearPickerGridBody>
                  </Calendar.YearPickerGrid>
                </Calendar>
                <div className="flex items-center justify-between">
                  <Label>Hora</Label>
                  <TimeField
                    aria-label="Time"
                    granularity="minute"
                    hideTimeZone
                    hourCycle={24}
                    name="time"
                    value={state.timeValue}
                    onChange={(v) => state.setTimeValue(v as TimeValue)}
                  >
                    <TimeField.Group variant="secondary">
                      <TimeField.Input>
                        {(segment) => <TimeField.Segment segment={segment} />}
                      </TimeField.Input>
                    </TimeField.Group>
                  </TimeField>
                </div>
              </DatePicker.Popover>
            </>
          )}
        </DatePicker>
        <DatePicker
          isRequired
          isInvalid={!!errors.endDate || undefined}
          name="endDate"
          granularity="minute"
          hourCycle={24}
          hideTimeZone
          value={
            endDate
              ? parseAbsolute(endDate.toISOString(), getLocalTimeZone())
              : null
          }
          onChange={(v) => {
            setEndDate(v?.toDate() || null);
            handleRemoveError("endDate");
          }}
        >
          {({ state }) => (
            <>
              <Label>Fecha de fin</Label>
              <DateField.Group fullWidth>
                <DateField.Input>
                  {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>
                <DateField.Suffix>
                  <DatePicker.Trigger>
                    <DatePicker.TriggerIndicator />
                  </DatePicker.Trigger>
                </DateField.Suffix>
              </DateField.Group>
              <FieldError children={errors.endDate && <> {errors.endDate}</>} />
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
                      {({ year }) => <Calendar.YearPickerCell year={year} />}
                    </Calendar.YearPickerGridBody>
                  </Calendar.YearPickerGrid>
                </Calendar>
                <div className="flex items-center justify-between">
                  <Label>Hora</Label>
                  <TimeField
                    aria-label="Time"
                    granularity="minute"
                    hideTimeZone
                    hourCycle={24}
                    name="time"
                    value={state.timeValue}
                    onChange={(v) => state.setTimeValue(v as TimeValue)}
                  >
                    <TimeField.Group variant="secondary">
                      <TimeField.Input>
                        {(segment) => <TimeField.Segment segment={segment} />}
                      </TimeField.Input>
                    </TimeField.Group>
                  </TimeField>
                </div>
              </DatePicker.Popover>
            </>
          )}
        </DatePicker>
      </Card.Content>
    </Card>
  );
};
