import { SiteHeader } from "@/modules/portal/shared/components/site-header";
import { ParticlesBackground } from "@/modules/portal/home/components/particles-background";
import { ContactClient } from "@/modules/portal/contact/components/contact-client";
import { getInstitution } from "@/modules/portal/institutions/actions/institutions.action";

export const metadata = {
  title: "Contacto | Club Atli©tico Nacional",
  description:
    "Ponte en contacto con el Club Atli©tico Nacional. Información de departamentos y direcciones.",
};

export default async function ContactPage() {
  const institutionRes = await getInstitution();
  const institution =
    !institutionRes.error && institutionRes.data
      ? institutionRes.data
      : undefined;

  return <ContactClient institution={institution} />;
}
