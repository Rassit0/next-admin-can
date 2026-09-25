import { InstitutionContact } from "../interfaces/institution.interface";
import { Mail, Phone, UserCircle2, CheckCircle2 } from "lucide-react";

interface Props {
  contacts: InstitutionContact[];
}

export function InstitutionContacts({ contacts }: Props) {
  if (!contacts || contacts.length === 0) return null;

  return (
    <section className="py-16 bg-transparent relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-700 uppercase text-primary">
            Directorio de Contactos
          </h2>
          <p className="mt-2 text-muted-foreground">
            Comunícate con nuestros diferentes departamentos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`rounded-2xl border ${contact.isDefault ? "border-neon/50 bg-neon/5" : "border-border bg-card"} p-6 transition-all hover:shadow-neon-soft hover:-translate-y-1 group`}
            >
              <div className="mb-4">
                {contact.isDefault && (
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-neon/20 px-2 py-0.5 text-[10px] font-700 uppercase tracking-wider text-neon">
                    <CheckCircle2 className="h-3 w-3" /> Principal
                  </span>
                )}
                <h3 className="font-heading text-lg font-700 uppercase text-primary group-hover:text-neon transition-colors">
                  {contact.department}
                </h3>
                {contact.contactName && (
                  <p className="text-sm font-600 text-muted-foreground mt-1 flex items-center gap-1.5">
                    <UserCircle2 className="h-4 w-4" /> {contact.contactName}
                  </p>
                )}
              </div>

              <div className="space-y-3 mt-4">
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-3 text-sm font-600 text-muted-foreground hover:text-neon transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary group-hover:bg-neon/10 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-3 text-sm font-600 text-muted-foreground hover:text-neon transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary group-hover:bg-neon/10 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    {contact.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
