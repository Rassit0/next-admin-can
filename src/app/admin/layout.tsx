import { auth } from "@/auth";
import { getPermissionsArray } from "@/modules/roles";
import { PermissionsProvider } from "@/shared/providers/PermissionsProvider";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  let resPermissionsArray: string[] = [];
  if (session.user.roleId) {
    const data = await getPermissionsArray({
      roleId: session.user.roleId,
    });
    if (data.error) {
      console.log(data.message);
    }
    if (!data.error && data.data) {
      resPermissionsArray = data.data;
    }
  }

  return (
    <SessionProvider session={session}>
      <PermissionsProvider permissions={resPermissionsArray}>
        {children}
      </PermissionsProvider>
    </SessionProvider>
  );
}
