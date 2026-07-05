import { AddModal } from "@/modules/roles";
import { HeaderPage } from "@/ui";

export default function NamePage() {
  return (
    <>
      <div className="space-y-8">
        {/* <!-- Dashboard Header --> */}
        <HeaderPage
          title="Gestión de Roles"
          description="Define los permisos y el alcance de cada integrante del club."
        >
          <AddModal />
        </HeaderPage>
        {/* <!-- Bento Grid Layout for Stats --> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-default p-6 rounded-[1.5rem] relative overflow-hidden group hover:bg-defaultest transition-colors duration-500">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all"></div>
            <p className="text-default-foreground text-sm font-bold uppercase tracking-widest mb-1">
              Total Miembros
            </p>
            <h3 className="text-3xl font-black text-accent">1,248</h3>
            <div className="mt-4 flex items-center text-xs font-bold text-tertiary">
              <span className="material-symbols-outlined text-sm mr-1">
                trending_up
              </span>
              +12% este mes
            </div>
          </div>
          <div className="bg-default p-6 rounded-[1.5rem] relative overflow-hidden group hover:bg-defaultest transition-colors duration-500">
            <p className="text-default-foreground text-sm font-bold uppercase tracking-widest mb-1">
              Roles Activos
            </p>
            <h3 className="text-3xl font-black text-on-surface">5/5</h3>
            <div className="mt-4 flex items-center text-xs font-bold text-slate-400">
              Consistencia operacional: 100%
            </div>
          </div>
          <div className="bg-default p-6 rounded-[1.5rem] relative overflow-hidden group hover:bg-defaultest transition-colors duration-500">
            <p className="text-default-foreground text-sm font-bold uppercase tracking-widest mb-1">
              Última Actualización
            </p>
            <h3 className="text-xl font-bold text-on-surface">Hace 2 horas</h3>
            <p className="text-xs text-slate-400 mt-2">Por: Admin_Central</p>
          </div>
        </div>
        {/* <!-- Roles Table Container --> */}
        <div className="bg-defaultest rounded-[2rem] shadow-[0px_12px_32px_rgba(25,28,29,0.06)] overflow-hidden">
          <div className="p-8 flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1 h-6 bg-accent rounded-full"></span>
              Listado de Roles Maestros
            </h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-default text-on-surface-variant hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
              <button className="p-2 rounded-lg bg-default text-on-surface-variant hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-default/50">
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-default-foreground">
                    Nombre del Rol
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-default-foreground">
                    Descripción Operativa
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-default-foreground text-right">
                    Miembros
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-default-foreground">
                    Estado
                  </th>
                  <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-default-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                <tr className="hover:bg-default transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-on-surface">
                        Profesor
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-on-surface-variant max-w-xs">
                    Responsable de formación técnica y académica en las
                    divisiones menores.
                  </td>
                  <td className="px-8 py-6 text-right font-headline font-bold text-on-surface">
                    42
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold">
                      Activo
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="text-slate-400 hover:text-accent transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-default transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-on-surface">Jugador</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-on-surface-variant max-w-xs">
                    Atletas de alto rendimiento inscritos en las planillas
                    oficiales.
                  </td>
                  <td className="px-8 py-6 text-right font-headline font-bold text-on-surface">
                    850
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold">
                      Activo
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="text-slate-400 hover:text-accent transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-default transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-on-surface">
                        Estudiante
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-on-surface-variant max-w-xs">
                    Miembros de la cantera en procesos iniciales de aprendizaje.
                  </td>
                  <td className="px-8 py-6 text-right font-headline font-bold text-on-surface">
                    320
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold">
                      Activo
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="text-slate-400 hover:text-accent transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-default transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-on-surface">
                        Staff Técnico
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-on-surface-variant max-w-xs">
                    Personal de apoyo: fisioterapeutas, analistas y
                    nutricionistas.
                  </td>
                  <td className="px-8 py-6 text-right font-headline font-bold text-on-surface">
                    24
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-default text-slate-400 rounded-full text-xs font-bold">
                      Inactivo
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="text-slate-400 hover:text-accent transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-default transition-colors group border-none">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-on-surface">
                        Administrativo
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-on-surface-variant max-w-xs">
                    Gestores de oficina, finanzas y operaciones del club.
                  </td>
                  <td className="px-8 py-6 text-right font-headline font-bold text-on-surface">
                    12
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold">
                      Activo
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="text-slate-400 hover:text-accent transition-colors">
                      <span className="material-symbols-outlined">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
