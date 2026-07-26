export interface TeamSeasonContext {
  id: string;
  gender: string;
  season: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
  };
  description: string | null;
  category: {
    id: string;
    name: string;
  };

  team: {
    id: string;
    name: string;
    shortName: string | null;
  };
}
