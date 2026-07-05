import {
  ActivitySkillLevel,
  ActivityStatus,
  ActivityType,
} from "./activity.interface";

export interface AddScheduleProps {
  id: string | number;
  specificDate?: Date | null;
  dayOfWeek?: number | null;
  startTime: string;
  endTime: string;
  locationId: number;
}

export interface AddMatchDetailProps {
  locationId: number;
  matchDate: Date;
  scoreHome: number;
  scoreAway: number;
}

export interface AddEducationalActivityProps {
  maxStudents: number;
  minStudents: number;
  teachersRequired: number;
  academicPeriod?: string | null;
}

export interface AddActivityProps {
  name: string;
  level?: ActivitySkillLevel;
  organizationId?: number;
  type: ActivityType;
  startDate: Date;
  endDate: Date;
  totalPrice: string;
  monthlyPrice: string;
  registrationFee: string;
  maxMembers: number;
  minMembers: number;
  staffRequired: number;
  parentId: number | null;
  status: ActivityStatus;
  categoryIds?: number[];
  disciplineIds?: number[];
}
