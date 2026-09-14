import Link from "next/link";
import { CinematicLoader } from "@/modules/web/home/components/cinematic-loader";
import { SiteHeader } from "@/modules/web/shared/components/site-header";
import { ParticlesBackground } from "@/modules/web/home/components/particles-background";
import { CourseDetailClient } from "./course-detail-client";
import { findCourseBySlug, courseDetails } from "@/modules/web/core/constants/data";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return courseDetails.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { slug } = await params;
  const course = findCourseBySlug(slug);

  if (!course) {
    const { getInstitution } = await import("@/modules/web/institutions/actions/institutions.action");
    const res = await getInstitution();
    if (!res.data) { return null; }

    return (
      <div className="relative min-h-screen bg-background">
        <SiteHeader institution={res.data} />
        <main className="relative">
          <div className="mx-auto max-w-2xl px-4 py-16 text-center">
            <h1 className="font-oswald text-4xl font-bold text-oxford">
              Curso no encontrado
            </h1>
            <Link
              href="/escuelas"
              className="mt-8 inline-block text-neon hover:underline"
            >
              Volver a Escuelas
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    // <div className="relative min-h-screen bg-background">
    //   <CinematicLoader />
    //   <ParticlesBackground />
    //   <SiteHeader />
    //   <main className="relative">
    //   </main>
    // </div>
    <CourseDetailClient course={course} />
  );
}
