"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PublicFixture } from "../actions/fixture.action";

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

function FixtureCard({ discipline, title, colorClass, fixtures }: { discipline: string, title: string, colorClass: string, fixtures: PublicFixture[] }) {
  const filteredFixtures = fixtures.filter(f => f.discipline === discipline);
  
  if (filteredFixtures.length === 0) return null;
  
  return (
    <div className="flex flex-col gap-4">
      <div className={`rounded-t-2xl py-3 px-6 text-center font-heading text-2xl font-700 uppercase tracking-wide text-white shadow-md ${colorClass}`}>
        Fixture {title}
      </div>
      
      <div className="flex flex-col gap-4">
        {filteredFixtures.map((fixture, idx) => {
          const fixtureDate = new Date(fixture.date);
          const dateString = fixtureDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
          
          return (
            <motion.div
              key={fixture.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="rounded-2xl border border-border/50 bg-secondary/50 p-4 shadow-sm backdrop-blur-xs"
            >
              <div className="mb-4 text-center text-xs font-600 uppercase tracking-wider text-muted-foreground">
                {fixture.category} / {fixture.locationName} / {dateString}
              </div>
              
              <div className="flex items-center justify-between gap-4 px-4">
                <div className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white p-2 shadow-sm">
                    {fixture.homeTeam.imageUrl ? (
                      <Image src={fixture.homeTeam.imageUrl} alt={fixture.homeTeam.name} fill className="object-contain p-1" />
                    ) : (
                      <span className="font-heading text-xl font-bold uppercase text-oxford/70">{getInitials(fixture.homeTeam.name)}</span>
                    )}
                  </div>
                  <span className="text-center font-heading text-sm font-700 uppercase text-oxford">{fixture.homeTeam.name}</span>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center rounded-lg bg-oxford/5 px-4 py-2 font-heading text-2xl font-700 text-oxford">
                    {fixture.status === "PLAYED" ? (
                      <span className="tracking-widest">{fixture.homeScore ?? '-'} <span className="text-muted-foreground text-sm font-400 mx-1">Vs</span> {fixture.awayScore ?? '-'}</span>
                    ) : (
                      <span className="text-muted-foreground text-xl">Vs</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white p-2 shadow-sm">
                    {fixture.awayTeam.imageUrl ? (
                      <Image src={fixture.awayTeam.imageUrl} alt={fixture.awayTeam.name} fill className="object-contain p-1" />
                    ) : (
                      <span className="font-heading text-xl font-bold uppercase text-oxford/70">{getInitials(fixture.awayTeam.name)}</span>
                    )}
                  </div>
                  <span className="text-center font-heading text-sm font-700 uppercase text-oxford">{fixture.awayTeam.name}</span>
                </div>
              </div>
              
              {fixture.status === "PLAYED" && (
                <div className="mt-4 flex justify-center">
                  <button className="rounded-full bg-oxford/10 px-6 py-1.5 text-xs font-600 uppercase tracking-wide text-oxford transition-colors hover:bg-oxford/20">
                    Resultado final
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function FixtureSection({ initialFixtures = [], disciplines = [] }: { initialFixtures?: PublicFixture[], disciplines?: string[] }) {
  if (initialFixtures.length === 0 || disciplines.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h2 className="font-heading text-4xl font-700 uppercase tracking-tight text-oxford sm:text-5xl">
          Fixture
        </h2>
      </div>

      <div 
        className={
          disciplines.length === 1 
            ? "mx-auto w-full max-w-2xl" 
            : "grid grid-cols-1 gap-10 lg:grid-cols-2"
        }
      >
        {disciplines.map((discipline, index) => (
          <FixtureCard 
            key={discipline}
            discipline={discipline} 
            title={discipline} 
            colorClass={index % 2 === 0 ? "bg-neon text-oxford" : "bg-oxford text-white"} 
            fixtures={initialFixtures} 
          />
        ))}
      </div>
    </section>
  );
}
