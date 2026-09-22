import { ModuleGuard } from "@/ui";

export default function WebChildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModuleGuard moduleId="web" childRouteId="web-home">
      {children}
    </ModuleGuard>
  );
}
