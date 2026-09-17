export interface InstitutionContact {
  id: string;
  department: string;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  isDefault: boolean;
}

export interface Discipline {
  id: string;
  name: string;
  icon: string;
}

export interface Club {
  id: string;
  name: string;
  discipline: Discipline;
}

export interface School {
  id: string;
  name: string;
  discipline: Discipline;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  description: string | null;
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface Institution {
  id: string;
  name: string;
  imageUrl: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string | null;
  contacts: InstitutionContact[];
  clubs: Club[];
  schools: School[];
  locations: Location[];
  createdAt: string;
  updatedAt: string;
}
