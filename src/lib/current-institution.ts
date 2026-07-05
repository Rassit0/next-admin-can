// lib/current-organization.ts

import { cookies } from "next/headers";

export async function getCurrentInstitutionId() {
  const cookieStore = await cookies();

  return cookieStore.get("institutionId")?.value;
}
