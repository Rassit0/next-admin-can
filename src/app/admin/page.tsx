import { getClubsOptions, SelectClub } from "@/modules/clubs";
import {
  Footer,
  HeaderPageLouncher,
  ModuleGrid,
} from "@/modules/module-louncher";
import { getInstitutionContext } from "@/modules/organizations";
import { ErrorPage, Header } from "@/ui";
import { resolvePageData } from "@/utils/resolvePageData";

export default async function HomePage() {
  const [institutionsResponse] = await resolvePageData([getInstitutionContext()]);

  const institution = institutionsResponse.data;

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
