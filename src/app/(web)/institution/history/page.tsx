import { CinematicLoader } from "@/modules/portal/home/components/cinematic-loader";
import { SiteHeader } from "@/modules/portal/shared/components/site-header";
import { ParticlesBackground } from "@/modules/portal/home/components/particles-background";
import InstitucionContent from "@/modules/portal/institutions/components/institucion-content";
import { getPublicInstitutionHistory } from "@/modules/portal/institutions/actions/history.action";
import { resolvePageData } from "@/utils/resolvePageData";

export const metadata = {
  title: "Nuestra Historia e Institucón | Club Atlético Nacional",
  description:
    "Conoce la historia, valores y trayectoria del Club Atlético Nacional.",
  openGraph: {
    images: ["/logo.png"],
  },
};

export default async function HistoryInstitutionPage() {
  const [historyResponse] = await resolvePageData([
    getPublicInstitutionHistory(),
  ]);
  const historyData = historyResponse.data;

  return <InstitucionContent data={historyData} />;
}
