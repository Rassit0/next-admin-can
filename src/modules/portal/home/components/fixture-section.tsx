"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { PublicFixture } from "../actions/fixture.action";
import { NextMatchCountdown } from "./next-match-countdown";
import { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  DateRangePicker,
  DateField,
  RangeCalendar,
  Modal,
  useOverlayState,
  Button,
} from "@heroui/react";
import { getPublicFixture } from "../actions/fixture.action";
import {
  getLocalTimeZone,
  today,
  parseDate,
  type DateValue,
} from "@internationalized/date";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Location01Icon,
  Navigation02Icon,
} from "@hugeicons/core-free-icons";

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

function LocationMapTrigger({
  location,
}: {
  location: NonNullable<PublicFixture["location"]>;
}) {
  const state = useOverlayState();

  const hasCoordinates =
    location.latitude !== null && location.longitude !== null;
  const externalLink =
    location.mapsUrl ||
    (hasCoordinates
      ? `https://maps.google.com/?q=${location.latitude},${location.longitude}`
      : null);

  return (
    <div className="flex flex-row items-center justify-between w-full">
      {hasCoordinates ? (
        <button
          type="button"
          onClick={state.open}
          className="text-xs font-600 uppercase tracking-wide text-primary/70 flex items-center gap-1.5 line-clamp-1 hover:text-primary hover:underline transition-colors text-left"
          title="Ver mapa en el portal"
        >
          <HugeiconsIcon icon={Location01Icon} size={14} className="shrink-0" />
          {location.name}
        </button>
      ) : (
        <span className="text-xs font-600 uppercase tracking-wide text-primary/70 flex items-center gap-1.5 line-clamp-1">
          <HugeiconsIcon icon={Location01Icon} size={14} className="shrink-0" />
          {location.name}
        </span>
      )}

      {externalLink && (
        <a
          href={externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center p-1.5 text-primary/70 hover:text-primary hover:bg-primary/10 rounded-md transition-colors shrink-0"
          title="Abrir ubicación en Google Maps"
          aria-label="Abrir ubicación en Google Maps"
        >
          <HugeiconsIcon icon={Navigation02Icon} size={16} />
        </a>
      )}

      {hasCoordinates && (
        <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
          <Modal.Container placement="center">
            <Modal.Dialog className="sm:max-w-2xl bg-white p-0 overflow-hidden">
              <Modal.CloseTrigger className="absolute top-2 right-2 z-50 bg-white/50 backdrop-blur-md hover:bg-white rounded-full p-1" />
              <Modal.Header className="pt-6 px-6 pb-2 border-b border-border/50">
                <Modal.Heading className="font-heading text-lg font-bold text-primary uppercase flex items-center gap-2">
                  <HugeiconsIcon icon={Location01Icon} />
                  {location.name}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="p-0">
                <div className="w-full aspect-video md:aspect-21/9 bg-muted/20 relative">
                  <iframe
                    title={`Mapa de ${location.name}`}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&hl=es&z=16&output=embed`}
                    allowFullScreen
                  />
                </div>
              </Modal.Body>
              {externalLink && (
                <Modal.Footer className="bg-muted/10 px-6 py-4 border-t border-border/50">
                  <a
                    href={externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      variant="primary"
                      className="w-full font-bold uppercase tracking-wider gap-2"
                    >
                      {location.mapsUrl
                        ? "Abrir en Google Maps"
                        : "Abrir ubicación"}
                      <HugeiconsIcon icon={Navigation02Icon} size={16} />
                    </Button>
                  </a>
                </Modal.Footer>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      )}
    </div>
  );
}

function FixtureCard({
  fixture,
  showDiscipline,
  idx,
}: {
  fixture: PublicFixture;
  showDiscipline: boolean;
  idx: number;
}) {
  const [showPartials, setShowPartials] = useState(false);
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
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
      className="group rounded-xl border border-border/50 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
    >
      {/* Header: Fecha, Hora y Disciplina */}
      <div className="bg-muted/20 border-b border-border/50 py-2.5 px-4 flex justify-between items-center flex-wrap gap-2">
        <span className="text-[11px] font-700 tracking-wider text-muted-foreground flex items-center gap-1.5">
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={14}
            className="opacity-70"
          />
          {dateString}{" "}
          <span className="mx-0.5 font-bold text-primary/30">·</span>{" "}
          {timeString}
        </span>
        {showDiscipline && (
          <span className="bg-primary/5 text-primary px-2.5 py-0.5 rounded-full font-heading text-[10px] font-700 uppercase tracking-widest border border-primary/10">
            {fixture.discipline}
          </span>
        )}
      </div>

      <div className="mx-auto w-full max-w-3xl flex items-center justify-between gap-2 px-4 py-6 relative z-10">
        {/* Home Team */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white p-2 shadow-sm border border-border/40 group-hover:scale-[1.03] transition-transform duration-300">
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
            <span className="text-center font-heading text-sm font-700 uppercase text-primary leading-tight line-clamp-2">
              {fixture.homeTeam.name}
            </span>
            {fixture.homeCategoryName && (
              <span className="text-[10px] font-600 uppercase text-muted-foreground tracking-wider mt-1 bg-muted/50 px-2 py-0.5 rounded-md">
                {fixture.homeCategoryName}
              </span>
            )}
          </div>
        </div>

        {/* VS or Score */}
        <div className="flex flex-col items-center justify-center px-2 shrink-0">
          {fixture.status === "PLAYED" ? (
            <div className="flex items-center justify-center rounded-xl bg-primary/5 px-4 py-2 font-heading text-3xl font-900 text-primary tracking-tighter tabular-nums border border-primary/10 shadow-inner">
              <span className="flex items-center gap-1.5">
                <span>
                  {fixture.homeScore !== null ? fixture.homeScore : "-"}
                </span>
                <span className="text-muted-foreground/40 text-xl font-400 mx-1">
                  -
                </span>
                <span>
                  {fixture.awayScore !== null ? fixture.awayScore : "-"}
                </span>
              </span>
            </div>
          ) : (
            <div className="relative flex items-center justify-center rounded-full bg-primary/5 px-3 py-1.5 font-heading text-sm font-800 text-primary/60 border border-primary/10 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              <span className="relative z-10 tracking-widest">VS</span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white p-2 shadow-sm border border-border/40 group-hover:scale-[1.03] transition-transform duration-300">
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
            <span className="text-center font-heading text-sm font-700 uppercase text-primary leading-tight line-clamp-2">
              {fixture.awayTeam.name}
            </span>
            {fixture.awayCategoryName && (
              <span className="text-[10px] font-600 uppercase text-muted-foreground tracking-wider mt-1 bg-muted/50 px-2 py-0.5 rounded-md">
                {fixture.awayCategoryName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Metadata Opcional */}
      {(fixture.locationName ||
        (fixture.partials && fixture.partials.length > 0)) && (
        <div className="bg-muted/10 border-t border-border/40 py-2.5 px-4 flex flex-col gap-2 transition-colors group-hover:bg-muted/20">
          {fixture.location && (
            <div className="hover:-translate-y-px hover:scale-[1.01] transition-transform origin-left">
              <LocationMapTrigger location={fixture.location} />
            </div>
          )}
          {!fixture.location && fixture.locationName && (
            <div className="flex flex-row items-center justify-between w-full">
              <span className="text-xs font-600 uppercase tracking-wide text-primary/70 flex items-center gap-1.5 line-clamp-1">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={14}
                  className="shrink-0 opacity-70"
                />
                {fixture.locationName}
              </span>
            </div>
          )}

          {fixture.partials && fixture.partials.length > 0 && (
            <div className="flex flex-col border-t border-border/20 pt-2 mt-1">
              <button
                type="button"
                onClick={() => setShowPartials(!showPartials)}
                aria-expanded={showPartials}
                className="text-[10px] font-800 uppercase tracking-widest text-primary/60 mx-auto hover:text-primary transition-colors flex items-center gap-1"
              >
                {showPartials ? "Ocultar Parciales" : "Ver Parciales"}
              </button>

              <AnimatePresence>
                {showPartials && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 flex flex-col gap-1.5 pb-1">
                      {fixture.partials.map((p, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center text-xs px-8"
                        >
                          <span className="text-muted-foreground font-600 w-1/3 text-right">
                            {p.homeScore ?? "-"}
                          </span>
                          <span className="font-bold text-[10px] uppercase bg-primary/5 text-primary/70 px-2 py-0.5 rounded text-center tracking-widest">
                            {p.label ?? `P${p.sequence}`}
                          </span>
                          <span className="text-muted-foreground font-600 w-1/3 text-left">
                            {p.awayScore ?? "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
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
  isSingleDiscipline,
}: {
  discipline: string;
  title: string;
  colorClass: string;
  fixtures: PublicFixture[];
  showDiscipline: boolean;
  isSingleDiscipline: boolean;
}) {
  const filteredFixtures = fixtures.filter((f) => f.discipline === discipline);

  if (filteredFixtures.length === 0) return null;

  return (
    <motion.section
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 w-full"
    >
      <div
        className={`rounded-t-2xl py-3 px-6 flex items-center justify-between font-heading text-xl md:text-2xl font-700 uppercase tracking-wide text-white shadow-md ${colorClass}`}
      >
        <span>Fixture {title}</span>
        <span className="text-[10px] md:text-xs bg-white/20 px-2 py-1 rounded-md">
          {filteredFixtures.length === 1
            ? "1 Partido"
            : `${filteredFixtures.length} Partidos`}
        </span>
      </div>

      <div
        className={
          isSingleDiscipline
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            : "flex flex-col gap-6"
        }
      >
        <AnimatePresence mode="popLayout">
          {filteredFixtures.map((fixture, idx) => (
            <FixtureCard
              key={fixture.id}
              fixture={fixture}
              showDiscipline={showDiscipline}
              idx={idx}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export function FixtureSection({
  globalFixtures = [],
  viewFixtures = [],
  view = "today",
  fromDate,
  toDate,
}: {
  globalFixtures?: PublicFixture[];
  viewFixtures?: PublicFixture[];
  view?: string;
  fromDate?: string;
  toDate?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");

  const [localDateRange, setLocalDateRange] = useState<{
    start: DateValue;
    end: DateValue;
  } | null>(null);

  // Derivar disciplinas únicas (basado en la respuesta global)
  const derivedDisciplines = useMemo(
    () =>
      Array.from(
        new Set(globalFixtures.map((f) => f.discipline).filter(Boolean)),
      ),
    [globalFixtures],
  );

  useEffect(() => {
    if (
      selectedDiscipline !== "all" &&
      !derivedDisciplines.includes(selectedDiscipline)
    ) {
      setSelectedDiscipline("all");
    }
  }, [derivedDisciplines, selectedDiscipline]);

  // Handle defaults for "played" view if no fromDate/toDate in URL
  useEffect(() => {
    if (view === "played") {
      if (!fromDate || !toDate) {
        try {
          const t = today(getLocalTimeZone());
          const startOfMonth = t.set({ day: 1 });
          const startStr = startOfMonth.toString();
          const endStr = t.toString();
          router.replace(
            `${pathname}?view=played&from=${startStr}&to=${endStr}`,
            { scroll: false },
          );
        } catch {
          // Ignore
        }
      } else {
        try {
          setLocalDateRange({
            start: parseDate(fromDate),
            end: parseDate(toDate),
          });
        } catch {}
      }
    } else {
      setLocalDateRange(null);
    }
  }, [view, fromDate, toDate, pathname, router]);

  const handleTabChange = (newView: "today" | "upcoming" | "played") => {
    if (newView === "played") {
      const t = today(getLocalTimeZone());
      const startOfMonth = t.set({ day: 1 });
      router.push(
        `${pathname}?view=played&from=${startOfMonth.toString()}&to=${t.toString()}`,
        { scroll: false },
      );
    } else {
      router.push(`${pathname}?view=${newView}`, { scroll: false });
    }
  };

  const handleDateChange = (
    range: { start: DateValue; end: DateValue } | null,
  ) => {
    setLocalDateRange(range);
    if (range && range.start && range.end) {
      router.push(
        `${pathname}?view=played&from=${range.start.toString()}&to=${range.end.toString()}`,
        { scroll: false },
      );
    }
  };

  // Filtrado de la lista
  // Tablero Destacado CONTEXTUAL (se calcula primero para excluirlo de la lista inferior si es necesario)
  const { featuredMatch, featuredMode, featuredTitle } = useMemo(() => {
    const now = Date.now();

    // Filtramos viewFixtures por la disciplina seleccionada
    let matches = viewFixtures;
    if (selectedDiscipline !== "all") {
      matches = matches.filter((m) => m.discipline === selectedDiscipline);
    }

    if (view === "played") {
      // Para JUGADOS: El último jugado del rango actual
      const playedMatches = matches
        .filter((m) => m.status === "PLAYED")
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

      if (playedMatches.length > 0) {
        return {
          featuredMatch: playedMatches[0],
          featuredMode: "PLAYED",
          featuredTitle: "Último Partido",
        };
      }
    } else if (view === "upcoming") {
      // Para PRÓXIMOS: El primer PENDING del futuro (globalFixtures + viewFixtures por seguridad)
      const allMatchesMap = new Map<string, PublicFixture>();
      globalFixtures.forEach((m) => allMatchesMap.set(m.id, m));
      viewFixtures.forEach((m) => allMatchesMap.set(m.id, m));

      let candidates = Array.from(allMatchesMap.values()).filter(
        (m) => m.status === "PENDING" && new Date(m.date).getTime() > now,
      );
      if (selectedDiscipline !== "all") {
        candidates = candidates.filter(
          (m) => m.discipline === selectedDiscipline,
        );
      }
      const upcomingMatches = candidates.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      if (upcomingMatches.length > 0) {
        return {
          featuredMatch: upcomingMatches[0],
          featuredMode: "UPCOMING",
          featuredTitle: "⭐ Próximo Partido",
        };
      }
    } else if (view === "today") {
      // Para HOY:
      // 1. Si hay partido pendiente HOY (en el futuro), mostrarlo
      const todayPending = matches
        .filter(
          (m) => m.status === "PENDING" && new Date(m.date).getTime() > now,
        )
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

      if (todayPending.length > 0) {
        return {
          featuredMatch: todayPending[0],
          featuredMode: "UPCOMING",
          featuredTitle: "🔥 Partido de Hoy",
        };
      }

      // 2. Si no hay pendiente futuro hoy, pero hay jugado hoy, mostrar el último jugado de hoy
      const todayPlayed = matches
        .filter(
          (m) =>
            m.status === "PLAYED" ||
            (m.status === "PENDING" && new Date(m.date).getTime() <= now),
        )
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

      if (todayPlayed.length > 0) {
        // Asumimos que si ya pasó la hora, se trata como "PLAYED" en el tablero (mostrando resultado o lo que tenga)
        return {
          featuredMatch: todayPlayed[0],
          featuredMode: "PLAYED",
          featuredTitle: "Último Partido de Hoy",
        };
      }
    }

    return {
      featuredMatch: null,
      featuredMode: "UPCOMING" as const,
      featuredTitle: undefined,
    };
  }, [globalFixtures, viewFixtures, selectedDiscipline, view]);

  // Filtrado de la lista (Cards inferiores)
  const visibleFixtures = useMemo(() => {
    let matches = viewFixtures;

    // 1. Filtro Disciplina
    if (selectedDiscipline !== "all") {
      matches = matches.filter((f) => f.discipline === selectedDiscipline);
    }

    // 2. Filtro Temporal (Los rangos de fecha ya vienen aplicados desde backend)
    const now = Date.now();

    matches = matches.filter((match) => {
      const matchTime = new Date(match.date).getTime();
      if (view === "upcoming") {
        return match.status === "PENDING" && matchTime >= now;
      } else if (view === "played") {
        return match.status === "PLAYED";
      }
      return true; // "today" trae tanto PENDING como PLAYED
    });

    // 3. Deduplicar Featured Match
    if (featuredMatch) {
      matches = matches.filter((match) => match.id !== featuredMatch.id);
    }

    // 4. Ordenamiento
    return [...matches].sort((a, b) => {
      if (view === "played") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [viewFixtures, selectedDiscipline, view, featuredMatch]);

  const activeDisciplines =
    selectedDiscipline === "all" ? derivedDisciplines : [selectedDiscipline];

  const visibleDisciplineGroups = useMemo(() => {
    return activeDisciplines.filter((disc) =>
      visibleFixtures.some((f) => f.discipline === disc),
    );
  }, [activeDisciplines, visibleFixtures]);

  let emptyStateMessage = "No hay partidos para los filtros seleccionados";
  if (view === "today")
    emptyStateMessage = "No hay partidos programados para hoy.";
  else if (view === "upcoming")
    emptyStateMessage = "No hay próximos partidos programados.";
  else if (view === "played")
    emptyStateMessage = "No hay partidos jugados en este período.";

  let maxDateToday: DateValue | undefined = undefined;
  try {
    maxDateToday = today(getLocalTimeZone());
  } catch {}

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-end">
        <div className="flex flex-col items-center lg:items-start gap-4">
          <h2 className="font-heading text-4xl font-700 uppercase tracking-tight text-primary sm:text-5xl">
            Fixture
          </h2>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <button
              onClick={() => setSelectedDiscipline("all")}
              className={`relative rounded-full px-5 py-1.5 text-xs font-700 uppercase tracking-wider transition-colors ${
                selectedDiscipline === "all"
                  ? "text-primary"
                  : "text-primary/60 hover:text-primary hover:bg-primary/5"
              }`}
            >
              {selectedDiscipline === "all" && (
                <motion.div
                  layoutId="discipline-active"
                  className="absolute inset-0 bg-neon shadow-sm rounded-full z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">Todas</span>
            </button>
            {derivedDisciplines.map((disc) => (
              <button
                key={disc}
                onClick={() => setSelectedDiscipline(disc)}
                className={`relative rounded-full px-5 py-1.5 text-xs font-700 uppercase tracking-wider transition-colors ${
                  selectedDiscipline === disc
                    ? "text-primary"
                    : "text-primary/60 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {selectedDiscipline === disc && (
                  <motion.div
                    layoutId="discipline-active"
                    className="absolute inset-0 bg-neon shadow-sm rounded-full z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{disc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="flex bg-muted/30 p-1 rounded-xl shadow-inner border border-border/50 overflow-x-auto w-full sm:w-auto justify-center">
            {(["today", "upcoming", "played"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => handleTabChange(filter)}
                className={`relative shrink-0 px-4 py-1.5 rounded-lg text-xs font-700 uppercase tracking-wide transition-colors ${
                  view === filter
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-white/50"
                }`}
              >
                {view === filter && (
                  <motion.div
                    layoutId="view-active"
                    className="absolute inset-0 bg-white shadow-sm rounded-lg z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {filter === "today"
                    ? "Hoy"
                    : filter === "upcoming"
                      ? "Próximos"
                      : "Jugados"}
                </span>
              </button>
            ))}
          </div>

          {view === "played" && (
            <div className="w-full sm:w-auto min-w-70">
              <DateRangePicker
                aria-label="Rango de Fechas"
                value={localDateRange}
                onChange={handleDateChange}
                maxValue={maxDateToday}
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
          )}
        </div>
      </div>

      {featuredMatch && (
        <AnimatePresence mode="wait">
          <motion.div
            key={featuredMatch.id + featuredMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <NextMatchCountdown
              match={featuredMatch}
              mode={featuredMode as "UPCOMING" | "PLAYED"}
              title={featuredTitle}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {visibleFixtures.length > 0 ? (
        <motion.div
          layout
          className={
            visibleDisciplineGroups.length === 1
              ? "w-full"
              : visibleDisciplineGroups.length === 2
                ? "grid grid-cols-1 gap-10 lg:grid-cols-2"
                : "grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3"
          }
        >
          <AnimatePresence mode="popLayout">
            {visibleDisciplineGroups.map((discipline, index) => (
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
                isSingleDiscipline={visibleDisciplineGroups.length === 1}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/50 p-8 text-center"
        >
          <p className="font-heading text-xl font-semibold text-muted-foreground uppercase">
            {emptyStateMessage}
          </p>
        </motion.div>
      )}
    </section>
  );
}
