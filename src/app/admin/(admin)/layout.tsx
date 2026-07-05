import { itemsNavigation } from "@/config";
import { getClubsOptions, SelectClub } from "@/modules/clubs";
import { getOrganizationById, getInstitutions } from "@/modules/organizations";
import { BottonNavBar, ErrorPage, Header, Sidebar } from "@/ui";
import { iconMap } from "@/utils";
import { HugeiconsIcon } from "@hugeicons/react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        items={itemsNavigation}
        urlBase={`/admin`}
      />
      {/* <!-- Main Content Area --> */}
      <div className="lg:ml-64 min-h-screen transition-all duration-300 pb-24 md:pb-24 lg:pb-2">
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
        <BottonNavBar items={itemsNavigation} urlBase={`/admin`} />
      </div>
    </>
  );
}
