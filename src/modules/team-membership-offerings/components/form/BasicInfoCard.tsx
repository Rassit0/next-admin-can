import {
  Calendar,
  Card,
  DateField,
  DatePicker,
  TextField,
} from "@heroui/react";
import { Calendar04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ComboBox, Input, ListBox, Label, FieldError } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";
import { AddModal } from "@/modules/seasons";
import { DateValue } from "@internationalized/date";

interface Props {
  name: string | null;
  setName: Dispatch<SetStateAction<string | null>>;
  startDate: DateValue | null;
  setStartDate: Dispatch<SetStateAction<DateValue | null>>;
  endDate: DateValue | null;
  setEndDate: Dispatch<SetStateAction<DateValue | null>>;
  maxYear: number | null;
  setMaxYearId: Dispatch<SetStateAction<number | null>>;
  minYear: number | null;
  setMinYearId: Dispatch<SetStateAction<number | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}

export const BasicInfoCard = ({
  name,
  setName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  maxYear,
  setMaxYearId,
  minYear,
  setMinYearId,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <Card className="p-8 shadow-[0px_12px_32px_rgba(25,28,29,0.06)]  border border-l-4 border-l-accent">
      <Card.Header className="flex flex-row items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
          <HugeiconsIcon icon={Calendar04Icon} className="text-accent" />
        </div>
        <Card.Title className="font-headline font-bold text-lg">
          Información Básica
        </Card.Title>
      </Card.Header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* <div className="col-span-full flex items-end gap-2">
          <ComboBox
            variant="secondary"
            isRequired
            className="w-full"
            name="seasonId"
            value={seasonId}
            onChange={(key) => {
              setSeasonId(key?.toString() || "");
              handleRemoveError("seasonId");
            }}
          >
            <Label>Temporada</Label>
            <ComboBox.InputGroup>
              <Input placeholder="Buscar temporada..." />
              <ComboBox.Trigger />
            </ComboBox.InputGroup>
            <ComboBox.Popover>
              <ListBox>
                {seasonsOptions.map((season) => (
                  <ListBox.Item
                    key={season.id}
                    id={season.id}
                    textValue={season.name}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{season.name}</span>
                      <span className="text-xs text-muted">
                        {season.startDate.toLocaleDateString()} -{" "}
                        {season.endDate.toLocaleDateString()}
                      </span>
                    </div>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </ComboBox.Popover>
            <FieldError children={errors.name && <> {errors.name}</>} />
          </ComboBox>
          <AddModal isIcon />
        </div> */}
        <TextField
          isRequired
          className="w-full col-span-full"
          name="name"
          type="text"
          isInvalid={!!errors.name || undefined}
        >
          <Label>Nombre</Label>
          <Input
            variant="secondary"
            placeholder="Ej: Campeonato Apertura 2026"
            type="text"
            value={name || ""}
            onChange={(e) => {
              setName(e.target.value);
              handleRemoveError("name");
            }}
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
          <FieldError children={errors.startDate && <> {errors.startDate}</>} />

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
          <FieldError children={errors.startDate && <> {errors.startDate}</>} />

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
          isRequired
          className="w-full"
          name="maxYear"
          type="text"
          isInvalid={!!errors.maxYear || undefined}
        >
          <Label>Edad Max.</Label>
          <Input
            variant="secondary"
            min={2}
            placeholder="12"
            type="number"
            value={maxYear || ""}
            onChange={(e) => {
              setMaxYearId(Number(e.target.value));
              handleRemoveError("maxYear");
            }}
          />
          <FieldError children={errors.maxYear && <> {errors.maxYear}</>} />
        </TextField>
        <TextField
          isRequired
          className="w-full"
          name="minYear"
          type="text"
          isInvalid={!!errors.minYear || undefined}
        >
          <Label>Edad Min.</Label>
          <Input
            variant="secondary"
            min={2}
            placeholder="12"
            type="number"
            value={minYear || ""}
            onChange={(e) => {
              setMinYearId(Number(e.target.value));
              handleRemoveError("minYear");
            }}
          />
          <FieldError children={errors.minYear && <> {errors.minYear}</>} />
        </TextField>
      </div>
    </Card>
  );
};
