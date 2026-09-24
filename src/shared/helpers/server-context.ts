import { cache } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { api } from "@/utils/api";
import { getPermissionsArray } from "@/modules/users/actions/roles";

export type AuthIdentity = {
  id: string;
  email: string;
  roleId: string;
  personId: string | null;
  token?: string;
};

export type CurrentPerson = {
  id: string;
  name: string;
  lastName: string;
  imageUrl: string | null;
};

export type CurrentUserContext = {
  user: AuthIdentity;
  person: CurrentPerson | null;
  permissions: string[];
};

export const getCurrentPerson = async (token: string): Promise<CurrentPerson | null> => {
  try {
    const res = await api.get<{ data: CurrentPerson | null }>('users/me/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res?.data || null;
  } catch (error: any) {
    if (error?.status === 401 || error?.statusCode === 401) {
      // Backend auth no longer valid -> redirect to login preserving NextAuth semantics
      redirect('/login?expired=true');
    }
    if (error?.status === 403 || error?.statusCode === 403) {
      // Unexpected authorization failure (self-profile doesn't require RBAC)
      throw error;
    }
    console.error("Error fetching current person (degrading to fallback):", error);
    // Para 500 o network error, degradamos visualmente
    return null;
  }
};

export const getCurrentUserContext = cache(async (): Promise<CurrentUserContext | null> => {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const user: AuthIdentity = {
    id: session.user.id,
    email: session.user.email!,
    roleId: session.user.roleId,
    personId: session.user.personId || null,
    token: session.user.token,
  };

  if (!user.token) {
    return { user, person: null, permissions: [] };
  }

  const [person, permissionsRes] = await Promise.all([
    getCurrentPerson(user.token),
    getPermissionsArray({
      roleId: user.roleId,
      skip401Redirect: true,
    }),
  ]);

  const permissions = !permissionsRes.error && permissionsRes.data ? permissionsRes.data : [];

  return {
    user,
    person,
    permissions,
  };
});
