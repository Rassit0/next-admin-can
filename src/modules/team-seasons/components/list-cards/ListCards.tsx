import { ITeamSeason } from "@/modules/team-seasons";
import { Button, Card } from "@heroui/react";
import {
  ImageNotFound01Icon,
  Money03Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CardTeamSeason } from "./Card";
interface Props {
  teamSeasons: ITeamSeason[];
  urlBase: string;
}

export const ListCards = ({ teamSeasons, urlBase }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {teamSeasons.map((teamSeason) => (
        <CardTeamSeason
          key={teamSeason.id}
          teamSeason={teamSeason}
          urlBase={urlBase}
        />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {/* <!-- State: ACTIVO (Active) --> */}
      <Card className="p-0 overflow-hidden card-hover flex flex-col group shadow-sm">
        <div className="h-52 relative overflow-hidden">
          <img
            alt="Hawaiian Waves"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdnoetj5j2XzJ4YuyxPOW9ygEnipikr9HW2Ws685WzidbfCMuf7oyHv1dPCkWMH3GBc7oW5pjhSwp090-CscKqqUhTwS18FYDOcFyFKRT8XymaR3Sgnjc91-qHv3L2ay9hL-pmILP7EJiiQ6hhh2-LaTDArakpVrCk_-KTeU8lDCIpoxGx4573NRqqyLK_fbEAfKmG1SM8YlugZptSlVr5ImQPVoTjSSlp4vULzIsoJUcN0hPnG_hr5S4SnzZUip_3gexcwcH_rBe8"
          />
          <div className="absolute top-4 right-4 bg-success text-white font-label-sm px-4 py-1.5 rounded-full uppercase flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Activo
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-display text-headline-md text-primary mb-1">
            Hawaiian Waves 2024
          </h3>
          <p className="text-on-surface-variant text-sm mb-6 italic opacity-80">
            "Ohana significa familia, y ningún jugador se queda atrás."
          </p>
          <div className="space-y-4 mb-8">
            <div>
              <div className="flex justify-between text-[10px] font-label-sm mb-1 uppercase text-outline">
                Ocupación del Clan
              </div>
              <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 shimmer-bar rounded-full w-[80%]"></div>
              </div>
              <div className="flex justify-between text-[10px] mt-1 font-label-sm text-on-surface-variant">
                <span>Capacidad: 40</span>
                <span className="text-primary font-bold">32 Atletas</span>
              </div>
            </div>
          </div>
          <div className="mt-auto space-y-3">
            <Button
              size="lg"
              className="w-full bg-pink-500 text-white font-extrabold text-md pulse-pink shadow-lg shadow-pink-500/20 hover:scale-[1.02] hover:cursor-pointer active:scale-95 transition-all"
            >
              Inscribir Atleta
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="lg" className="w-full">
                <HugeiconsIcon icon={UserGroupIcon} />
                <span className="text-xs font-bold">Miembros</span>
              </Button>
              <Button variant="secondary" size="lg" className="w-full">
                <HugeiconsIcon icon={Money03Icon} />
                <span className="text-xs font-bold">Planes</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
      {/* <!-- State: ACTIVO - FULL CAPACITY (Cupos Llenos) --> */}
      <Card className="p-0 overflow-hidden card-hover flex flex-col group shadow-sm">
        <div className="h-52 relative overflow-hidden">
          <img
            alt="Tropical Pulse"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXYvlQzmgpPZSjtXnosaghC-FD_7Gki61-uuhrCp_fkdHpu50q1stQJiGyXPOsUPWKjVsoPQ1JJdXUDhMm86y15dC0xCmsO-wVNJH_Q2VvT42KOavcSaucIv5FAWVeNEhlSof1xI0DeXlHfpEcCEaifXeZZhjqEfHrq4sE5twXA4KBLzGOx7LA72_8XDsybLAxbYS3Ops9sPtqSZMTHRjB9GvH4c5w-bPSSvROJ8QIsQ_tG0ldVT-OOA_f-Mkw-wBEKt4a28wf8AXy"
          />
          <div className="absolute top-4 right-4 bg-success text-white font-label-sm px-4 py-1.5 rounded-full uppercase flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            Activo
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-display text-headline-md text-primary mb-1">
            Tropical Pulse
          </h3>
          <p className="text-on-surface-variant text-sm mb-6 italic opacity-80">
            "El ritmo del juego es el latido de nuestro hogar."
          </p>
          <div className="space-y-4 mb-8">
            <div>
              <div className="flex justify-between text-[10px] font-label-sm mb-1 uppercase text-outline">
                Ocupación del Clan
              </div>
              <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 bg-accent rounded-full w-full"></div>
              </div>
              <div className="flex justify-between text-[10px] mt-1 font-label-sm text-error font-bold">
                <span>Capacidad: 25</span>
                <span>¡MAXIMA CAPACIDAD!</span>
              </div>
            </div>
          </div>
          <div className="mt-auto space-y-3">
            <Button className="w-full py-3.5 bg-outline-variant/40 text-on-surface-variant/50 rounded-full font-extrabold text-md cursor-not-allowed border border-outline-variant/20">
              ¡Cupos Llenos!
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" className="w-full">
                <HugeiconsIcon icon={UserGroupIcon} />
                <span className="text-xs font-bold">Miembros</span>
              </Button>
              <Button variant="secondary" className="w-full">
                <HugeiconsIcon icon={Money03Icon} />
                <span className="text-xs font-bold">Planes</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
      {/* <!-- State: BORRADOR (Draft) --> */}
      <Card className="p-0 overflow-hidden card-hover flex flex-col group shadow-sm">
        <div className="h-52 relative overflow-hidden bg-surface-container-high">
          <div className="w-full h-full flex items-center justify-center text-outline/30">
            <HugeiconsIcon icon={ImageNotFound01Icon} size={100} />
          </div>
          <div className="absolute top-4 right-4 bg-orange-100 text-orange-800 font-label-sm px-4 py-1.5 rounded-full uppercase border border-orange-200 shadow-sm">
            Borrador
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-display text-headline-md text-on-surface mb-1">
            Galaxy Smash Cup
          </h3>
          <p className="text-on-surface-variant text-sm mb-6 italic opacity-80">
            Configurando parámetros de la liga...
          </p>
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-surface-container rounded-full border border-outline-variant/20 border-dashed">
              <p className="text-xs text-outline text-center">
                Faltan detalles por definir para activar esta temporada.
              </p>
            </div>
          </div>
          <div className="mt-auto space-y-3">
            <Button className="w-full py-3.5 bg-primary text-white rounded-full font-extrabold text-md hover:bg-primary-container transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">edit</span>
              Editar Temporada
            </Button>
            <Button className="w-full py-2.5 text-error font-bold text-xs hover:bg-error-container/20 rounded-full transition-all">
              Eliminar Borrador
            </Button>
          </div>
        </div>
      </Card>
      {/* <!-- State: FINALIZADO (History) --> */}
      <div className="glass-panel rounded-lg overflow-hidden card-hover flex flex-col group shadow-sm border-l-4 border-outline-variant/50 relative">
        <div className="finished-grayscale flex flex-col h-full">
          <div className="h-52 relative overflow-hidden">
            <img
              alt="Intergalactic Smash"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAUPSrWMVoUX42CuWwaRYh20OR_2g_PfT6rlbFadghkVMcCCcjKOd0Ud_UuueG4B6r8Glsm7t7JwbKMOck7V8lwKUBsfU2J7Ip-GZvPpz--byb3K2ow8uj0NA32945LNB-cjYyWffguN5D1FVSNfPXC27WtrIeRMLRLdSApgTK8ryWzjuspnDc8xujTLN0nslPqSDXvK_MNz32Bfs9FPjuK8RURiIEhQhmTxVZbiQEnwkdGcDytpCOAviO10lBqNOA8GBXy39OOR3Y"
            />
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="font-display text-headline-md text-outline mb-1">
              Intergalactic Smash 2023
            </h3>
            <p className="text-outline text-sm mb-6 italic opacity-80">
              "La fuerza del equipo reside en cada experimento individual."
            </p>
            <div className="mt-auto space-y-3">
              <Button className="w-full py-3.5 bg-surface-container-highest text-on-surface-variant rounded-full font-bold text-md flex items-center justify-center gap-2 hover:bg-surface-variant transition-all">
                <span className="material-symbols-outlined text-lg">
                  assessment
                </span>
                Ver Reporte / Estadísticas
              </Button>
              <Button className="w-full py-3.5 bg-surface-container-highest text-on-surface-variant rounded-full font-bold text-md flex items-center justify-center gap-2 hover:bg-surface-variant transition-all">
                <span className="material-symbols-outlined text-lg">
                  visibility
                </span>
                Ver Miembros
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-outline-variant/80 backdrop-blur-md text-white font-label-sm px-4 py-1.5 rounded-full uppercase shadow-md z-10">
          Finalizado / Historial
        </div>
      </div>
    </div>
  );
};
