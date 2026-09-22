"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User, Send, CheckCircle2 } from "lucide-react";
import { mockContacts } from "@/lib/mock-data";
import { Institution } from "@/modules/portal/institutions/interfaces/institution.interface";

interface ContactClientProps {
  institution?: Institution;
}

export function ContactClient({ institution }: ContactClientProps) {
  const contacts = institution?.contacts?.length
    ? institution.contacts
    : mockContacts;

  const defaultContact = contacts.find((c) => c.isDefault) || contacts[0];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      <div className="mb-12 text-center md:mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-5xl font-700 uppercase tracking-tight text-primary sm:text-6xl"
        >
          Ponte en <span className="text-neon text-glow-neon">Contacto</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-muted-foreground mx-auto max-w-2xl text-lg"
        >
          Estamos aquí para ayudarte. Contáctate con la institución para más
          información sobre inscripciones, eventos o consultas generales.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Contact Information Cards */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <div className="rounded-3xl border border-border bg-card p-8 shadow-neon-soft relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-neon to-transparent" />
            <h2 className="font-heading text-2xl font-700 uppercase text-primary mb-6 flex items-center gap-3">
              <MapPin className="text-neon h-6 w-6" /> Ubicación Principal
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="font-500">
                {institution?.address || "Parque de la Unión Nacional"}
              </p>
              {!institution?.address && <p>Oruro, Bolivia</p>}
            </div>
            {/* Map iframe */}
            <div className="mt-6 aspect-video w-full rounded-xl bg-secondary/50 border border-border flex items-center justify-center relative overflow-hidden">
              <iframe
                src={
                  institution?.googleMapsUrl ||
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3822.4630232490584!2d-67.1147712!3d-17.9657801!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9157ba3a31c51921%3A0xc3c5d6e2e05952c1!2sParque%20de%20la%20Uni%C3%B3n%20Nacional!5e0!3m2!1ses!2sbo!4v1714529342415!5m2!1ses!2sbo"
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {contacts.map((contact, idx) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className={`rounded-2xl border ${contact.isDefault ? "border-neon/50 bg-neon/5" : "border-border bg-card"} p-6 transition-all hover:shadow-neon-soft hover:-translate-y-1`}
              >
                <div className="mb-4">
                  {contact.isDefault && (
                    <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-neon/20 px-2 py-0.5 text-[10px] font-700 uppercase tracking-wider text-neon">
                      <CheckCircle2 className="h-3 w-3" /> Principal
                    </span>
                  )}
                  <h3 className="font-heading text-lg font-700 uppercase text-primary">
                    {contact.department}
                  </h3>
                  {contact.contactName && (
                    <p className="text-sm font-600 text-muted-foreground mt-1 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" /> {contact.contactName}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-neon transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary group-hover:bg-neon/10 transition-colors">
                        <Phone className="h-4 w-4" />
                      </div>
                      {contact.phone}
                    </a>
                  )}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-neon transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary group-hover:bg-neon/10 transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="truncate">{contact.email}</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-xl"
        >
          <h2 className="font-heading text-3xl font-700 uppercase text-primary mb-8">
            Envíanos un Mensaje
          </h2>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-600 uppercase tracking-wide text-primary"
              >
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon"
                placeholder="Juan Pérez"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-600 uppercase tracking-wide text-primary"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon"
                placeholder="juan@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="department"
                className="text-sm font-600 uppercase tracking-wide text-primary"
              >
                Departamento a contactar
              </label>
              <select
                id="department"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon"
                defaultValue={defaultContact?.id}
              >
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-600 uppercase tracking-wide text-primary"
              >
                Tu Mensaje
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon"
                placeholder="¿En qué te podemos ayudar?"
              />
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-neon px-8 py-4 text-sm font-700 uppercase tracking-wider text-primary transition-all hover:bg-neon/90 hover:shadow-neon"
            >
              <span>Enviar Mensaje</span>
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
