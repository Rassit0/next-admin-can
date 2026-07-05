import { OlympicTorchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

export const HeaderPageLouncher = () => {
  return (
    <section className="mb-12 relative overflow-hidden rounded-[2rem] bg-linear-to-bl from-accent dark:from-accent  to-background-inverse dark:to-background p-12 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-[-20%] right-[-10%] w-125 h-125 bg-accent rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-75 h-75 bg-accent-container rounded-full blur-[80px]"></div>
      </div>
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-4">
          Bienvenido al Panel Administrativo de CAN
        </h2>
        <p className="text-lg text-accent-fixed opacity-90 font-body mb-8">
          Administre con precisión atlética. Supervise el crecimiento de
          nuestras academias, controle el flujo financiero y gestione la
          identidad digital del club desde un solo núcleo de control.
        </p>
        <div className="flex md:flex-row flex-col gap-4">
          <div className="bg-surface-container-lowest/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-accent-container rounded-xl">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                groups
              </span>
            </div>
            <div>
              <p className="text-2xl font-headline font-bold">1,284</p>
              <p className="text-xs text-accent-fixed">Socios Activos</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-tertiary-container rounded-xl">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                trending_up
              </span>
            </div>
            <div>
              <p className="text-2xl font-headline font-bold">+12%</p>
              <p className="text-xs text-accent-fixed">Crecimiento Mensual</p>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Abstract Sport Decoration --> */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none hidden lg:block">
        <HugeiconsIcon
          icon={OlympicTorchIcon}
          size={300}
          className="text-accent-fixed"
          style={{ fontVariationSettings: "'FILL' 1" }}
        />
      </div>
    </section>
  );
};
