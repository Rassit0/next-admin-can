import { getClubsOptions, SelectClub } from "@/modules/clubs";
import {
  Footer,
  HeaderPageLouncher,
  ModuleGrid,
} from "@/modules/module-louncher";
import { getInstitutions } from "@/modules/organizations";
import { ErrorPage, Header } from "@/ui";

export default async function AdminPage() {
  const [institutionsResponse] = await Promise.all([getInstitutions({})]);

  if (institutionsResponse.error || !institutionsResponse.data) {
    return <ErrorPage message={institutionsResponse.message} />;
  }
  const institution = institutionsResponse.data.data[0];

  return (
    <>
      <div className="max-w-400 mx-auto">
        {/* Container for ultra-wide screens */}
        {/* <!-- TopNavBar --> */}
        <Header
          title={institution.name}
          // actions={<SelectClub clubs={clubsOptionsResponse.data.data} />}
        />
        {/* <!-- Dashboard Canvas --> */}
        <main className="p-4 md:px-8 md:py-3 space-y-6 md:space-y-8">
          {/* <!-- Header Section --> */}
          <HeaderPageLouncher />
          <ModuleGrid />
          <Footer />
        </main>
      </div>
    </>
  );
}
