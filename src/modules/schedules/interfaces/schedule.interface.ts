export interface ICreateSchedulePayload {
  locationId?: string | null;
  title?: string | null;
  startDate: string; // ISO String
  endDate: string; // ISO String
  durationMin?: number;
  recurrenceRule?: string; // RRULE
  timezone?: string;
  
  // Relations
  teamSeasonIds?: string[];
  courseSeasonIds?: string[];
}
