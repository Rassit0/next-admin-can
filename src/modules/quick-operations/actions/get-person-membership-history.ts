"use server";

import { api } from "@/utils/api";
import { ServiceResponse } from "@/types/api";
import { handleServerAction } from "@/utils";
import { IMembershipHistoryItem } from "../interfaces/membership-history.interface";
import { IPlayerMembershipResponse } from "@/modules/player-memberships";
import { IStudentMembershipResponse } from "@/modules/student-memberships";

export interface GetPersonMembershipHistoryParams {
  personId: string;
  playerId?: string;
  studentId?: string;
}

export const getPersonMembershipHistory = async ({
  personId,
  playerId,
  studentId,
}: GetPersonMembershipHistoryParams): Promise<ServiceResponse<IMembershipHistoryItem[]>> => {
  return handleServerAction(async () => {
    if (!playerId && !studentId) {
      return {
        error: false,
        data: [],
        message: "Sin historiales para consultar",
      };
    }

    const fetchAllPlayerMemberships = async (pid: string): Promise<IMembershipHistoryItem[]> => {
      let allItems: IMembershipHistoryItem[] = [];
      let currentPage = 1;
      let hasNext = true;

      while (hasNext) {
        const params = new URLSearchParams({
          playerId: pid,
          per_page: "100",
          page: currentPage.toString(),
        });

        try {
          const res = await api.get<IPlayerMembershipResponse>(
            `player-memberships?${params.toString()}`,
            {
              next: {
                tags: [`person-${personId}-membership-history`],
                revalidate: 3600,
              },
            }
          );

          if (res.data) {
            const mapped = res.data.map((m: any): IMembershipHistoryItem => ({
              id: m.id,
              type: "team",
              status: m.status,
              startedAt: m.startedAt,
              endedAt: m.finishedAt || m.endedAt || null,
              createdAt: m.createdAt,
              teamName: m.teamSeason?.team?.name,
              categoryName: m.teamSeasonCategories?.category?.name,
              seasonName: m.teamSeason?.season?.name,
            }));
            allItems = [...allItems, ...mapped];
          }
          hasNext = res.meta?.hasNextPage || false;
          currentPage++;
        } catch (error: any) {
          if (error?.statusCode === 403 || error?.status === 403) {
            return allItems;
          }
          throw error;
        }
      }
      return allItems;
    };

    const fetchAllStudentMemberships = async (sid: string): Promise<IMembershipHistoryItem[]> => {
      let allItems: IMembershipHistoryItem[] = [];
      let currentPage = 1;
      let hasNext = true;

      while (hasNext) {
        const params = new URLSearchParams({
          studentId: sid,
          per_page: "100",
          page: currentPage.toString(),
        });

        try {
          const res = await api.get<IStudentMembershipResponse>(
            `student-memberships?${params.toString()}`,
            {
              next: {
                tags: [`person-${personId}-membership-history`],
                revalidate: 3600,
              },
            }
          );

          if (res.data) {
            const mapped = res.data.map((m: any): IMembershipHistoryItem => ({
              id: m.id,
              type: "course",
              status: m.status,
              startedAt: m.startedAt,
              endedAt: m.finishedAt || m.endedAt || null,
              createdAt: m.createdAt,
              courseName: m.courseSeason?.course?.name,
              institutionName: m.courseSeason?.course?.school?.name || m.courseSeason?.season?.institution?.name,
              shiftName: m.courseSeasonShift?.shift?.name,
              seasonName: m.courseSeason?.season?.name,
            }));
            allItems = [...allItems, ...mapped];
          }
          hasNext = res.meta?.hasNextPage || false;
          currentPage++;
        } catch (error: any) {
          if (error?.statusCode === 403 || error?.status === 403) {
            return allItems;
          }
          throw error;
        }
      }
      return allItems;
    };

    const promises: Promise<IMembershipHistoryItem[]>[] = [];

    if (playerId) {
      promises.push(fetchAllPlayerMemberships(playerId));
    }
    
    if (studentId) {
      promises.push(fetchAllStudentMemberships(studentId));
    }

    const results = await Promise.all(promises);
    
    const combinedHistory = results.flat();

    combinedHistory.sort((a, b) => {
      const dateA = new Date(a.startedAt).getTime();
      const dateB = new Date(b.startedAt).getTime();
      if (dateA !== dateB) {
        return dateB - dateA;
      }
      const createdA = new Date(a.createdAt).getTime();
      const createdB = new Date(b.createdAt).getTime();
      return createdB - createdA;
    });

    return {
      error: false,
      data: combinedHistory,
      message: "Historial de Membresías obtenido exitosamente",
    };
  });
};


