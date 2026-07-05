import {
  Button,
  Card,
  Table,
  Select,
  ListBox,
  TimeField,
  cn,
  FieldError,
  ErrorMessage,
  DatePicker,
  Label,
  DateField,
  Calendar,
} from "@heroui/react";
import { Add01Icon, Clock01Icon, DeleteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Dispatch, memo, useCallback, useEffect, useState } from "react";
import {
  getLocalTimeZone,
  parseDate,
  Time,
  today,
} from "@internationalized/date";
import {
  ActivityType,
  AddScheduleProps,
  ILocationOptions,
} from "@/modules/activities";

interface Props {
  type: ActivityType;
  locations: ILocationOptions[];
  schedules: AddScheduleProps[];
  setSchedules: Dispatch<React.SetStateAction<AddScheduleProps[]>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}

const DAYS_LIST = [
  { id: 1, name: "Lunes" },
  { id: 2, name: "Martes" },
  { id: 3, name: "Miércoles" },
  { id: 4, name: "Jueves" },
  { id: 5, name: "Viernes" },
  { id: 6, name: "Sábado" },
  { id: 7, name: "Domingo" },
];

// Helper para convertir string "HH:mm" a objeto Time
const parseTimeToObject = (timeStr: string) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return new Time(hours, minutes);
};

const ScheduleRow = memo(
  ({
    type,
    locations,
    schedule,
    onUpdate,
    onRemove,
  }: {
    type: ActivityType;
    locations: ILocationOptions[];
    schedule: AddScheduleProps;
    onUpdate: (
      id: string | number,
      field: keyof AddScheduleProps,
      value: any,
    ) => void;
    onRemove: (id: string | number) => void;
  }) => {
    console.log(`Renderizando fila ${schedule.id}`);

    return (
      <Table.Row>
        <Table.Cell>
          {type === "EVENT" || type === "MATCH" ? (
            <DatePicker
              name="date"
              value={
                schedule.specificDate
                  ? parseDate(schedule.specificDate.toISOString().split("T")[0])
                  : null
              }
              onChange={(value) => {
                console.log(value ? value.toDate(getLocalTimeZone()) : null);
                onUpdate(
                  schedule.id,
                  "specificDate",
                  value ? value.toDate(getLocalTimeZone()) : null,
                );
              }}
            >
              <Label>Date</Label>
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
              </DatePicker.Popover>
            </DatePicker>
          ) : (
            <Select
              isRequired
              aria-label="Seleccionar día"
              className="w-full"
              placeholder="Día"
              value={
                schedule.dayOfWeek === null ? undefined : schedule.dayOfWeek
              }
              onChange={(value) => onUpdate(schedule.id, "dayOfWeek", value)}
            >
              <Select.Trigger className="bg-transparent border-none shadow-none">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover className="bg-background-tertiary">
                <ListBox items={DAYS_LIST}>
                  {(day) => (
                    <ListBox.Item key={day.id} id={day.id} textValue={day.name}>
                      {day.name}
                    </ListBox.Item>
                  )}
                </ListBox>
              </Select.Popover>
              <FieldError />
            </Select>
          )}
        </Table.Cell>

        <Table.Cell>
          <TimeField
            isRequired
            aria-label="Hora inicio"
            value={parseTimeToObject(schedule.startTime)}
            onChange={(val) =>
              onUpdate(
                schedule.id,
                "startTime",
                val?.toString().substring(0, 5) || "",
              )
            }
          >
            <TimeField.Group className="bg-transparent shadow-none border-none focus-within:ring-0">
              <TimeField.Prefix>
                <HugeiconsIcon icon={Clock01Icon} size={16} />
              </TimeField.Prefix>
              <TimeField.Input>
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.Input>
            </TimeField.Group>
            <FieldError />
          </TimeField>
        </Table.Cell>

        <Table.Cell>
          <TimeField
            isRequired
            aria-label="Hora fin"
            value={parseTimeToObject(schedule.endTime)}
            onChange={(val) =>
              onUpdate(
                schedule.id,
                "endTime",
                val?.toString().substring(0, 5) || "",
              )
            }
          >
            <TimeField.Group className="bg-transparent shadow-none border-none focus-within:ring-0">
              <TimeField.Prefix>
                <HugeiconsIcon icon={Clock01Icon} size={16} />
              </TimeField.Prefix>
              <TimeField.Input>
                {(segment) => <TimeField.Segment segment={segment} />}
              </TimeField.Input>
            </TimeField.Group>
            <FieldError />
          </TimeField>
        </Table.Cell>

        <Table.Cell>
          <Select
            isRequired
            aria-label="Seleccionar sede"
            className="w-full"
            placeholder="Sede"
            value={schedule.locationId === 0 ? undefined : schedule.locationId}
            onChange={(value) => onUpdate(schedule.id, "locationId", value)}
          >
            <Select.Trigger className="bg-transparent border-none shadow-none">
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className="bg-background-tertiary">
              {/* Aquí deberías usar tu lista de sedes real, uso DAYS_LIST de ejemplo */}
              <ListBox items={locations}>
                {(item) => (
                  <ListBox.Item
                    key={item.id}
                    id={item.id}
                    textValue={item.name}
                  >
                    {item.name}
                  </ListBox.Item>
                )}
              </ListBox>
            </Select.Popover>
            <FieldError />
          </Select>
        </Table.Cell>

        <Table.Cell>
          <Button
            isIconOnly
            variant="danger-soft"
            onPress={() => onRemove(schedule.id)}
          >
            <HugeiconsIcon icon={DeleteIcon} size={18} />
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  },
  (prev, next) => prev.schedule === next.schedule,
);

export const CardSchedules = ({
  type,
  schedules,
  setSchedules,
  locations,
  errors,
  handleRemoveError,
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const addSchedule = () => {
    handleRemoveError("schedules");
    setSchedules([
      ...schedules,
      {
        id: crypto.randomUUID(),
        specificDate: null,
        dayOfWeek: null,
        startTime: "08:00",
        endTime: "09:00",
        locationId: 0,
      },
    ]);
  };

  const updateSchedule = useCallback(
    (id: string | number, field: keyof AddScheduleProps, value: any) => {
      setSchedules((prevSchedules) => {
        // 1. Clonamos el array para asegurar inmutabilidad total
        const newSchedules = [...prevSchedules];

        // 2. Buscamos el índice exacto (el ID de crypto.randomUUID es string, compruébalo)
        const index = newSchedules.findIndex(
          (s) => String(s.id) === String(id),
        );

        // 3. Si no lo encuentra, no hacemos nada (evita borrar datos)
        if (index === -1) return prevSchedules;

        // 4. Actualizamos solo el campo necesario creando un nuevo objeto
        newSchedules[index] = {
          ...newSchedules[index],
          [field]: value,
        };

        return newSchedules;
      });
    },
    [setSchedules], // IMPORTANTE: Solo setSchedules aquí
  );

  const removeSchedule = useCallback(
    (id: string | number) => {
      // Usamos 'prev' para asegurar que filtramos sobre la lista real actual
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    },
    [setSchedules], // Eliminamos 'schedules' de las dependencias
  );

  if (!isMounted) return null;

  return (
    <Card className="p-8 border-l-4 border-accent">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <HugeiconsIcon
            className="text-accent"
            icon={Clock01Icon}
            strokeWidth={2}
          />
          <h2 className="text-xl font-bold">Programación Semanal</h2>
        </div>
        <Button variant="outline" onPress={addSchedule} className="gap-2">
          <HugeiconsIcon icon={Add01Icon} size={18} />
          Añadir Regla de Horario
        </Button>
      </div>

      <Table aria-label="Tabla de programación">
        <Table.ScrollContainer>
          <Table.Content className="min-w-175">
            <Table.Header>
              <Table.Column isRowHeader>Día de la semana</Table.Column>
              <Table.Column>Hora Inicio</Table.Column>
              <Table.Column>Hora Fin</Table.Column>
              <Table.Column>Instalación / Sede</Table.Column>
              <Table.Column width={50}></Table.Column>
            </Table.Header>
            <Table.Body items={schedules}>
              {(item) => (
                <ScheduleRow
                  key={item.id}
                  type={type}
                  locations={locations}
                  schedule={item}
                  onUpdate={updateSchedule}
                  onRemove={removeSchedule}
                />
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <ErrorMessage>{errors.schedules && <>{errors.schedules}</>}</ErrorMessage>

      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
          <span className="material-symbols-outlined text-sm">info</span>
          Las reservas de instalaciones se validarán al guardar la actividad.
        </div>
      </div>
    </Card>
  );
};
