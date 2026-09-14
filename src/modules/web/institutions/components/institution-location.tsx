import { Institution, Location } from "../interfaces/institution.interface";
import { MapPin, Navigation } from "lucide-react";

interface Props {
  institution: Institution;
  locations: Location[];
}

export function InstitutionLocation({ institution, locations }: Props) {
  return (
    <section className="py-16 bg-transparent relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h2 className="font-heading text-3xl font-700 uppercase text-oxford mb-6">
              Nuestras Instalaciones
            </h2>
            <p className="text-muted-foreground mb-8 text-lg font-500 leading-relaxed">
              Descubre los espacios donde formamos campeones. Nuestras
              instalaciones cuentan con todo lo necesario para el desarrollo
              óptimo de cada disciplina.
            </p>

            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-neon-soft relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-neon to-transparent" />
                <h3 className="font-heading text-2xl font-700 uppercase text-oxford mb-6 flex items-center gap-3">
                  <MapPin className="text-neon h-6 w-6" /> Sede Principal
                </h3>
                <div className="flex items-start gap-3 text-sm font-500 text-muted-foreground">
                  <p>{institution.address}</p>
                </div>
                {institution.googleMapsUrl && (
                  <a
                    href={institution.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-700 uppercase tracking-wide text-oxford bg-neon hover:bg-neon/90 hover:shadow-neon transition-all px-4 py-2 rounded-full"
                  >
                    <Navigation className="w-4 h-4" /> Ver en Google Maps
                  </a>
                )}
              </div>

              {locations?.map((loc) => (
                <div
                  key={loc.id}
                  className="rounded-3xl border border-border bg-card p-8 transition-all hover:shadow-neon-soft group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-linear-to-r group-hover:from-neon group-hover:to-transparent transition-colors" />
                  <h3 className="font-heading text-xl font-700 uppercase text-oxford mb-4 flex items-center gap-3">
                    <MapPin className="text-muted-foreground h-5 w-5 group-hover:text-neon transition-colors" />{" "}
                    {loc.name}
                  </h3>
                  <div className="flex items-start gap-3 text-sm font-500 text-muted-foreground">
                    <p>{loc.address}</p>
                  </div>
                  {loc.description && (
                    <p className="mt-3 text-xs text-muted-foreground/80">
                      {loc.description}
                    </p>
                  )}
                  {loc.googleMapsUrl && (
                    <a
                      href={loc.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-600 text-neon hover:text-neon/80 transition-colors"
                    >
                      <Navigation className="w-3 h-3" /> Cómo llegar
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Map Placeholder or iframe */}
            <div className="w-full h-100 lg:h-full min-h-125 rounded-3xl overflow-hidden relative shadow-xl">
              {institution.googleMapsUrl ? (
                <iframe
                  src={institution.googleMapsUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <MapPin className="w-16 h-16 opacity-50" />
                </div>
              )}
              {/* Optional overlay gradient for styling */}
              <div className="absolute inset-0 bg-linear-to-tr from-oxford/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
