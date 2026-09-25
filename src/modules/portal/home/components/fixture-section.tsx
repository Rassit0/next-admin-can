"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PublicFixture } from "../actions/fixture.action";
import { NextMatchCountdown } from "./next-match-countdown";
import { useState, useMemo, useEffect, useRef } from "react";
import { DateRangePicker, DateField, RangeCalendar } from "@heroui/react";
import { getPublicFixture } from "../actions/fixture.action";
import {
  getLocalTimeZone,
  today,
  type DateValue,
} from "@internationalized/date";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";

const getInitials = (name: string) => {
  const words = name.trim().split(" ").filter(Boolean);
  if (words.length >= 3) {
    return (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
  }
  if (words.length === 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 3).toUpperCase();
};

function FixtureCard({
  fixture,
  showDiscipline,
  idx,
}: {
  fixture: PublicFixture;
  showDiscipline: boolean;
  idx: number;
}) {
  const fixtureDate = new Date(fixture.date);

  // Date and time safe
  const dateString = fixtureDate
    .toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();

  const timeString = fixtureDate.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.5 }}
      className="rounded-lg border border-border/50 bg-white shadow-sm backdrop-blur-xs flex flex-col relative overflow-hidden"
    >
      {/* Header: Fecha y Hora */}
      <div className="bg-muted/30 border-b border-border/50 py-2 px-4 flex justify-between items-center">
        <span className="text-xs font-700 tracking-wider text-muted-foreground">
          {dateString}
        </span>
        <span className="text-sm font-800 text-primary">{timeString}</span>
      </div>

      <div className="flex items-center justify-between gap-2 px-4 py-6 relative z-10">
        {/* Home Team */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white p-2 shadow-sm border border-border/40">
            {fixture.homeTeam.imageUrl ? (
              <Image
                src={fixture.homeTeam.imageUrl}
                alt={fixture.homeTeam.name}
                fill
                className="object-contain p-1"
              />
            ) : (
              <span className="font-heading text-xl font-bold uppercase text-primary/70">
                {getInitials(fixture.homeTeam.name)}
              </span>
            )}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-center font-heading text-sm font-700 uppercase text-primary leading-tight">
              {fixture.homeTeam.name}
            </span>
            {fixture.homeCategoryName && (
              <span className="text-[10px] font-600 uppercase text-muted-foreground tracking-wider mt-0.5">
                {fixture.homeCategoryName}
              </span>
            )}
          </div>
        </div>

        {/* VS or Score */}
        <div className="flex flex-col items-center justify-center px-2">
          <div className="flex items-center justify-center rounded-lg bg-primary/5 px-4 py-2 font-heading text-2xl font-700 text-primary">
            {fixture.status === "PLAYED" ? (
              <span className="tracking-widest flex items-center gap-1">
                <span>
                  {fixture.homeScore !== null ? fixture.homeScore : "-"}
                </span>
                <span className="text-muted-foreground text-sm font-400 mx-1">
                  -
                </span>
                <span>
                  {fixture.awayScore !== null ? fixture.awayScore : "-"}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground text-xl">Vs</span>
            )}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white p-2 shadow-sm border border-border/40">
            {fixture.awayTeam.imageUrl ? (
              <Image
                src={fixture.awayTeam.imageUrl}
                alt={fixture.awayTeam.name}
                fill
                className="object-contain p-1"
              />
            ) : (
              <span className="font-heading text-xl font-bold uppercase text-primary/70">
                {getInitials(fixture.awayTeam.name)}
              </span>
            )}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-center font-heading text-sm font-700 uppercase text-primary leading-tight">
              {fixture.awayTeam.name}
            </span>
            {fixture.awayCategoryName && (
              <span className="text-[10px] font-600 uppercase text-muted-foreground tracking-wider mt-0.5">
                {fixture.awayCategoryName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Metadata Opcional */}
      {fixture.locationName && (
        <div className="bg-primary/5 border-t border-border/40 py-2 px-4 text-center">
          <span className="text-xs font-600 uppercase tracking-wide text-primary/70">
            {fixture.locationName}
          </span>
        </div>
      )}

      {/* Conditional Discipline Badge */}
      {showDiscipline && (
        <div className="absolute top-0 right-0 bg-primary px-2 py-0.5 rounded-bl-lg shadow-sm">
          <span className="font-heading text-[9px] font-700 uppercase tracking-widest text-white">
            {fixture.discipline}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function FixtureGroup({
  discipline,
  title,
  colorClass,
  fixtures,
  showDiscipline,
}: {
  discipline: string;
  title: string;
  colorClass: string;
  fixtures: PublicFixture[];
  showDiscipline: boolean;
}) {
  const filteredFixtures = fixtures.filter((f) => f.discipline === discipline);

  if (filteredFixtures.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`rounded-t-2xl py-3 px-6 text-center font-heading text-2xl font-700 uppercase tracking-wide text-white shadow-md ${colorClass}`}
      >
        Fixture {title}
      </div>

      <div className="flex flex-col gap-4">
        {filteredFixtures.map((fixture, idx) => (
          <FixtureCard
            key={fixture.id}
            fixture={fixture}
            showDiscipline={showDiscipline}
            idx={idx}
          />
        ))}
      </div>
    </div>
  );
}

type TemporalFilter = "TODOS" | "PROXIMOS" | "JUGADOS";

export function FixtureSection({
  initialFixtures = [],
}: {
  initialFixtures?: PublicFixture[];
}) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [selectedTemporal, setSelectedTemporal] =
    useState<TemporalFilter>("TODOS");
  const [dateRange, setDateRange] = useState<{
    start: DateValue;
    end: DateValue;
  } | null>(null);

  const [rangeInitialized, setRangeInitialized] = useState(false);
  const [fixtures, setFixtures] = useState<PublicFixture[]>(initialFixtures);
  const [isLoading, setIsLoading] = useState(false);
  const activeRequestRef = useRef<number>(0);
  const requestCounterRef = useRef<number>(0);

  useEffect(() => {
    try {
      const tz = getLocalTimeZone();
      const t = today(tz);
      setDateRange({ start: t, end: t });
    } catch {
      // Ignored
    }
  }, []);

  useEffect(() => {
    if (!rangeInitialized && !dateRange) {
      return;
    }

    let tz = "UTC";
    try {
      tz = getLocalTimeZone();
    } catch {
      // Ignored
    }

    const currentRequestId = ++requestCounterRef.current;
    activeRequestRef.current = currentRequestId;

    const fetchFixtures = async () => {
      setIsLoading(true);

      let from: string | undefined = undefined;
      let to: string | undefined = undefined;

      if (dateRange && dateRange.start && dateRange.end) {
        from = dateRange.start.toDate(tz).toISOString();
        to = dateRange.end.add({ days: 1 }).toDate(tz).toISOString();
      }

      try {
        const res = await getPublicFixture(
          from && to ? { from, to } : undefined,
        );

        if (activeRequestRef.current === currentRequestId) {
          if (!res.error && res.data) {
            setFixtures(res.data);
          }
          setIsLoading(false);
          if (!rangeInitialized) setRangeInitialized(true);
        }
      } catch (error) {
        if (activeRequestRef.current === currentRequestId) {
          setIsLoading(false);
          if (!rangeInitialized) setRangeInitialized(true);
        }
      }
    };

    fetchFixtures();
  }, [dateRange]);

  // Derivar disciplinas únicas
  const derivedDisciplines = useMemo(
    () =>
      Array.from(new Set(fixtures.map((f) => f.discipline).filter(Boolean))),
    [fixtures],
  );

  useEffect(() => {
    if (
      selectedDiscipline !== "all" &&
      !derivedDisciplines.includes(selectedDiscipline)
    ) {
      setSelectedDiscipline("all");
    }
  }, [derivedDisciplines, selectedDiscipline]);

  // Filtrado 3D: Disciplina + Fecha + Estado
  const visibleFixtures = useMemo(() => {
    const now = new Date();
    let matches = fixtures;

    // 1. Filtro Disciplina
    if (selectedDiscipline !== "all") {
      matches = matches.filter((f) => f.discipline === selectedDiscipline);
    }

    // 2. Filtro Rango de Fechas (Delegado al backend, aquí no filtramos fechas ya que vienen pre-filtradas del Server Action)

    // 3. Filtro Estado
    matches = matches.filter((match) => {
      const matchDate = new Date(match.date);
      switch (selectedTemporal) {
        case "PROXIMOS":
          return (
            match.status === "PENDING" && matchDate.getTime() >= now.getTime()
          );
        case "JUGADOS":
          return match.status === "PLAYED";
        case "TODOS":
        default:
          return true;
      }
    });

    // 4. Ordenamiento
    return [...matches].sort((a, b) => {
      if (selectedTemporal === "JUGADOS") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [fixtures, selectedDiscipline, selectedTemporal]);

  // Next match for countdown (always the nearest pending future match globally or within discipline)
  // Preservamos el comportamiento previo
  const nextMatch = useMemo(() => {
    const now = Date.now();
    let candidates = initialFixtures.filter(
      (match) =>
        match.status === "PENDING" && new Date(match.date).getTime() > now,
    );
    if (selectedDiscipline !== "all") {
      candidates = candidates.filter(
        (m) => m.discipline === selectedDiscipline,
      );
    }
    return (
      candidates.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      )[0] || null
    );
  }, [initialFixtures, selectedDiscipline]);

  const activeDisciplines =
    selectedDiscipline === "all" ? derivedDisciplines : [selectedDiscipline];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-end">
        <div className="flex flex-col items-center lg:items-start gap-4">
          <h2 className="font-heading text-4xl font-700 uppercase tracking-tight text-primary sm:text-5xl">
            Fixture
          </h2>

          {/* Tabs de Disciplinas */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <button
              onClick={() => setSelectedDiscipline("all")}
              className={`rounded-full px-5 py-1.5 text-xs font-700 uppercase tracking-wider transition-colors ${
                selectedDiscipline === "all"
                  ? "bg-neon text-primary shadow-md"
                  : "bg-primary/5 text-primary hover:bg-primary/10"
              }`}
            >
              Todas
            </button>
            {derivedDisciplines.map((disc) => (
              <button
                key={disc}
                onClick={() => setSelectedDiscipline(disc)}
                className={`rounded-full px-5 py-1.5 text-xs font-700 uppercase tracking-wider transition-colors ${
                  selectedDiscipline === disc
                    ? "bg-neon text-primary shadow-md"
                    : "bg-primary/5 text-primary hover:bg-primary/10"
                }`}
              >
                {disc}
              </button>
            ))}
          </div>
        </div>

        {/* Controles de Filtro: Fechas y Estado */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* HeroUI DateRangePicker */}
          <div className="w-full sm:w-auto min-w-70">
            <DateRangePicker
              aria-label="Rango de Fechas"
              value={dateRange}
              onChange={setDateRange}
              isDisabled={isLoading}
              className="border border-border/50 shadow-inner rounded-xl h-10"
            >
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
                    <HugeiconsIcon
                      icon={Calendar03Icon}
                      size={16}
                      className="text-default-400"
                    />
                  </DateRangePicker.Trigger>
                </DateField.Suffix>
              </DateField.Group>
              <DateRangePicker.Popover>
                <RangeCalendar aria-label="Rango de fechas">
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
                        <RangeCalendar.HeaderCell>
                          {day}
                        </RangeCalendar.HeaderCell>
                      )}
                    </RangeCalendar.GridHeader>
                    <RangeCalendar.GridBody>
                      {(date) => <RangeCalendar.Cell date={date} />}
                    </RangeCalendar.GridBody>
                  </RangeCalendar.Grid>
                  <RangeCalendar.YearPickerGrid>
                    <RangeCalendar.YearPickerGridBody>
                      {({ year }) => (
                        <RangeCalendar.YearPickerCell year={year} />
                      )}
                    </RangeCalendar.YearPickerGridBody>
                  </RangeCalendar.YearPickerGrid>
                </RangeCalendar>
              </DateRangePicker.Popover>
            </DateRangePicker>
          </div>

          {/* Estado Temporales */}
          <div className="flex bg-muted/30 p-1 rounded-xl shadow-inner border border-border/50 overflow-x-auto w-full sm:w-auto justify-center">
            {(["TODOS", "PROXIMOS", "JUGADOS"] as TemporalFilter[]).map(
              (filter) => {
                return (
                  <button
                    key={filter}
                    onClick={() => setSelectedTemporal(filter)}
                    className={`shrink-0 px-4 py-1.5 rounded-lg text-xs font-700 uppercase tracking-wide transition-all ${
                      selectedTemporal === filter
                        ? "bg-white text-primary shadow-sm"
                        : "text-muted-foreground hover:text-primary hover:bg-white/50"
                    }`}
                  >
                    {filter === "TODOS"
                      ? "Todos"
                      : filter === "PROXIMOS"
                        ? "Próximos"
                        : "Jugados"}
                  </button>
                );
              },
            )}
          </div>
        </div>
      </div>

      {nextMatch && <NextMatchCountdown match={nextMatch} />}

      {isLoading || !rangeInitialized ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : visibleFixtures.length > 0 ? (
        <div
          className={
            activeDisciplines.length === 1
              ? "mx-auto w-full max-w-2xl"
              : "grid grid-cols-1 gap-10 lg:grid-cols-2"
          }
        >
          {activeDisciplines.map((discipline, index) => (
            <FixtureGroup
              key={discipline}
              discipline={discipline}
              title={discipline}
              colorClass={
                index % 2 === 0
                  ? "bg-neon text-primary"
                  : "bg-primary text-white"
              }
              fixtures={visibleFixtures}
              showDiscipline={selectedDiscipline === "all"}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/50 p-8 text-center">
          <p className="font-heading text-xl font-semibold text-muted-foreground uppercase">
            No hay partidos para los filtros seleccionados
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Intenta cambiar la fecha, disciplina o el estado del partido.
          </p>
        </div>
      )}
    </section>
  );
}
