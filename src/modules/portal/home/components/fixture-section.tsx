"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PublicFixture } from "../actions/fixture.action";
import { NextMatchCountdown } from "./next-match-countdown";
import { useState } from "react";

const getInitials = (name: string) => {
  const words = name.trim().split(' ').filter(Boolean);
  if (words.length >= 3) {
    return (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
  }
  if (words.length === 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 3).toUpperCase();
};

function MatchCard({ fixture, showDiscipline, idx }: { fixture: PublicFixture, showDiscipline: boolean, idx: number }) {
  const fixtureDate = new Date(fixture.date);
  
  // Format dates manually for consistent display without relying heavily on locales that might shift
  const day = fixtureDate.getDate().toString().padStart(2, '0');
  const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const month = monthNames[fixtureDate.getMonth()];
  const timeString = fixtureDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateDisplay = `${day} ${month} · ${timeString}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.5 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-secondary/50 shadow-sm backdrop-blur-xs"
    >
      <div className="flex flex-col p-4">
        {/* Match Header (Category, Date, Location) */}
        <div className="mb-4 flex flex-col items-center justify-center space-y-1 text-center">
          <span className="font-heading text-sm font-700 uppercase tracking-wider text-oxford">
            {fixture.category}
          </span>
          <span className="text-xs font-600 uppercase tracking-wider text-muted-foreground">
            {dateDisplay}
          </span>
          {fixture.locationName && (
            <span className="text-xs font-500 uppercase tracking-wider text-muted-foreground">
              {fixture.locationName}
            </span>
          )}
        </div>
        
        {/* Teams and Score */}
        <div className="flex items-center justify-between gap-4 px-2">
          {/* Home Team */}
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white p-2 shadow-sm">
              {fixture.homeTeam.imageUrl ? (
                <Image src={fixture.homeTeam.imageUrl} alt={fixture.homeTeam.name} fill className="object-contain p-1" />
              ) : (
                <span className="font-heading text-xl font-bold uppercase text-oxford/70">{getInitials(fixture.homeTeam.name)}</span>
              )}
            </div>
            <span className="text-center font-heading text-sm font-700 uppercase text-oxford line-clamp-2">{fixture.homeTeam.name}</span>
          </div>
          
          {/* Score or VS */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center rounded-lg bg-oxford/5 px-4 py-2 font-heading text-2xl font-700 text-oxford">
              {fixture.status === "PLAYED" ? (
                <span className="tracking-widest">
                  {fixture.homeScore ?? '-'} <span className="text-muted-foreground text-sm font-400 mx-1">Vs</span> {fixture.awayScore ?? '-'}
                </span>
              ) : (
                <span className="text-muted-foreground text-xl">Vs</span>
              )}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white p-2 shadow-sm">
              {fixture.awayTeam.imageUrl ? (
                <Image src={fixture.awayTeam.imageUrl} alt={fixture.awayTeam.name} fill className="object-contain p-1" />
              ) : (
                <span className="font-heading text-xl font-bold uppercase text-oxford/70">{getInitials(fixture.awayTeam.name)}</span>
              )}
            </div>
            <span className="text-center font-heading text-sm font-700 uppercase text-oxford line-clamp-2">{fixture.awayTeam.name}</span>
          </div>
        </div>
        
        {fixture.status === "PLAYED" && (
          <div className="mt-4 flex justify-center">
            <span className="rounded-full bg-oxford/10 px-4 py-1 text-[10px] font-600 uppercase tracking-widest text-oxford/80">
              Finalizado
            </span>
          </div>
        )}
      </div>

      {/* Conditional Discipline Footer */}
      {showDiscipline && (
        <div className="border-t border-border/50 bg-oxford/5 px-4 py-2 text-center">
          <span className="font-heading text-[10px] font-700 uppercase tracking-widest text-oxford/70">
            {fixture.discipline}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function FixtureGroup({ discipline, title, colorClass, fixtures, showDiscipline }: { discipline: string, title: string, colorClass: string, fixtures: PublicFixture[], showDiscipline: boolean }) {
  const filteredFixtures = fixtures.filter(f => f.discipline === discipline);
  
  if (filteredFixtures.length === 0) return null;
  
  return (
    <div className="flex flex-col gap-4">
      <div className={`rounded-t-2xl py-3 px-6 text-center font-heading text-2xl font-700 uppercase tracking-wide text-white shadow-md ${colorClass}`}>
        Fixture {title}
      </div>
      
      <div className="flex flex-col gap-4">
        {filteredFixtures.map((fixture, idx) => (
          <MatchCard 
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

export function FixtureSection({ initialFixtures = [] }: { initialFixtures?: PublicFixture[] }) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");

  if (initialFixtures.length === 0) return null;

  // Derivar disciplinas únicas de los partidos
  const derivedDisciplines = Array.from(new Set(initialFixtures.map(f => f.discipline).filter(Boolean)));

  if (derivedDisciplines.length === 0) return null;

  // Filtrado de partidos
  const filteredFixtures = selectedDiscipline === "all" 
    ? initialFixtures 
    : initialFixtures.filter(f => f.discipline === selectedDiscipline);

  // Computar próximo partido del listado filtrado
  const now = Date.now();
  const upcomingMatches = filteredFixtures
    .filter(match => match.status === "PENDING" && new Date(match.date).getTime() > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextMatch = upcomingMatches[0] || null;

  // Render variables for disciplines list
  const activeDisciplines = selectedDiscipline === "all" 
    ? derivedDisciplines 
    : [selectedDiscipline];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row">
        <h2 className="font-heading text-4xl font-700 uppercase tracking-tight text-oxford sm:text-5xl">
          Fixture
        </h2>
        
        {/* Tabs de Disciplinas */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedDiscipline("all")}
            className={`rounded-full px-6 py-2 text-sm font-700 uppercase tracking-wider transition-colors ${
              selectedDiscipline === "all"
                ? "bg-neon text-oxford shadow-md"
                : "bg-oxford/5 text-oxford hover:bg-oxford/10"
            }`}
          >
            Todas
          </button>
          {derivedDisciplines.map((disc) => (
            <button
              key={disc}
              onClick={() => setSelectedDiscipline(disc)}
              className={`rounded-full px-6 py-2 text-sm font-700 uppercase tracking-wider transition-colors ${
                selectedDiscipline === disc
                  ? "bg-neon text-oxford shadow-md"
                  : "bg-oxford/5 text-oxford hover:bg-oxford/10"
              }`}
            >
              {disc}
            </button>
          ))}
        </div>
      </div>

      {nextMatch && (
        <NextMatchCountdown match={nextMatch} />
      )}

      {filteredFixtures.length > 0 ? (
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
              colorClass={index % 2 === 0 ? "bg-neon text-oxford" : "bg-oxford text-white"} 
              fixtures={filteredFixtures} 
              showDiscipline={selectedDiscipline === "all"}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/50 p-8 text-center">
          <p className="font-heading text-xl font-semibold text-muted-foreground uppercase">
            No hay partidos disponibles
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Intenta seleccionar otra disciplina o vuelve más tarde.
          </p>
        </div>
      )}
    </section>
  );
}
