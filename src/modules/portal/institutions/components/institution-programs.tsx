import { Club, School } from "../interfaces/institution.interface";

interface Props {
  clubs: Club[];
  schools: School[];
}

export function InstitutionPrograms({ clubs, schools }: Props) {
  if (!clubs?.length && !schools?.length) return null;

  return (
    <section className="py-16 bg-transparent relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        {clubs?.length > 0 && (
          <div className="mb-16">
            <h2 className="font-heading text-3xl font-700 uppercase text-primary mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-neon rounded-full inline-block"></span>
              Nuestros Equipos Oficiales
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-neon-soft hover:-translate-y-1 group"
                >
                  <div
                    className="text-4xl group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{
                      __html: club.discipline.icon || "Ã°ÂÂÂ",
                    }}
                  />
                  <div>
                    <h3 className="font-heading text-lg font-700 uppercase text-primary group-hover:text-neon transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-sm font-600 text-muted-foreground mt-1 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon inline-block"></span>
                      {club.discipline.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {schools?.length > 0 && (
          <div>
            <h2 className="font-heading text-3xl font-700 uppercase text-primary mb-8 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-neon rounded-full inline-block"></span>
              Academias de Formación
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {schools.map((school) => (
                <div
                  key={school.id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-neon-soft hover:-translate-y-1 group"
                >
                  <div
                    className="text-4xl group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{
                      __html: school.discipline.icon || "Ã°ÂÂÂ",
                    }}
                  />
                  <div>
                    <h3 className="font-heading text-lg font-700 uppercase text-primary group-hover:text-neon transition-colors">
                      {school.name}
                    </h3>
                    <p className="text-sm font-600 text-muted-foreground mt-1 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon inline-block"></span>
                      {school.discipline.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
