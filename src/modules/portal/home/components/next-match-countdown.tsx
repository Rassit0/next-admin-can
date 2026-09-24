"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { PublicFixture } from "../actions/fixture.action";

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

interface NextMatchCountdownProps {
  match: PublicFixture;
}

export function NextMatchCountdown({ match }: NextMatchCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    d: number;
    h: number;
    m: number;
    s: number;
  } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const targetTime = new Date(match.date).getTime();

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        return { d: 0, h: 0, m: 0, s: 0 };
      }

      return {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
      if (
        newTime.d === 0 &&
        newTime.h === 0 &&
        newTime.m === 0 &&
        newTime.s === 0
      ) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [match.date]);

  const matchDate = new Date(match.date);
  const isToday = new Date().toDateString() === matchDate.toDateString();

  return (
    <div className="relative mb-12 w-full overflow-hidden rounded-3xl bg-[#0a0f18] text-white shadow-2xl border border-white/5">
      <div className="relative z-10 flex min-h-[300px] w-full flex-col items-stretch justify-center md:flex-row">
        {/* PANEL LOCAL */}
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-white/5 p-8 pb-10 pt-16 md:pb-8 md:pt-12">
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-neon/20 blur-3xl" />
          <span className="mb-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
            Local
          </span>
          <div className="relative z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white p-3 shadow-lg md:h-28 md:w-28">
            {match.homeTeam.imageUrl ? (
              <Image
                src={match.homeTeam.imageUrl}
                alt={match.homeTeam.name}
                fill
                className="object-contain p-2"
              />
            ) : (
              <span className="font-heading text-2xl font-bold uppercase text-primary/70 md:text-4xl">
                {getInitials(match.homeTeam.name)}
              </span>
            )}
          </div>
          <span className="relative z-10 text-center font-heading text-lg font-black uppercase tracking-wide md:text-xl">
            {match.homeTeam.name}
          </span>
        </div>

        {/* PANEL CENTRAL COUNTDOWN */}
        <div className="relative z-20 flex shrink-0 flex-col items-center justify-center border-y border-white/10 bg-black/90 p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] md:border-x md:border-y-0 md:p-10">
          <div className="mb-6 inline-flex items-center rounded-full border border-neon/20 bg-neon/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-neon backdrop-blur-md md:text-xs">
            {isToday ? "Ã°ÂÂÂ¥ Hoy" : "Ã¢Â­Â PriÂ³ximo Partido"}
          </div>

          <span className="mb-6 text-center text-[10px] font-bold uppercase tracking-widest text-neon/80">
            Tiempo Restante
          </span>

          {/* Bloque Scoreboard Unificado */}
          <div className="flex items-center justify-center rounded-xl border border-white/10 bg-black p-3 shadow-[inset_0_2px_15px_rgba(0,0,0,1)] md:p-4">
            {isClient && timeLeft ? (
              <div className="flex items-center gap-1 md:gap-2">
                <TimeUnit value={timeLeft.d} label="DiÂ­as" />
                <Separator />
                <TimeUnit value={timeLeft.h} label="Horas" />
                <Separator />
                <TimeUnit value={timeLeft.m} label="Min" />
                <Separator />
                <TimeUnit value={timeLeft.s} label="Seg" />
              </div>
            ) : (
              <div className="flex items-center gap-1 opacity-30 md:gap-2">
                <TimeUnit value={0} label="DiÂ­as" />
                <Separator />
                <TimeUnit value={0} label="Horas" />
                <Separator />
                <TimeUnit value={0} label="Min" />
                <Separator />
                <TimeUnit value={0} label="Seg" />
              </div>
            )}
          </div>

          {/* Estado al llegar a cero */}
          <div className="mt-6 min-h-[2rem]">
            {isClient &&
              timeLeft &&
              timeLeft.d === 0 &&
              timeLeft.h === 0 &&
              timeLeft.m === 0 &&
              timeLeft.s === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-heading text-base font-black uppercase tracking-widest text-neon md:text-lg"
                >
                  Hora del partido
                </motion.div>
              )}
          </div>
        </div>

        {/* PANEL VISITANTE */}
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-white/5 p-8 pb-20 pt-10 md:pb-8 md:pt-12">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-neon/20 blur-3xl" />
          <span className="mb-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
            Visitante
          </span>
          <div className="relative z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white p-3 shadow-lg md:h-28 md:w-28">
            {match.awayTeam.imageUrl ? (
              <Image
                src={match.awayTeam.imageUrl}
                alt={match.awayTeam.name}
                fill
                className="object-contain p-2"
              />
            ) : (
              <span className="font-heading text-2xl font-bold uppercase text-primary/70 md:text-4xl">
                {getInitials(match.awayTeam.name)}
              </span>
            )}
          </div>
          <span className="relative z-10 text-center font-heading text-lg font-black uppercase tracking-wide md:text-xl">
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* FOOTER INFORMATIVO */}
      <div className="flex flex-col items-center justify-center gap-2 border-t border-white/5 bg-black/95 px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/50 md:flex-row md:gap-6">
        <div className="flex items-center gap-2">
          <span className="text-neon/70">Ã¢ÂÂ </span> {match.discipline}
        </div>
        <div className="hidden text-white/10 md:block">-</div>
        <div className="flex items-center gap-2">
          <span className="text-neon/70">Ã¢ÂÂ </span>{" "}
          {matchDate
            .toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })
            .replace(",", "")}{" "}
          ÃÂ·{" "}
          {matchDate.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        {match.locationName && (
          <>
            <div className="hidden text-white/10 md:block">-</div>
            <div className="flex items-center gap-2">
              <span className="text-neon/70">Ã¢ÂÂ </span> {match.locationName}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 px-1 pb-6 opacity-50 md:gap-2 md:px-2 md:pb-7">
      <div className="h-1.5 w-1.5 rounded-full bg-white/60 shadow-[0_0_5px_rgba(255,255,255,0.3)] md:h-2 md:w-2" />
      <div className="h-1.5 w-1.5 rounded-full bg-white/60 shadow-[0_0_5px_rgba(255,255,255,0.3)] md:h-2 md:w-2" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-14 w-12 items-center justify-center overflow-hidden rounded bg-black/60 border border-white/5 shadow-inner md:h-20 md:w-16">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={
              shouldReduceMotion ? { opacity: 1, y: 0 } : { y: 24, opacity: 0 }
            }
            animate={{ y: 0, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: -24, opacity: 0 }}
            transition={{ duration: 0.25, type: "spring", bounce: 0.3 }}
            className="absolute font-heading text-3xl font-black text-white md:text-5xl"
            style={{ textShadow: "0 0 10px rgba(255,255,255,0.2)" }}
          >
            {value.toString().padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[9px] font-bold uppercase tracking-widest text-white/40 md:mt-3 md:text-[10px]">
        {label}
      </span>
    </div>
  );
}
