import { CinematicLoader } from "@/modules/portal/home/components/cinematic-loader";
import { SiteHeader } from "@/modules/portal/shared/components/site-header";
import { ParticlesBackground } from "@/modules/portal/home/components/particles-background";
import InstitucionContent from "@/modules/portal/institutions/components/institucion-content";

export const metadata = {
  title: "Nuestra Historia e Institución | Club Atlético Nacional",
  description:
    "Conoce la historia, valores y trayectoria del Club Atlético Nacional.",
  openGraph: {
    images: ["/logo.png"],
  },
};

export default function HistoryInstitutionPage() {
  return (
    // <div className="relative min-h-screen bg-background">
    //   <CinematicLoader />
    //   <ParticlesBackground />
    //   <SiteHeader />
    //   <main className="relative">
    //   </main>
    // </div>
    <InstitucionContent />
  );
}
