import { ModuleGuard } from "@/ui";

export default function StudentMembershipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModuleGuard moduleId="memberships" childRouteId="memberships-students">
      {children}
    </ModuleGuard>
  );
}
