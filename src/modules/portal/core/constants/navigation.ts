export interface NavLinkDef {
  href: string;
  label: string;
  subLinks?: { href: string; label: string }[];
}

export const navLinks: NavLinkDef[] = [
  { href: "/", label: "Inicio" },
  {
    href: "/institution",
    label: "El Club",
    subLinks: [
      { href: "/institution/information", label: "Información" },
      { href: "/institution/history", label: "Historia" },
      { href: "/institution/beginning", label: "Principios" },
    ],
  },
  { href: "/present", label: "Actualidad" },
  { href: "/teams/basketball", label: "Bi¡squetbol" },
  { href: "/teams/volleyball", label: "Voleibol" },
  /* {
    href: "/teams",
    label: "Equipos",
    subLinks: [
      { href: "/teams/basketball", label: "Bi¡squetbol" },
      { href: "/teams/volleyball", label: "Voleibol" },
      { href: "/teams/fixture", label: "Fixture" },
    ],
  },
  {
    href: "/schools",
    label: "Escuela",
  }, */
  {
    href: "/contact",
    label: "Contacto",
  },
  // {
  //   href: "/store",
  //   label: "Tienda",
  // },
];
