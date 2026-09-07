"use server";

import { updateTag } from "next/cache";

export const revalidatePersonContactsCache = async (personId: string) => {
  updateTag(`person-${personId}-contacts`);
};
