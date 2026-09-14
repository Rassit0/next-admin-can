export type Discipline = "Básquetbol" | "Voleibol" | "Escuela";

// (Removed mockNews as it is now obsolete)

export interface MockInstitutionContact {
  id: string;
  department: string;
  contactName?: string;
  phone?: string;
  email?: string;
  isDefault: boolean;
}

export const mockContacts: MockInstitutionContact[] = [
  {
    id: "1",
    department: "Secretaría General",
    contactName: "María López",
    phone: "+591 12345678",
    email: "secretaria@can.edu.bo",
    isDefault: true,
  },
  {
    id: "2",
    department: "Directorio",
    contactName: "Juan Pérez",
    phone: "+591 87654321",
    email: "directorio@can.edu.bo",
    isDefault: false,
  },
  {
    id: "3",
    department: "Prensa y Comunicación",
    contactName: "Carlos Gómez",
    phone: "+591 11223344",
    email: "prensa@can.edu.bo",
    isDefault: false,
  },
];
