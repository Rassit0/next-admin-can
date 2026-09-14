"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MapPin, Trophy, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Team {
  id: string;
  name: string;
  discipline: string;
  club: string;
  gender: string;
  minAge: number;
  maxAge: number;
  category: string;
  tournament: string;
  capacity: number;
  enrolled: number;
  registrationFee: number;
  monthlyFee: number;
}

const ALL = "Todos";

export function Teams({ teams }: { teams: Team[] }) {
  const [discipline, setDiscipline] = useState<string>(ALL);
  const [club, setClub] = useState<string>(ALL);
  const [category, setCategory] = useState<string>(ALL);
  const [selected, setSelected] = useState<Team | null>(null);

  const disciplines = useMemo(
    () => [ALL, ...Array.from(new Set(teams.map((t) => t.discipline)))],
    [teams],
  );
  const clubs = useMemo(() => {
    const pool = teams.filter(
      (t) => discipline === ALL || t.discipline === discipline,
    );
    return [ALL, ...Array.from(new Set(pool.map((t) => t.club)))];
  }, [discipline, teams]);
  const categories = useMemo(() => {
    const pool = teams.filter(
      (t) =>
        (discipline === ALL || t.discipline === discipline) &&
        (club === ALL || t.club === club),
    );
    return [ALL, ...Array.from(new Set(pool.map((t) => t.category)))];
  }, [discipline, club, teams]);

  const filtered = teams.filter(
    (t) =>
      (discipline === ALL || t.discipline === discipline) &&
      (club === ALL || t.club === club) &&
      (category === ALL || t.category === category),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      <div className="mb-8">
        <h1 className="font-heading text-5xl font-700 uppercase tracking-tight text-oxford sm:text-6xl">
          Equipos y{" "}
          <span className="text-neon text-glow-neon">Competición</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground text-pretty">
          Filtrá por disciplina, sede y categoría. Girá cada tarjeta para ver la
          membresía y solicitá tu cupo.
        </p>
      </div>

      {/* Hierarchical filters */}
      <div className="mb-10 grid gap-4 rounded-2xl border border-border bg-secondary p-4 sm:grid-cols-3">
        <FilterSelect
          label="Disciplina"
          value={discipline}
          options={disciplines}
          onChange={(v) => {
            setDiscipline(v);
            setClub(ALL);
            setCategory(ALL);
          }}
        />
        <FilterSelect
          label="Sede / Club"
          value={club}
          options={clubs}
          onChange={(v) => {
            setClub(v);
            setCategory(ALL);
          }}
        />
        <FilterSelect
          label="Categoría"
          value={category}
          options={categories}
          onChange={setCategory}
        />
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((team) => (
            <FlipCard
              key={team.id}
              team={team}
              onApply={() => setSelected(team)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          No hay equipos para esta combinación de filtros.
        </p>
      )}

      <MembershipModal team={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-600 uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-500 text-oxford outline-none transition-colors focus:border-neon focus:ring-2 focus:ring-neon/30"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function FlipCard({ team, onApply }: { team: Team; onApply: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const slotsLeft = team.capacity - team.enrolled;
  const lastSlots = slotsLeft > 0 && slotsLeft <= 3;
  const full = slotsLeft <= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="group h-72 perspective-[1400px] cursor-pointer lg:cursor-default"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-700 transform-3d",
          isFlipped ? "transform-[rotateY(180deg)]" : "",
        )}
      >
        {/* Front */}
        <div className="neon-perimeter absolute inset-0 flex flex-col justify-between rounded-2xl border border-border bg-card p-6 backface-hidden">
          <div>
            <div className="flex items-center gap-2 text-neon">
              <Trophy className="h-4 w-4" />
              <span className="text-xs font-600 uppercase tracking-[0.18em]">
                {team.discipline}
              </span>
            </div>
            <h3 className="mt-3 font-heading text-2xl font-700 uppercase leading-tight tracking-tight text-oxford text-balance">
              {team.name}
            </h3>
            <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {team.club} · {team.gender}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{team.tournament}</p>
            <span
              className={cn(
                "mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-700 uppercase tracking-wide",
                full
                  ? "bg-oxford/10 text-oxford"
                  : lastSlots
                    ? "animate-pulse bg-neon text-white shadow-neon"
                    : "bg-neon/10 text-neon",
              )}
            >
              {full
                ? "Cupos Completos"
                : lastSlots
                  ? `¡Últimos Cupos! ${slotsLeft}/${team.capacity}`
                  : `Cupos: ${slotsLeft}/${team.capacity}`}
            </span>
          </div>
        </div>

        {/* Back — Membership card */}
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-neon/50 bg-oxford p-6 text-white shadow-neon backface-hidden transform-[rotateY(180deg)]">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon/20 blur-2xl" />
          <div>
            <span className="text-xs font-600 uppercase tracking-[0.22em] text-neon">
              Membresía
            </span>
            <h3 className="mt-1 font-heading text-xl font-700 uppercase tracking-wide">
              {team.name}
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Matrícula</span>
                <span className="font-700">${team.registrationFee} USD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Cuota mensual</span>
                <span className="font-700">${team.monthlyFee} USD</span>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
            disabled={full}
            className={cn(
              "flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-700 uppercase tracking-wide transition-all",
              full
                ? "cursor-not-allowed bg-white/15 text-white/50"
                : "animate-pulse bg-neon text-white hover:shadow-neon",
            )}
          >
            <Zap className="h-4 w-4" />
            {full ? "Sin cupos" : "Solicitar Membresía"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MembershipModal({
  team,
  onClose,
}: {
  team: Team | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {team && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-80 flex items-center justify-center bg-oxford/40 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-neon"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-oxford"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neon/10 text-neon">
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <h3 className="mt-5 font-heading text-2xl font-700 uppercase tracking-wide text-oxford">
              Solicitud enviada
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
              Recibimos tu solicitud de membresía para{" "}
              <span className="font-600 text-oxford">{team.name}</span>. Nuestro
              equipo se pondrá en contacto para coordinar la incorporación.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-oxford py-3 text-sm font-700 uppercase tracking-wide text-white transition-shadow hover:shadow-neon"
            >
              Entendido
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
