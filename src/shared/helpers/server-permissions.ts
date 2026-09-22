import { cache } from "react";
import { auth } from "@/auth";
import { getPermissionsArray } from "@/modules/users/actions/roles";

export const getCurrentUserPermissions = cache(async (): Promise<string[]> => {
  const session = await auth();

  if (!session?.user?.roleId) {
    return [];
  }

  const res = await getPermissionsArray({
    roleId: session.user.roleId,
    skip401Redirect: true,
  });

  if (!res.error && res.data) {
    return res.data;
  }

  return [];
});
