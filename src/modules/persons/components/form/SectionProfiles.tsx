import { Button } from "@heroui/react";
import {
  Add01Icon,
  BasketballIcon,
  BookIcon,
  Delete01Icon,
  Dumbbell01Icon,
  IdentityCardIcon,
  Mortarboard02Icon,
  VolleyballIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

export const SectionProfiles = () => {
  return (
    <div className="w-full md:w-2/3 p-8 space-y-10">
      {/* <!-- Jugador Profiles --> */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-on-surface leading-none">
              Perfiles de Jugador
            </h3>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Disciplinas competitivas activas
            </p>
          </div>
          <Button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-primary font-bold text-xs rounded-full transition-colors">
            <HugeiconsIcon icon={Add01Icon} className="text-sm" /> Asignar
            Disciplina
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* <!-- Card: Jugador Basket --> */}
          <div className="bg-background p-4 rounded-xl relative group border-l-4 border-primary">
            <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-error hover:bg-error-container/20 rounded transition-all">
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <HugeiconsIcon icon={BasketballIcon} className="text-lg" />
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface">
                  Básquetbol
                </div>
                <div className="text-[10px] text-on-surface-variant uppercase font-black tracking-wider">
                  Sub-18 Masculino
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-white/50 p-2 rounded">
                <div className="text-[10px] text-on-surface-variant uppercase">
                  Posición
                </div>
                <div className="text-xs font-bold">Base (Point Guard)</div>
              </div>
              <div className="bg-white/50 p-2 rounded">
                <div className="text-[10px] text-on-surface-variant uppercase">
                  Dorsal
                </div>
                <div className="text-xs font-bold text-sky-700">#07</div>
              </div>
            </div>
          </div>
          {/* <!-- Card: Jugador Voley --> */}
          <div className="bg-background p-4 rounded-xl relative group border-l-4 border-primary">
            <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-error hover:bg-error-container/20 rounded transition-all">
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <HugeiconsIcon icon={VolleyballIcon} className="text-lg" />
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface">
                  Vóleibol
                </div>
                <div className="text-[10px] text-on-surface-variant uppercase font-black tracking-wider">
                  Juvenil A
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-white/50 p-2 rounded">
                <div className="text-[10px] text-on-surface-variant uppercase">
                  Posición
                </div>
                <div className="text-xs font-bold">Libero</div>
              </div>
              <div className="bg-white/50 p-2 rounded">
                <div className="text-[10px] text-on-surface-variant uppercase">
                  Dorsal
                </div>
                <div className="text-xs font-bold text-sky-700">#12</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Estudiante Profiles --> */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-on-surface leading-none">
              Perfiles de Estudiante
            </h3>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Formación académica y deportiva
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-tertiary-container/10 text-tertiary font-bold text-xs rounded-full hover:bg-tertiary-container/20 transition-colors">
            <HugeiconsIcon icon={Mortarboard02Icon} />
            Matricular Programa
          </button>
        </div>
        <div className="bg-background rounded-xl p-6 border-l-4 border-tertiary">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-tertiary-fixed text-tertiary rounded-xl flex items-center justify-center">
                <HugeiconsIcon icon={BookIcon} className="text-2xl" />
              </div>
              <div>
                <div className="font-bold text-on-surface">
                  Táctica Aplicada al Fútbol
                </div>
                <div className="text-xs text-on-surface-variant">
                  Escuela de Verano CAN - Módulo II
                </div>
                <div className="flex gap-4 mt-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-tertiary-fixed-dim/30 rounded text-tertiary uppercase tracking-tighter">
                    Turno: Mañana
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-tertiary-fixed-dim/30 rounded text-tertiary uppercase tracking-tighter">
                    Ciclo: 2024-B
                  </span>
                </div>
              </div>
            </div>
            <Button isIconOnly variant="danger-soft">
              <HugeiconsIcon icon={Delete01Icon} />
            </Button>
          </div>
        </div>
      </section>
      {/* <!-- Profesor Profiles --> */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-on-surface leading-none">
              Perfiles de Profesor
            </h3>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Roles de instrucción y liderazgo
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-container/30 text-secondary font-bold text-xs rounded-full hover:bg-secondary-container/50 transition-colors">
            <HugeiconsIcon icon={IdentityCardIcon} />
            Asignar Rol Docente
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-4 bg-background 0 rounded-xl border-l-4 border-secondary">
            <div className="flex items-center gap-4">
              <HugeiconsIcon icon={Dumbbell01Icon} className="text-secondary" />
              <div>
                <div className="text-sm font-bold">
                  Preparador Físico - Atletismo
                </div>
                <div className="text-[10px] text-on-surface-variant uppercase font-bold">
                  Categoría: Senior Elite
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[10px] text-on-surface-variant uppercase">
                  Licencia
                </div>
                <div className="text-xs font-mono font-bold">FEF-2023-991</div>
              </div>
              <button className="p-1.5 hover:bg-secondary-fixed/50 rounded-lg text-secondary">
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
