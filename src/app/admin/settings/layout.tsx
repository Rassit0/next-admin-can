import { itemsNavigation } from "@/config";
import { filterNavigation } from "@/shared/helpers/permissions";
import { NavigationConfig } from "@/config/navigation";
import { getCurrentUserContext } from "@/shared/helpers/server-context";
import { getInstitutionContext } from "@/modules/organizations";
import {
  BottonNavBar,
  ErrorPage,
  Header,
  Sidebar,
  SidebarContentArea,
} from "@/ui";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getCurrentUserContext();
  const userPermissions = context?.permissions || [];

  const allowedItems = filterNavigation(itemsNavigation as NavigationConfig[], userPermissions);

  const organizationsResponse = await getInstitutionContext();

  if (organizationsResponse.error || !organizationsResponse.data) {
    return <ErrorPage message={organizationsResponse.message} />;
  }
  const organization = organizationsResponse.data;
  return (
    <>
      {/* <!-- SideNavBar --> */}
      <Sidebar organization={organization} items={allowedItems} urlBase="/admin" />
      {/* <!-- Main Content Area --> */}
      <SidebarContentArea>
        {/* <!-- TopNavBar: ocupa siempre todo el ancho restante, pegado al borde del Sidebar --> */}
        <Header user={context?.user} person={context?.person} />
        {/* <!-- Dashboard Canvas --> */}
        <div className="w-full max-w-400 mx-auto flex-1 flex flex-col min-w-0">
          <main className="p-4 md:px-8 md:py-3 space-y-6 md:space-y-8 flex-1">
            {/* <!-- Header Section --> */}
            {children}
          </main>
        </div>
        {/* <!-- Mobile BottomNavBar --> */}
        <BottonNavBar items={allowedItems} urlBase="/admin" />
      </SidebarContentArea>
    </>
  );
}
