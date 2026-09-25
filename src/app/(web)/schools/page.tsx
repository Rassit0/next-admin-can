import { CinematicLoader } from "@/modules/portal/home/components/cinematic-loader";
import { SiteHeader } from "@/modules/portal/shared/components/site-header";
import { ParticlesBackground } from "@/modules/portal/home/components/particles-background";
import EscuelasContent from "@/modules/portal/schools/components/escuelas-content";
import { getPublicCourses } from "@/modules/portal/schools/actions/schools.action";

export const metadata = {
  title: "Escuelas de Formación y Cursos | Club Atlético Nacional",
  description:
    "Programas de formación deportiva para todas las edades en el Club Atlético Nacional.",
  openGraph: {
    images: ["/logo.png"],
  },
};

export default async function EscuelasPage() {
  const coursesRes = await getPublicCourses();
  const courses = !coursesRes.error && coursesRes.data ? coursesRes.data : [];

  return (
    // <div className="relative min-h-screen bg-background">
    //   <CinematicLoader />
    //   <ParticlesBackground />
    //   <SiteHeader />
    //   <main className="relative">
    //   </main>
    // </div>
    <EscuelasContent initialCourses={courses} />
  );
}
