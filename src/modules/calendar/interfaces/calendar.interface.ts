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
  homeTeam: {
    id: string;
    name: string;
  };
  awayTeam: {
    id: string;
    name: string;
  };
  homeScore: number | null;
  awayScore: number | null;
  matchType: string;
  result: string | null;
  homeCategory: {
    id: string;
    name: string;
  } | null;
  awayCategory: {
    id: string;
    name: string;
  } | null;
}

export interface IGeneralEventCalendarMetadata extends IBaseCalendarMetadata {
  institutionId: string | null;
  teamSeasonCategoryId: string | null;
  courseSeasonId: string | null;
  courseSeasonShiftId: string | null;
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
