import { itemsNavigation } from "@/config";
import { filterNavigation } from "@/shared/helpers/permissions";
import { NavigationConfig } from "@/config/navigation";
import { getClubsOptions, SelectClub } from "@/modules/clubs";
import { getInstitutionContext } from "@/modules/organizations";
import { BottonNavBar, ErrorPage, Header, Sidebar } from "@/ui";
import { iconMap } from "@/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { getCurrentUserContext } from "@/shared/helpers/server-context";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getCurrentUserContext();
  const userPermissions = context?.permissions || [];

  const allowedItems = filterNavigation(itemsNavigation as NavigationConfig[], userPermissions);

  const institutionsResponse = await getInstitutionContext();

  if (institutionsResponse.error || !institutionsResponse.data) {
    return <ErrorPage message={institutionsResponse.message} />;
  }
  const institution = institutionsResponse.data;

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
          <Header user={context?.user} person={context?.person} />
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
