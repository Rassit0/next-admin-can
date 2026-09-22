import { ModuleGuard } from "@/ui";

export default function PlayerMembershipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModuleGuard moduleId="memberships" childRouteId="memberships-players">
      {children}
    </ModuleGuard>
  );
}
