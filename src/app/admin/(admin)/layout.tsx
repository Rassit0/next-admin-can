import { itemsNavigation } from "@/config";
import { getClubsOptions, SelectClub } from "@/modules/clubs";
import { getOrganizationById, getInstitutions } from "@/modules/organizations";
import { BottonNavBar, ErrorPage, Header, Sidebar } from "@/ui";
import { iconMap } from "@/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { auth } from "@/auth";
import { getPermissionsArray } from "@/modules/roles";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let userPermissions: string[] = [];

  if (session?.user?.roleId) {
    const permRes = await getPermissionsArray({ roleId: session.user.roleId });
    if (!permRes.error && permRes.data) {
      userPermissions = permRes.data;
    }
  }

  // Filtrar items basado en los permisos (requiere al menos un permiso para el módulo, o ser dashboard)
  const allowedItems = itemsNavigation.filter((item) => {
    if (item.action === "dashboard") return true;
    if (item.subject === "home") return true; // Para los que aún no has migrado

    const subjects = Array.isArray(item.subject) ? item.subject : [item.subject];
    return userPermissions.some((p) => subjects.some((sub) => p.endsWith(`_${sub}`)));
  });

  const institutionsResponse = await getInstitutions({});

  if (institutionsResponse.error || !institutionsResponse.data) {
    return <ErrorPage message={institutionsResponse.message} />;
  }
  const institution = institutionsResponse.data.data[0];

  return (
    <>
      {/* <!-- SideNavBar --> */}
      <Sidebar
        organization={institution}
        items={allowedItems}
        urlBase={`/admin`}
      />
      {/* <!-- Main Content Area --> */}
      <div className="lg:ml-64 min-h-screen transition-all duration-300 pb-16 lg:pb-2">
        <div className="max-w-400 mx-auto">
          {/* Container for ultra-wide screens */}
          {/* <!-- TopNavBar --> */}
          <Header />
          {/* <!-- Dashboard Canvas --> */}
          <main className="page-content">
            {/* <!-- Header Section --> */}
            {children}
          </main>
        </div>
        {/* <!-- Mobile BottomNavBar --> */}
        <BottonNavBar items={allowedItems} urlBase={`/admin`} />
      </div>
    </>
  );
}
