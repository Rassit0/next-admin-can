export interface ICalendarLocation {
  id: string;
  name: string;
}

export interface ICalendarSeries {
  id: string;
  isRecurring: boolean;
}

export interface IBaseCalendarMetadata {
  [key: string]: any;
}

export interface ISessionCalendarMetadata extends IBaseCalendarMetadata {
  durationMin: number;
  teams: Array<{ id: string; name: string }>;
  courses: Array<{ id: string; name: string }>;
}

export interface IMatchCalendarMetadata extends IBaseCalendarMetadata {
  opponentName: string;
  matchType: string;
  result: string;
  team: { id: string; name: string } | null;
}

export interface IGeneralEventCalendarMetadata extends IBaseCalendarMetadata {
  institutionId: string | null;
  teamSeasonId: string | null;
  courseSeasonId: string | null;
}

export interface ICalendarEventResponse<T = IBaseCalendarMetadata> {
  id: string;
  title: string | null;
  type: "SESSION" | "MATCH" | "GENERAL";
  startDate: string; // From API it comes as ISO string
  endDate: string;
  status: "SCHEDULED" | "CANCELLED" | "COMPLETED" | "RESCHEDULED";
  color: string | null;
  location: ICalendarLocation | null;
  series: ICalendarSeries | null;
  metadata: T;
}
