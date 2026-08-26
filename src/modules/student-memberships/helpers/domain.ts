import { ICycleEnrollment, IStudentMembership } from "../interfaces/student-membership.interface";

/**
 * Returns the currently active cycle based on UTC comparison.
 * An active cycle is CONFIRMED and the current time is between its start and end dates.
 */
export const getCurrentCycle = (cycles?: ICycleEnrollment[]): ICycleEnrollment | undefined => {
  if (!cycles || cycles.length === 0) return undefined;
  
  const now = new Date();
  
  return cycles.find(cycle => {
    if (cycle.status !== "CONFIRMED") return false;
    
    const start = new Date(cycle.cycleStartDate);
    const end = new Date(cycle.cycleEndDate);
    
    return start <= now && now < end;
  });
};

/**
 * Returns the currently pending cycle based on UTC comparison.
 * A pending cycle is PENDING and the current time is between its start and end dates.
 * It must also be within its 24 hour expiration window.
 */
export const getPendingCurrentCycle = (cycles?: ICycleEnrollment[]): ICycleEnrollment | undefined => {
  if (!cycles || cycles.length === 0) return undefined;
  
  const now = new Date();
  
  return cycles.find(cycle => {
    if (cycle.status !== "PENDING") return false;
    if (cycle.createdAt) {
      const expiration = new Date(new Date(cycle.createdAt).getTime() + 24 * 60 * 60 * 1000);
      if (now >= expiration) return false;
    }
    
    const start = new Date(cycle.cycleStartDate);
    const end = new Date(cycle.cycleEndDate);
    
    return start <= now && now < end;
  });
};

/**
 * Determines if a membership is currently in a GAP.
 * A GAP means the membership is ACTIVE but has no currently active or valid pending cycle covering the current date.
 */
export const isMembershipInGap = (membership: IStudentMembership): boolean => {
  if (membership.status !== "ACTIVE") return false;
  
  if (!membership.cycleEnrollments || membership.cycleEnrollments.length === 0) return true;
  
  const now = new Date();
  
  const coveringCycle = membership.cycleEnrollments.find(cycle => {
    if (cycle.status === "CANCELLED") return false;
    if (cycle.status === "PENDING" && cycle.createdAt) {
      const expiration = new Date(new Date(cycle.createdAt).getTime() + 24 * 60 * 60 * 1000);
      if (now >= expiration) return false;
    }
    
    const start = new Date(cycle.cycleStartDate);
    const end = new Date(cycle.cycleEndDate);
    
    return start <= now && now < end;
  });
  
  return !coveringCycle;
};

/**
 * Returns all upcoming CONFIRMED cycles.
 */
export const getUpcomingCycles = (cycles?: ICycleEnrollment[]): ICycleEnrollment[] => {
  if (!cycles || cycles.length === 0) return [];
  
  const now = new Date();
  
  return cycles.filter(cycle => {
    if (cycle.status !== "CONFIRMED") return false;
    
    const start = new Date(cycle.cycleStartDate);
    return start > now;
  });
};

/**
 * Returns all past CONFIRMED cycles.
 */
export const getPastCycles = (cycles?: ICycleEnrollment[]): ICycleEnrollment[] => {
  if (!cycles || cycles.length === 0) return [];
  
  const now = new Date();
  
  return cycles.filter(cycle => {
    if (cycle.status !== "CONFIRMED") return false;
    
    const end = new Date(cycle.cycleEndDate);
    return end <= now;
  });
};

/**
 * Determines if the membership has participation currently (ACTIVE + active cycle).
 */
export const hasActiveParticipation = (membership: IStudentMembership): boolean => {
  if (membership.status !== "ACTIVE") return false;
  return !!getCurrentCycle(membership.cycleEnrollments);
};
