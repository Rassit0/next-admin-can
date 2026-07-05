/**
 * UNIFIED API UTILITIES
 * Centralized fetch routines for all domain endpoints
 * Follows strict server-side patterns with proper error handling and caching
 */

"use server";

import { api } from "@/utils/api";
import { handleServerAction } from "@/utils";
import { ServiceResponse } from "@/types/api";
import {
  IInstitution,
  IDiscipline,
  ILocation,
  IClub,
  ITeam,
  ICategory,
  ISeason,
  ITeamSeason,
  IPerson,
  IPlayer,
  IPaymentPlan,
  IMemberAssignment,
  IMembershipDiscount,
  IPayment,
  IStaff,
  IRole,
  PaginatedResponse,
} from "@/types/api-unified";

// ============================================================================
// INSTITUTIONAL DOMAIN UTILITIES
// ============================================================================

export const getInstitutions = async (
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<IInstitution>>> => {
  return handleServerAction(async () => {
    const res = await api.get<PaginatedResponse<IInstitution>>(
      `/institutions?page=${page}&per_page=${per_page}`,
      {
        next: {
          tags: ["institutions"],
          revalidate: 86400,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Instituciones obtenidas",
    };
  });
};

// ============================================================================
// DISCIPLINES & LOCATIONS
// ============================================================================

export const getDisciplines = async (
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<IDiscipline>>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(
      `/disciplines?page=${page}&per_page=${per_page}`,
      {
        next: {
          tags: ["disciplines"],
          revalidate: 86400,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Disciplinas obtenidas",
    };
  });
};

export const getLocations = async (
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<ILocation>>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(
      `/locations?page=${page}&per_page=${per_page}`,
      {
        next: {
          tags: ["locations"],
          revalidate: 86400,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Ubicaciones obtenidas",
    };
  });
};

// ============================================================================
// CLUBS & TEAMS
// ============================================================================

export const getClubs = async (
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<IClub>>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(
      `/clubs?page=${page}&per_page=${per_page}`,
      {
        next: {
          tags: ["clubs"],
          revalidate: 3600,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Clubes obtenidos",
    };
  });
};

export const getClubById = async (
  clubId: string,
): Promise<ServiceResponse<IClub>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(`/clubs/${clubId}`, {
      next: {
        tags: [`club-${clubId}`],
        revalidate: 1800,
      },
    });
    return {
      error: false,
      data: res,
      message: res.message || "Club obtenido",
    };
  });
};

export const getTeams = async (
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<ITeam>>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(
      `/teams?page=${page}&per_page=${per_page}`,
      {
        next: {
          tags: ["teams"],
          revalidate: 3600,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Equipos obtenidos",
    };
  });
};

export const getTeamById = async (
  teamId: string,
): Promise<ServiceResponse<ITeam>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(`/teams/${teamId}`, {
      next: {
        tags: [`team-${teamId}`],
        revalidate: 1800,
      },
    });
    return {
      error: false,
      data: res,
      message: res.message || "Equipo obtenido",
    };
  });
};

// ============================================================================
// CATEGORIES & SEASONS
// ============================================================================

export const getCategories = async (
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<ICategory>>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(
      `/categories?page=${page}&per_page=${per_page}`,
      {
        next: {
          tags: ["categories"],
          revalidate: 86400,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Categorías obtenidas",
    };
  });
};

export const getSeasons = async (
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<ISeason>>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(
      `/seasons?page=${page}&per_page=${per_page}`,
      {
        next: {
          tags: ["seasons"],
          revalidate: 86400,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Temporadas obtenidas",
    };
  });
};

// ============================================================================
// TEAM SEASONS
// ============================================================================

export const getTeamSeasons = async (
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<ITeamSeason>>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(
      `/team-seasons?page=${page}&per_page=${per_page}`,
      {
        next: {
          tags: ["team-seasons"],
          revalidate: 3600,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Temporadas de equipo obtenidas",
    };
  });
};

export const getTeamSeasonById = async (
  teamSeasonId: string,
): Promise<ServiceResponse<ITeamSeason>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(`/team-seasons/${teamSeasonId}`, {
      next: {
        tags: [`team-season-${teamSeasonId}`],
        revalidate: 1800,
      },
    });
    return {
      error: false,
      data: res,
      message: res.message || "Temporada de equipo obtenida",
    };
  });
};

// ============================================================================
// PERSONS & PLAYERS
// ============================================================================

export const getPersons = async (
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<IPerson>>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(
      `/persons?page=${page}&per_page=${per_page}`,
      {
        next: {
          tags: ["persons"],
          revalidate: 3600,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Personas obtenidas",
    };
  });
};

export const getPlayers = async (
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<IPlayer>>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(
      `/players?page=${page}&per_page=${per_page}`,
      {
        next: {
          tags: ["players"],
          revalidate: 3600,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Jugadores obtenidos",
    };
  });
};

export const getPlayerById = async (
  playerId: string,
): Promise<ServiceResponse<IPlayer>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(`/players/${playerId}`, {
      next: {
        tags: [`player-${playerId}`],
        revalidate: 1800,
      },
    });
    return {
      error: false,
      data: res,
      message: res.message || "Jugador obtenido",
    };
  });
};

// ============================================================================
// PAYMENT PLANS
// ============================================================================

export const getPaymentPlans = async (
  teamSeasonId?: string,
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<IPaymentPlan>>> => {
  return handleServerAction(async () => {
    const query = new URLSearchParams();
    if (teamSeasonId) query.set("teamSeasonId", teamSeasonId);
    query.set("page", page);
    query.set("per_page", per_page);

    const res = await api.get<any>(
      `/payment-plans?${query.toString()}`,
      {
        next: {
          tags: ["payment-plans"],
          revalidate: 3600,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Planes de pago obtenidos",
    };
  });
};

// ============================================================================
// MEMBER ASSIGNMENTS
// ============================================================================

export const getMemberAssignments = async (
  teamSeasonId: string,
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<IMemberAssignment>>> => {
  return handleServerAction(async () => {
    const query = new URLSearchParams();
    query.set("teamSeasonId", teamSeasonId);
    query.set("page", page);
    query.set("per_page", per_page);

    const res = await api.get<any>(
      `/member-team-season-assignments?${query.toString()}`,
      {
        next: {
          tags: [`assignments-${teamSeasonId}`],
          revalidate: 3600,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Asignaciones obtenidas",
    };
  });
};

// ============================================================================
// PAYMENTS
// ============================================================================

export const getPayments = async (
  membershipId?: string,
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<IPayment>>> => {
  return handleServerAction(async () => {
    const query = new URLSearchParams();
    if (membershipId) query.set("membershipId", membershipId);
    query.set("page", page);
    query.set("per_page", per_page);

    const res = await api.get<any>(
      `/payments?${query.toString()}`,
      {
        next: {
          tags: ["payments"],
          revalidate: 1800,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Pagos obtenidos",
    };
  });
};

// ============================================================================
// STAFF & ROLES
// ============================================================================

export const getRoles = async (
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<IRole>>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(
      `/roles?page=${page}&per_page=${per_page}`,
      {
        next: {
          tags: ["roles"],
          revalidate: 86400,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Roles obtenidos",
    };
  });
};

export const getStaff = async (
  page = "1",
  per_page = "50",
): Promise<ServiceResponse<PaginatedResponse<IStaff>>> => {
  return handleServerAction(async () => {
    const res = await api.get<any>(
      `/staff?page=${page}&per_page=${per_page}`,
      {
        next: {
          tags: ["staff"],
          revalidate: 3600,
        },
      },
    );
    return {
      error: false,
      data: res,
      message: res.message || "Personal obtenido",
    };
  });
};
