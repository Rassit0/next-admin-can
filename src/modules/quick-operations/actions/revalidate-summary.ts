"use server";

import { updateTag } from "next/cache";

export const revalidatePersonSummaryCache = async (personId: string) => {
  updateTag(`person-${personId}-summary`);
};

export const revalidatePersonMembershipHistoryCache = async (personId: string) => {
  updateTag(`person-${personId}-membership-history`);
};

