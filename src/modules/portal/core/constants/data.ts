export type NewsCategory =
  | "Volley"
  | "Frontón"
  | "Resultados"
  | "Institucional"
  | "Noticias"
  | "Eventos"
  | "Comunicados";

export interface TimelineNode {
  year: string;
  title: string;
  description: string;
}

export type SportGender = "Masculino" | "Femenino" | "Mixto";

export const stats = [
  { label: "Deportistas Activos", value: 1024, prefix: "+" },
  { label: "Equipos en Ligas", value: 52, prefix: "+" },
  { label: "Títulos Conquistados", value: 137, prefix: "+" },
  { label: "Años de Historia", value: 89, prefix: "" },
];

export const disciplines = [
  "Vóleibol",
  "Raqueta Frontón",
  "Atletismo",
  "Básquet",
  "Natacón",
  "Tenis",
];

export const heroDisciplines = [
  "Vóleibol",
  "Raqueta Frontón",
  "Atletismo",
  "Básquet de Alto Rendimiento",
  "Natacón Competitiva",
  "Tenis",
];

// (Removed news and NewsItem as they are now obsolete)

export const navItems = [
  "Inicio",
  "Noticias",
  "Institucón",
  "Equipos y Competicón",
  "Escuelas de Formacón",
] as const;

export type NavItem = (typeof navItems)[number];

export interface Course {
  id: string;
  name: string;
  discipline: string;
  minAge: number;
  maxAge: number;
  capacity: number;
  enrolled: number;
  schedule: string;
  professor: string;
  monthlyFee: number;
}

// ====== EXTENDED DATA LAYER FOR APP ROUTER ======

export interface CourseDetail extends Course {
  slug: string;
  description: string;
  weeklySchedule: string[];
  requirements: string[];
  professors: Array<{
    id: string;
    name: string;
    specialty: string;
    imageUrl?: string;
  }>;
  frequencyPerWeek: number;
  registrationFee: number;
}

export interface EventDetail {
  id: string;
  slug: string;
  title: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  discipline: string;
  category: string;
  description: string;
  countdownTargetDate: string;
  imageUrl: string;
}

export const findCourseBySlug = (slug: string): CourseDetail | undefined =>
  courseDetails.find((c) => c.slug === slug);

export const findEventById = (id: string): EventDetail | undefined =>
  eventDetails.find((e) => e.id === id);

// Extended course details with slugs and descriptions
export const courseDetails: CourseDetail[] = [
  {
    id: "c1",
    name: "Voleibol Sub-12",
    discipline: "Voleibol",
    minAge: 10,
    maxAge: 12,
    capacity: 12,
    enrolled: 9,
    schedule: "Lunes y Mércoles",
    professor: "Varios",
    frequencyPerWeek: 2,
    registrationFee: 1500,
    monthlyFee: 2500,
    slug: "volley-sub12",
    description:
      "Curso de voleibol para niños y niñas de 10 a 12 años. Aprenderemos los fundamentos del juego, técnica de pase, saque y remate. Una excelente introduccón al deporte colectivo con énfasis en el trabajo en equipo y el disfrute del juego.",
    weeklySchedule: ["Lunes 17:00-18:00", "Mércoles 17:00-18:00"],
    requirements: ["Ropa cómoda", "Zapatillas deportivas", "Botella de agua"],
    professors: [
      { id: "p1", name: "Martín Rodríguez", specialty: "Voleibol Base" },
      { id: "p2", name: "Lucía Fernández", specialty: "Técnica Ofensiva" },
    ],
  },
  {
    id: "c2",
    name: "Raqueta Frontón - Iniciacón",
    discipline: "Raqueta Frontón",
    minAge: 15,
    maxAge: 65,
    capacity: 8,
    enrolled: 6,
    schedule: "Martes y Jueves",
    professor: "Carlos López",
    frequencyPerWeek: 2,
    registrationFee: 2000,
    monthlyFee: 3200,
    slug: "fronton-iniciacion",
    description:
      "Initiation en Raqueta Frontón para principiantes de todas las edades. Este curso cubre las técnicas básicas, reglas del juego, y estrategia. Perfecta para quienes desean aprender un deporte único y desafiante en un ambiente amigable.",
    weeklySchedule: ["Martes 19:00-20:00", "Jueves 19:00-20:00"],
    requirements: [
      "Zapatos de cancha",
      "Ropa deportiva",
      "Casco (opcional, se provee)",
    ],
    professors: [
      {
        id: "p3",
        name: "Carlos López",
        specialty: "Raqueta Frontón Avanzado",
      },
    ],
  },
  {
    id: "c3",
    name: "Fútbol Sub-14",
    discipline: "Fútbol",
    minAge: 12,
    maxAge: 14,
    capacity: 15,
    enrolled: 10,
    schedule: "Martes y Viernes",
    professor: "Varios",
    frequencyPerWeek: 3,
    registrationFee: 1800,
    monthlyFee: 2800,
    slug: "futbol-sub14",
    description:
      "Fútbol para jóvenes de 12 a 14 años. Desarrollo de habilidades técnicas, tácticas de equipo, y acondicionamiento físico. Nuestro programa prepara jugadores tanto para jugar recreativamente como competitivamente.",
    weeklySchedule: ["Martes 18:00-19:30", "Viernes 18:00-19:30"],
    requirements: ["Botines de fútbol", "Shin guards", "Uniforme del club"],
    professors: [
      {
        id: "p4",
        name: "Diego Morales",
        specialty: "Técnica y Táctica de Fútbol",
      },
      { id: "p5", name: "Andrés Silva", specialty: "Preparacón Física" },
    ],
  },
];

// Event/Match details
export const eventDetails: EventDetail[] = [
  {
    id: "e1",
    slug: "clasico-vamos-2026-01-18",
    title: "Gran Clásico Inter-Clubes - Voleibol Senior Masculino",
    opponent: "Helsingfors",
    date: "18 de enero",
    time: "20:30",
    location: "Polideportivo Principal",
    venue: "Cancha Central",
    discipline: "Voleibol",
    category: "Senior Masculino",
    description:
      "Enfrentamiento histórico entre dos grandes potencias del voleibol metropolitano. Un partido que promete intensidad, emocón y espectáculo. Entrada libre para miembros del club. Transmisón en vivo.",
    countdownTargetDate: "2026-01-18T20:30:00",
    imageUrl: "/news-volley-champions.png",
  },
  {
    id: "e2",
    slug: "torneo-masters-fronton-2026",
    title: "Torneo de Raqueta Frontón - Categoría Máster",
    opponent: "Participantes Varios",
    date: "25 de enero",
    time: "15:00",
    location: "Cancha de Raqueta Frontón",
    venue: "Cancha 1 y 2",
    discipline: "Raqueta Frontón",
    category: "Máster 45+",
    description:
      "Torneo interno para jugadores mayores de 45 años. Una oportunidad para disfrutar del deporte en un ambiente competitivo pero amigable. Arancel: $500. Consultar inscripciones en secretaría.",
    countdownTargetDate: "2026-01-25T15:00:00",
    imageUrl: "/news-fronton-podium.png",
  },
];
