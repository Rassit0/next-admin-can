import { HeaderPage } from "@/ui";
import {
  Basketball01Icon,
  Calendar02Icon,
  Calendar04Icon,
  Download01Icon,
  Dumbbell01Icon,
  PaymentSuccess01Icon,
  PaymentSuccess02Icon,
  PropertyEditIcon,
  SaveIcon,
  Tick02Icon,
  TradeUpFreeIcons,
  TransactionHistoryIcon,
  UserAdd02Icon,
  VolleyballIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function DashboardPage() {
  return (
    <>
      {/* <!-- Header Section --> */}
      <HeaderPage
        title="Panel de Control"
        description="Bienvenido de nuevo. Resumen de hoy."
      >
        <button className="flex-1 md:flex-none px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
          <HugeiconsIcon icon={Calendar04Icon} size={20} /> Septiembre 2023
        </button>
        <button className="flex-1 md:flex-none px-4 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all">
          <HugeiconsIcon icon={Download01Icon} size={20} /> Reporte
        </button>
      </HeaderPage>
      {/* <!-- Key Metrics Grid / Widgets --> */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* <!-- Widget 1 --> */}
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 active:scale-95 transition-transform md:active:scale-100 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="p-2.5 bg-accent/50 rounded-xl text-primary md:order-2">
              <HugeiconsIcon icon={UserAdd02Icon} />
            </div>
            <div className="md:order-1">
              <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                Alumnos
              </p>
              <h3 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">
                1,284
              </h3>
              <span className="text-[10px] font-bold text-tertiary px-2 py-0.5 bg-tertiary-fixed rounded-full inline-block mt-2">
                +12%
              </span>
            </div>
          </div>
        </div>
        {/* <!-- Widget 2 --> */}
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 active:scale-95 transition-transform md:active:scale-100 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="p-2.5 bg-default/50 rounded-xl text-secondary md:order-2">
              <HugeiconsIcon icon={PaymentSuccess02Icon} />
            </div>
            <div className="md:order-1">
              <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                Ingresos
              </p>
              <h3 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">
                $4.2M
              </h3>
              <span className="text-[10px] font-bold text-tertiary px-2 py-0.5 bg-tertiary-fixed rounded-full inline-block mt-2">
                +5.4%
              </span>
            </div>
          </div>
        </div>
        {/* <!-- Widget 3 --> */}
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 active:scale-95 transition-transform md:active:scale-100 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="p-2.5 bg-yellow-300/30 rounded-xl text-tertiary md:order-2">
              <HugeiconsIcon icon={Dumbbell01Icon} />
            </div>
            <div className="md:order-1">
              <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                Entrenos
              </p>
              <h3 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">
                24
              </h3>
              <p className="text-[10px] text-sky-600 font-bold mt-2">8 Hoy</p>
            </div>
          </div>
        </div>
        {/* <!-- Widget 4 --> */}
        <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 active:scale-95 transition-transform md:active:scale-100 relative overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="p-2.5 bg-danger/10 rounded-xl text-error md:order-2">
              <HugeiconsIcon icon={TradeUpFreeIcons} />
            </div>
            <div className="md:order-1">
              <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                Asistencia
              </p>
              <h3 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">
                92%
              </h3>
              <div className="w-12 md:w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-3">
                <div className="bg-primary h-full w-[92%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Content Stack (Responsive Bento) --> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* <!-- Training Calendar --> */}
        <section className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg md:text-xl font-bold font-headline text-on-surface flex items-center gap-2">
                <HugeiconsIcon icon={Calendar02Icon} className="text-accent" />
                Entrenamientos
              </h3>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-[10px] font-bold rounded-full">
                  Básquet
                </span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">
                  Vóley
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {/* <!-- Entry 1 --> */}
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl active:bg-slate-100 dark:active:bg-slate-800 transition-colors">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-sky-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-sky-700">
                    HOY
                  </span>
                  <span className="text-lg font-bold text-sky-900 dark:text-sky-400">
                    14
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-on-surface">
                    U17 Básquetbol - Masculino
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    16:30 • Mario Silva
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-300">
                  chevron_right
                </span>
              </div>
              {/* <!-- Entry 2 --> */}
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl active:bg-slate-100 dark:active:bg-slate-800 transition-colors">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-purple-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-purple-700">
                    HOY
                  </span>
                  <span className="text-lg font-bold text-purple-900 dark:text-purple-400">
                    14
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-on-surface">
                    Primera Vóley - Femenino
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    19:00 • Elena Rossi
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-300">
                  chevron_right
                </span>
              </div>
              {/* <!-- Entry 3 (Hidden on very small mobile to save space) --> */}
              <div className="hidden sm:flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-sky-100 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-sky-700">
                    MAÑ
                  </span>
                  <span className="text-lg font-bold text-sky-900 dark:text-sky-400">
                    15
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-on-surface">
                    U13 Básquetbol - Mixto
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    10:00 • Pablo Méndez
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-300">
                  chevron_right
                </span>
              </div>
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-500 rounded-2xl text-xs font-bold active:bg-slate-50 dark:active:bg-slate-800">
              Ver calendario completo
            </button>
          </div>
        </section>
        {/* <!-- Recent Activity --> */}
        <section className="space-y-4">
          <div className="bg-default p-6 md:p-8 rounded-3xl shadow-xl h-full text-default-foreground">
            <h3 className="text-xl font-bold font-headline mb-8 flex items-center gap-2">
              <HugeiconsIcon
                icon={TransactionHistoryIcon}
                className="text-accent"
              />
              Actividad
            </h3>
            <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {/* <!-- Activity 1 --> */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
                  <HugeiconsIcon icon={Tick02Icon} size={18} strokeWidth={2} />
                </div>
                <p className="text-sm font-bold">Inscripción</p>
                <p className="text-xs text-slate-400">
                  Facundo García a Básquet U17.
                </p>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                  Hace 12m
                </span>
              </div>
              {/* <!-- Activity 2 --> */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <HugeiconsIcon
                    icon={PaymentSuccess01Icon}
                    size={18}
                    strokeWidth={2}
                  />
                </div>
                <p className="text-sm font-bold">Pago</p>
                <p className="text-xs text-slate-400">
                  Cuota Septiembre - Martina López.
                </p>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                  Hace 45m
                </span>
              </div>
              {/* <!-- Activity 3 --> */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center ">
                  <HugeiconsIcon
                    icon={PropertyEditIcon}
                    size={18}
                    strokeWidth={2}
                  />
                </div>
                <p className="text-sm font-bold">Reprogramado</p>
                <p className="text-xs text-slate-400">
                  Vóley Femenino pasó a las 19:00.
                </p>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                  Hace 2h
                </span>
              </div>
            </div>
            {/* <div className="mt-12 p-5 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sky-400">
                    sports_score
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold">Ocupación</h4>
                  <p className="text-[10px] text-slate-400">85% Hoy</p>
                </div>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full w-[85%]"></div>
              </div>
            </div> */}
          </div>
        </section>
      </div>
      {/* <!-- Schools Quick Look --> */}
      <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg md:text-xl font-bold font-headline text-on-surface">
            Escuelas
          </h3>
          <button className="text-primary text-xs font-bold flex items-center gap-1">
            Gestionar{" "}
            <span className="material-symbols-outlined text-sm">
              open_in_new
            </span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-sky-600 text-white rounded-full flex items-center justify-center">
              <HugeiconsIcon icon={Basketball01Icon} className="text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-on-surface">Básquetbol</p>
              <p className="text-[11px] text-slate-500">420 Alumnos</p>
            </div>
            <span className="text-xs font-bold text-tertiary">+4%</span>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">
              <HugeiconsIcon icon={VolleyballIcon} className="text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-on-surface">Vóleibol</p>
              <p className="text-[11px] text-slate-500">315 Alumnos</p>
            </div>
            <span className="text-xs font-bold text-tertiary">+8%</span>
          </div>
          {/* <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">pool</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-on-surface">Natación</p>
              <p className="text-[11px] text-slate-500">549 Alumnos</p>
            </div>
            <span className="text-xs font-bold text-slate-400">--</span>
          </div> */}
        </div>
      </section>
      {/* <!-- Floating Confirmation Button (Action Contextual) --> */}
      <button className="hidden fixed bottom-28 right-6 bg-accent text-white p-4 rounded-2xl shadow-xl flex items-center gap-2 active:scale-90 transition-transform z-40">
        <HugeiconsIcon icon={SaveIcon} />
        {/* <span className="font-headline font-bold uppercase tracking-wider text-xs">
                Guardar Asistencia
              </span> */}
      </button>
    </>
  );
}
