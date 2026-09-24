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
  { label: "Ti­tulos Conquistados", value: 137, prefix: "+" },
  { label: "Ai±os de Historia", value: 89, prefix: "" },
];

export const disciplines = [
  "Vóleibol",
  "Raqueta Frontón",
  "Atletismo",
  "Bi¡squet",
  "Natación",
  "Tenis",
];

export const heroDisciplines = [
  "Vóleibol",
  "Raqueta Frontón",
  "Atletismo",
  "Bi¡squet de Alto Rendimiento",
  "Natación Competitiva",
  "Tenis",
];

// (Removed news and NewsItem as they are now obsolete)

export const navItems = [
  "Inicio",
  "Noticias",
  "Institución",
  "Equipos y Competición",
  "Escuelas de Formación",
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
    schedule: "Lunes y Mii©rcoles",
    professor: "Varios",
    frequencyPerWeek: 2,
    registrationFee: 1500,
    monthlyFee: 2500,
    slug: "volley-sub12",
    description:
      "Curso de voleibol para nii±os y nii±as de 10 a 12 ai±os. Aprenderemos los fundamentos del juego, ti©cnica de pase, saque y remate. Una excelente introducción al deporte colectivo con i©nfasis en el trabajo en equipo y el disfrute del juego.",
    weeklySchedule: ["Lunes 17:00-18:00", "Mii©rcoles 17:00-18:00"],
    requirements: ["Ropa cómoda", "Zapatillas deportivas", "Botella de agua"],
    professors: [
      { id: "p1", name: "Marti­n Rodri­guez", specialty: "Voleibol Base" },
      { id: "p2", name: "Luci­a Ferni¡ndez", specialty: "Ti©cnica Ofensiva" },
    ],
  },
  {
    id: "c2",
    name: "Raqueta Frontón - Iniciación",
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
      "Initiation en Raqueta Frontón para principiantes de todas las edades. Este curso cubre las ti©cnicas bi¡sicas, reglas del juego, y estrategia. Perfecta para quienes desean aprender un deporte iºnico y desafiante en un ambiente amigable.",
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
    name: "Fiºtbol Sub-14",
    discipline: "Fiºtbol",
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
      "Fiºtbol para jóvenes de 12 a 14 ai±os. Desarrollo de habilidades ti©cnicas, ti¡cticas de equipo, y acondicionamiento fi­sico. Nuestro programa prepara jugadores tanto para jugar recreativamente como competitivamente.",
    weeklySchedule: ["Martes 18:00-19:30", "Viernes 18:00-19:30"],
    requirements: ["Botines de fiºtbol", "Shin guards", "Uniforme del club"],
    professors: [
      {
        id: "p4",
        name: "Diego Morales",
        specialty: "Ti©cnica y Ti¡ctica de Fiºtbol",
      },
      { id: "p5", name: "Andri©s Silva", specialty: "Preparación Fi­sica" },
    ],
  },
];

// Event/Match details
export const eventDetails: EventDetail[] = [
  {
    id: "e1",
    slug: "clasico-vamos-2026-01-18",
    title: "Gran Cli¡sico Inter-Clubes - Voleibol Senior Masculino",
    opponent: "Helsingfors",
    date: "18 de enero",
    time: "20:30",
    location: "Polideportivo Principal",
    venue: "Cancha Central",
    discipline: "Voleibol",
    category: "Senior Masculino",
    description:
      "Enfrentamiento histórico entre dos grandes potencias del voleibol metropolitano. Un partido que promete intensidad, emoción y especti¡culo. Entrada libre para miembros del club. Transmisión en vivo.",
    countdownTargetDate: "2026-01-18T20:30:00",
    imageUrl: "/news-volley-champions.png",
  },
  {
    id: "e2",
    slug: "torneo-masters-fronton-2026",
    title: "Torneo de Raqueta Frontón - Categori­a Mi¡ster",
    opponent: "Participantes Varios",
    date: "25 de enero",
    time: "15:00",
    location: "Cancha de Raqueta Frontón",
    venue: "Cancha 1 y 2",
    discipline: "Raqueta Frontón",
    category: "Mi¡ster 45+",
    description:
      "Torneo interno para jugadores mayores de 45 ai±os. Una oportunidad para disfrutar del deporte en un ambiente competitivo pero amigable. Arancel: $500. Consultar inscripciones en secretari­a.",
    countdownTargetDate: "2026-01-25T15:00:00",
    imageUrl: "/news-fronton-podium.png",
  },
];
