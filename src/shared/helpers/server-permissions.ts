import { cache } from "react";
import { getCurrentUserContext } from "./server-context";

export const getCurrentUserPermissions = cache(async (): Promise<string[]> => {
  const context = await getCurrentUserContext();
  return context?.permissions ?? [];
});
