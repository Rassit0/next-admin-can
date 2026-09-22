import { itemsNavigation } from "@/config";
import { filterNavigation } from "@/shared/helpers/permissions";
import { NavigationConfig } from "@/config/navigation";
import { auth } from "@/auth";
import { getPermissionsArray } from "@/modules/roles";
import { getInstitutionContext } from "@/modules/organizations";
import { BottonNavBar, ErrorPage, Header, Sidebar } from "@/ui";

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

  const allowedItems = filterNavigation(itemsNavigation as NavigationConfig[], userPermissions);

  const organizationsResponse = await getInstitutionContext();

  if (organizationsResponse.error || !organizationsResponse.data) {
    return <ErrorPage message={organizationsResponse.message} />;
  }
  const organization = organizationsResponse.data;
  return (
    <>
      {/* <!-- SideNavBar --> */}
      <Sidebar organization={organization} items={allowedItems} />
      {/* <!-- Main Content Area --> */}
      <div className="md:ml-20 lg:ml-64 min-h-screen transition-all duration-300 pb-24 lg:pb-2">
        <div className="max-w-400 mx-auto">
          {/* Container for ultra-wide screens */}
          {/* <!-- TopNavBar --> */}
          <Header />
          {/* <!-- Dashboard Canvas --> */}
          <main className="p-4 md:px-8 md:py-3 space-y-6 md:space-y-8">
            {/* <!-- Header Section --> */}
            {children}
          </main>
        </div>
        {/* <!-- Mobile BottomNavBar --> */}
        <BottonNavBar items={allowedItems} urlBase={`/admin/settings`} />
      </div>
    </>
  );
}
