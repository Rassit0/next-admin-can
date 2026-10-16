import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Header, TabsRouteNavigation } from "@/ui";
import { ArrowLeft02Icon, DashboardSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CurrentPerson, AuthIdentity } from "@/shared/helpers/server-context";

interface TeacherNavbarProps {
  user?: AuthIdentity;
  person?: CurrentPerson | null;
}

export const TeacherNavbar: React.FC<TeacherNavbarProps> = ({
  user,
  person,
}) => {
  const teacherRoutes = [
    { value: "/", title: "Inicio" },
    { value: "/groups", title: "Mis grupos" },
  ];

  return (
    <div className="w-full border-b border-divider bg-background sticky top-0 z-40 backdrop-blur-md bg-background/80">
      <Header
        showLogo={true}
        user={user}
        person={person}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-medium flex items-center gap-1.5"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={15} />
                <span>Launcher</span>
              </Button>
            </Link>
          </div>
        }
      />
      <div className="max-w-400 mx-auto px-4 md:px-8">
        <TabsRouteNavigation
          routes={teacherRoutes}
          basePath="/teacher"
          defaultRoute="/"
          variant="secondary"
        />
      </div>
    </div>
  );
};
