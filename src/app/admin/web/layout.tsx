import { itemsWebNavigation } from "@/config";
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

  const allowedItems = filterNavigation(itemsWebNavigation as NavigationConfig[], userPermissions);

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
        urlBase={`/admin/web`}
      />
      {/* <!-- Main Content Area --> */}
      <SidebarContentArea>
        {/* <!-- TopNavBar: ocupa siempre todo el ancho restante, pegado al borde del Sidebar --> */}
        <Header user={context?.user} person={context?.person} />
        {/* <!-- Dashboard Canvas --> */}
        <div className="w-full max-w-400 mx-auto flex-1 flex flex-col min-w-0">
          <main className="page-content flex-1">
            {/* <!-- Header Section --> */}
            {children}
          </main>
        </div>
        {/* <!-- Mobile BottomNavBar --> */}
        <BottonNavBar items={allowedItems} urlBase={`/admin/web`} />
      </SidebarContentArea>
    </>
  );
}
