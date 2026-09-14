import { SiteHeader } from "@/modules/web/shared/components/site-header";
import { ParticlesBackground } from "@/modules/web/home/components/particles-background";
import { ContactClient } from "@/modules/web/contact/components/contact-client";
import { getInstitution } from "@/modules/web/institutions/actions/institutions.action";

export const metadata = {
  title: "Contacto | Club Atlético Nacional",
  description:
    "Ponte en contacto con el Club Atlético Nacional. Información de departamentos y direcciones.",
};

export default async function ContactPage() {
  const institutionRes = await getInstitution();
  const institution =
    !institutionRes.error && institutionRes.data
      ? institutionRes.data
      : undefined;

  return <ContactClient institution={institution} />;
}
