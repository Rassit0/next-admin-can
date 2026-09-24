export interface PublicInstitutionHistoryResponse {
  intro: {
    title: string;
    description: string;
    imageUrl?: string | null;
    imageAlt?: string | null;
  };
  timeline: {
    id: string;
    year: string;
    title: string;
    description: string;
  }[];
}
