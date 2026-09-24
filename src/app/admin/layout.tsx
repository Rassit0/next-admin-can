import { getCurrentUserContext } from "@/shared/helpers/server-context";
import { PermissionsProvider } from "@/shared/providers/PermissionsProvider";
import { Header } from "@/ui";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const context = await getCurrentUserContext();

  // If no context, auth failed, NextAuth middleware or layouts usually redirect
  // We provide dummy empty if missing for safety
  const permissions = context?.permissions || [];
  const session = context ? { user: context.user, expires: "" } : null;

  return (
    <SessionProvider session={session as any}>
      <PermissionsProvider permissions={permissions}>
        {children}
        {modal}
      </PermissionsProvider>
    </SessionProvider>
  );
}
