import { Card } from "@heroui/react";

export const MetricsPanel = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="col-span-1 border-l-4 border-accent p-6">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
          Total Escuelas
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-headline font-black text-on-surface">
            24
          </span>
          <span className="text-tertiary font-bold text-xs">+2 este mes</span>
        </div>
      </Card>
      <Card className="col-span-1 p-6">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
          Cursos Activos
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-headline font-black text-on-surface">
            118
          </span>
          <span className="text-primary font-bold text-xs">88% Capacidad</span>
        </div>
      </Card>
      <Card className="col-span-1 p-6">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
          Inscripciones Mes
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-headline font-black text-on-surface">
            432
          </span>
          <span className="material-symbols-outlined text-tertiary text-sm">
            trending_up
          </span>
        </div>
      </Card>
      <Card className="col-span-1 p-6">
        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">
          Ingresos Proyectados
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-headline font-black">$12.4M</span>
          <span className="text-white/80 text-[10px]">COP</span>
        </div>
      </Card>
    </section>
  );
};
