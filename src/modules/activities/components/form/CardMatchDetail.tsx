import { Card } from "@heroui/react";
import {
  FootballIcon,
  Shield01Icon,
  TeamviewerIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

export const CardMatchDetail = () => {
  return (
    <Card className="p-8  border-l-4 border-accent">
      <div className="flex items-center gap-4 mb-6">
        <HugeiconsIcon
          icon={FootballIcon}
          className="text-accent"
          strokeWidth={2}
        />
        <Card.Header>
          <Card.Title className="text-xl font-bold">
            Detalles del Encuentro
          </Card.Title>
        </Card.Header>
      </div>
      <Card.Content className="grid grid-cols-12 gap-8">
        {/* <!-- Match Config & Logistics --> */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Tipo de Partido
            </label>
            <select className="bg-surface-container-high border-none focus:ring-2 focus:ring-primary rounded-xl p-4 font-medium transition-all">
              <option>Liga</option>
              <option>Amistoso</option>
              <option>Torneo</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Estado
            </label>
            <select className="bg-surface-container-high border-none focus:ring-2 focus:ring-primary rounded-xl p-4 font-medium transition-all">
              <option>Programado</option>
              <option>En curso</option>
              <option>Finalizado</option>
              <option>Cancelado</option>
              <option>Aplazado</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Fecha y Hora del Encuentro
            </label>
            <input
              className="bg-surface-container-high border-none focus:ring-2 focus:ring-primary rounded-xl p-4 font-medium transition-all"
              type="datetime-local"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Sede / Instalación
            </label>
            <select className="bg-surface-container-high border-none focus:ring-2 focus:ring-primary rounded-xl p-4 font-medium transition-all">
              <option>Sede Guarne - Cancha 1</option>
              <option>Estadio Atanasio Girardot</option>
              <option>Centro de Alto Rendimiento</option>
            </select>
          </div>
        </div>
        {/* <!-- Rivalry & Score --> */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* <!-- Home Team --> */}
            <div className="flex flex-col items-center gap-4 flex-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">
                Equipo Local
              </label>
              <div className="w-24 h-24 rounded-lg bg-white flex items-center justify-center border-2 border-primary-container p-4 shadow-sm">
                <img
                  alt="Local"
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi8ymttDpzqF0JxjWvG9OCMxNeTK90zrOl3ingRNLghrP1B00XNIty5IURKnYIcC8aqWydBWx0Y_rpyscR08pjQm5oD6j0R036q441BenR-aP6hEQTMVAtVs6vWZw8LZYpZNJ8MwKq41qCGhh-wd_yWWGu7ihU6BuBy834o38MbGfTODT_zlyVYIi1tr-DDGF6RYru3a0Z6gqL4HYVO8cRQgB8xapycwb3gv4Jq4Xgu_dCIgcZ9mPiunosiQnWlN5Koh96QTBmq79c"
                />
              </div>
              <select className="bg-transparent border-none text-center font-bold font-headline focus:ring-0">
                <option>Atlético Nacional</option>
                <option>Sub-17 Nacional</option>
              </select>
              <input
                className="w-20 text-center text-3xl font-extrabold bg-background-secondary border-none rounded-xl py-4 focus:ring-2 focus:ring-primary shadow-sm"
                placeholder="0"
                type="number"
              />
              <p className="text-[10px] font-bold text-outline uppercase">
                Marcador Local
              </p>
            </div>
            <div className="text-2xl font-black text-outline opacity-30 font-headline italic">
              VS
            </div>
            {/* <!-- Away Team --> */}
            <div className="flex flex-col items-center gap-4 flex-1">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase">
                Equipo Visitante
              </label>
              <div className="w-24 h-24 rounded-lg bg-white flex items-center justify-center border-2 border-outline-variant/30 p-4 shadow-sm">
                <HugeiconsIcon
                  icon={Shield01Icon}
                  className="text-default/50"
                  size={50}
                />
              </div>
              <select className="bg-transparent border-none text-center font-bold font-headline focus:ring-0">
                <option>Seleccionar Rival...</option>
                <option>Independiente Medellín</option>
                <option>Millonarios FC</option>
              </select>
              <input
                className="w-20 text-center text-3xl font-extrabold bg-background-secondary border-none rounded-xl py-4 focus:ring-2 focus:ring-accent shadow-sm"
                placeholder="0"
                type="number"
              />
              <p className="text-[10px] font-bold text-outline uppercase">
                Marcador Visitante
              </p>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
