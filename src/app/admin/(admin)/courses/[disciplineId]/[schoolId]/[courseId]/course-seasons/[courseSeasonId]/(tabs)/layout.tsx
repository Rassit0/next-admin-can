import { ErrorPage, HeaderPage, TabsRouteNavigation } from "@/ui";
import { getCourseSeasonById, CourseSeasonActions } from "@/modules/course-seasons";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    disciplineId: string;
    schoolId: string;
    courseId: string;
    courseSeasonId: string;
  }>;
}

const GENDER_MAP: Record<string, string> = {
  MALE: "Masculino",
  FEMALE: "Femenino",
  MIXED: "Mixto",
};

export default async function CourseSeasonDetailLayout({ children, params }: LayoutProps) {
  const { disciplineId, schoolId, courseId, courseSeasonId } = await params;
  
  const courseSeasonResponse = await getCourseSeasonById({ id: courseSeasonId });

  if (courseSeasonResponse.error) {
    return <ErrorPage message={courseSeasonResponse.message} />;
  }

  const courseSeason = courseSeasonResponse.data;

  const basePath = `/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons/${courseSeasonId}`;

  const tabsRoutes = [
    { value: "/", title: "Información General" },
    { value: "/student-memberships", title: "Membresías" },
    { value: "/payment-plans", title: "Planes de Pago" },
    { value: "/payments", title: "Transacciones" },
  ];

  return (
    <>
      <HeaderPage
        title={`${courseSeason.category.name} (${GENDER_MAP[courseSeason.gender] || courseSeason.gender}) · ${courseSeason.season.name}`}
        description={`Curso: ${courseSeason.course.name} · Detalle de la temporada`}
        action={<CourseSeasonActions courseSeason={courseSeason} />}
        breadcrumb={[
          { label: "Cursos", href: `/` },
          {
            label: `Temporadas`,
            href: `/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`,
          },
          {
            label: `Detalles`,
          },
        ]}
      />
      <div className="flex flex-col gap-6 page-content">
        <TabsRouteNavigation routes={tabsRoutes} basePath={basePath} defaultRoute="/" />
        {children}
      </div>
    </>
  );
}
