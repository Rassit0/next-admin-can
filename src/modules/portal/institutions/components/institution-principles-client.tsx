"use client";

import { motion } from "framer-motion";
import { Target, Eye, Heart, Shield, Star, Users } from "lucide-react";

const principles = [
  {
    id: 1,
    title: "Misión",
    icon: Target,
    description: "Fomentar el desarrollo integral de nuestros atletas a través de la práctica deportiva de alto rendimiento, inculcando disciplina, trabajo en equipo y valores éticos que trasciendan más allá del campo de juego.",
  },
  {
    id: 2,
    title: "Visión",
    icon: Eye,
    description: "Ser reconocidos a nivel nacional e internacional como el club líder en formación deportiva y competitividad, marcando un estándar de excelencia y siendo un referente de innovación y pasión por el deporte.",
  }
];

const values = [
  {
    name: "Pasión",
    icon: Heart,
    desc: "Entregamos el corazón en cada entrenamiento y competencia."
  },
  {
    name: "Integridad",
    icon: Shield,
    desc: "Actuamos con honestidad, transparencia y respeto."
  },
  {
    name: "Excelencia",
    icon: Star,
    desc: "Buscamos constantemente la mejora y el máximo rendimiento."
  },
  {
    name: "Compañerismo",
    icon: Users,
    desc: "Trabajamos unidos como una verdadera familia deportiva."
  }
];

export function InstitutionPrinciplesClient() {
  return (
    <>
      <div className="mb-12 text-center md:mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-5xl font-700 uppercase tracking-tight text-primary sm:text-6xl"
        >
          Nuestros <span className="text-neon text-glow-neon">Principios</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-muted-foreground mx-auto max-w-2xl text-lg uppercase tracking-widest font-600"
        >
          La base de nuestra grandeza
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {principles.map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="rounded-3xl border border-border bg-card p-8 transition-all hover:shadow-neon-soft group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-linear-to-r group-hover:from-neon group-hover:to-transparent transition-colors" />
            <div className="inline-flex items-center justify-center rounded-full bg-neon/10 p-4 text-neon mb-6">
              <p.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="font-heading text-3xl font-700 uppercase text-primary mb-4 group-hover:text-neon transition-colors">
              {p.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-500">
              {p.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-heading text-3xl font-700 uppercase text-primary mb-8 flex items-center gap-3 justify-center md:justify-start"
        >
          <span className="w-1.5 h-8 bg-neon rounded-full inline-block"></span>
          Nuestros Valores
        </motion.h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-neon-soft hover:-translate-y-1 group"
            >
              <v.icon className="w-8 h-8 text-neon mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-heading text-xl font-700 uppercase text-primary mb-2 group-hover:text-neon transition-colors">
                {v.name}
              </h3>
              <p className="text-sm font-500 text-muted-foreground">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
