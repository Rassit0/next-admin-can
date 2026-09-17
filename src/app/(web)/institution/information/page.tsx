import { getInstitution } from "@/modules/portal/institutions/actions/institutions.action";
import { InstitutionHeader } from "@/modules/portal/institutions/components/institution-header";
import { InstitutionContacts } from "@/modules/portal/institutions/components/institution-contacts";
import { InstitutionPrograms } from "@/modules/portal/institutions/components/institution-programs";
import { InstitutionLocation } from "@/modules/portal/institutions/components/institution-location";

export default async function InformationInstitutionPage() {
  const institutionRes = await getInstitution();

  if (institutionRes.error || !institutionRes.data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <p className="text-xl font-600 text-gray-500">
          No se pudo cargar la información de la institución.
        </p>
      </div>
    );
  }

  const institution = institutionRes.data;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      <InstitutionHeader institution={institution} />
      {/* <InstitutionPrograms
        clubs={institution.clubs}
        schools={institution.schools}
      /> */}
      <InstitutionLocation
        institution={institution}
        locations={institution.locations}
      />
      <InstitutionContacts contacts={institution.contacts} />
    </div>
  );
}
