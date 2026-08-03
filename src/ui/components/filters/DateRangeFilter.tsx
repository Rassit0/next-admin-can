"use client";

import type { DateValue } from "@internationalized/date";
import { DateRangePicker, Button, ButtonGroup, DateField, RangeCalendar } from "@heroui/react";
import { getLocalTimeZone, today, parseDate, startOfMonth, endOfMonth, startOfYear, endOfYear } from "@internationalized/date";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";

type DateRange = {
  start: DateValue;
  end: DateValue;
};

export function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const getInitialValue = () => {
    const tz = getLocalTimeZone();
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");
    
    if (startParam && endParam) {
      try {
        return {
          start: parseDate(startParam),
          end: parseDate(endParam)
        };
      } catch (e) {
        // Fallback si la fecha es inválida
      }
    }
    
    // Por defecto: Este mes
    const t = today(tz);
    return {
      start: startOfMonth(t),
      end: endOfMonth(t)
    };
  };

  const [value, setValue] = useState<DateRange | null>(getInitialValue());

  useEffect(() => {
    // Sincronizar URL cuando el valor cambia
    if (value && value.start && value.end) {
      const currentStart = searchParams.get("start");
      const currentEnd = searchParams.get("end");
      
      const newStart = value.start.toString();
      const newEnd = value.end.toString();
      
      if (currentStart !== newStart || currentEnd !== newEnd) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("start", newStart);
        params.set("end", newEnd);
        router.push(`${pathname}?${params.toString()}`);
      }
    }
  }, [value, pathname, router, searchParams]);

  const setToday = () => {
    const t = today(getLocalTimeZone());
    setValue({ start: t, end: t });
  };

  const setYesterday = () => {
    const y = today(getLocalTimeZone()).subtract({ days: 1 });
    setValue({ start: y, end: y });
  };

  const setThisMonth = () => {
    const t = today(getLocalTimeZone());
    setValue({ start: startOfMonth(t), end: endOfMonth(t) });
  };

  const setLastMonth = () => {
    const t = today(getLocalTimeZone()).subtract({ months: 1 });
    setValue({ start: startOfMonth(t), end: endOfMonth(t) });
  };

  const setLast6Months = () => {
    const t = today(getLocalTimeZone());
    setValue({ start: startOfMonth(t.subtract({ months: 5 })), end: endOfMonth(t) });
  };

  const setThisYear = () => {
    const t = today(getLocalTimeZone());
    setValue({ start: startOfYear(t), end: endOfYear(t) });
  };

  return (
    <div className="flex flex-col gap-4">
      <DateRangePicker endName="endDate" startName="startDate" value={value} onChange={setValue} aria-label="Filtrar por fechas">
        <DateField.Group>
          <DateField.Input slot="start">
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
          <DateRangePicker.RangeSeparator />
          <DateField.Input slot="end">
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
          <DateField.Suffix>
            <DateRangePicker.Trigger>
              <HugeiconsIcon icon={Calendar03Icon} size={16} className="text-default-400" />
            </DateRangePicker.Trigger>
          </DateField.Suffix>
        </DateField.Group>
        <DateRangePicker.Popover>
          <div className="flex flex-col">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 border-b border-default-100">
              <Button size="sm" variant="ghost" onPress={setToday}>Hoy</Button>
              <Button size="sm" variant="ghost" onPress={setYesterday}>Ayer</Button>
              <Button size="sm" variant="ghost" onPress={setThisMonth}>Este mes</Button>
              <Button size="sm" variant="ghost" onPress={setLastMonth}>Mes pasado</Button>
              <Button size="sm" variant="ghost" onPress={setLast6Months}>Últimos 6 meses</Button>
              <Button size="sm" variant="ghost" onPress={setThisYear}>Este año</Button>
            </div>
            <RangeCalendar aria-label="Fechas">
              <RangeCalendar.Header>
                <RangeCalendar.YearPickerTrigger>
                  <RangeCalendar.YearPickerTriggerHeading />
                  <RangeCalendar.YearPickerTriggerIndicator />
                </RangeCalendar.YearPickerTrigger>
                <RangeCalendar.NavButton slot="previous" aria-label="Mes anterior" />
                <RangeCalendar.NavButton slot="next" aria-label="Mes siguiente" />
              </RangeCalendar.Header>
              <RangeCalendar.Grid>
                <RangeCalendar.GridHeader>
                  {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
                </RangeCalendar.GridHeader>
                <RangeCalendar.GridBody>
                  {(date) => <RangeCalendar.Cell date={date} />}
                </RangeCalendar.GridBody>
              </RangeCalendar.Grid>
              <RangeCalendar.YearPickerGrid>
                <RangeCalendar.YearPickerGridBody>
                  {({year}) => <RangeCalendar.YearPickerCell year={year} />}
                </RangeCalendar.YearPickerGridBody>
              </RangeCalendar.YearPickerGrid>
            </RangeCalendar>
          </div>
        </DateRangePicker.Popover>
      </DateRangePicker>
    </div>
  );
}
