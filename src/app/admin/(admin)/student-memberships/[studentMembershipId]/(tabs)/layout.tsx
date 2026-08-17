import { ErrorPage, HeaderPage, TabsRouteNavigation } from "@/ui";
import React from "react";
import { resolvePageData } from "@/utils/resolvePageData";
import { getStudentMembershipById } from "@/modules/student-memberships";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    studentMembershipId: string;
  }>;
}

export default async function StudentSeasonDetailLayout({
  children,
  params,
}: LayoutProps) {
  const { studentMembershipId } = await params;

  const [membershipRes] = await resolvePageData([
    getStudentMembershipById({ id: studentMembershipId }),
  ]);

  const membership = membershipRes.data;

  const tabsRoutes = [
    { value: "/", title: "Información General" },
    { value: "/charges", title: "Cargos" },
    { value: "/histories", title: "Actividad" },
    // { value: "/player-memberships", title: "Membresías" },
    // { value: "/payment-plans", title: "Planes de Pago" },
    // { value: "/payments", title: "Transacciones" },
  ];

  return (
    <>
      <HeaderPage
        title={
          membership.student
            ? `${membership.student.person.name} ${membership.student.person.lastName} ${membership.student.person.secondLastName || ""}`
            : "Membresía del Estudiante"
        }
        description={`Curso: ${membership.courseSeason.course.name} · Temporada: ${membership.courseSeason.season.name}`}
        breadcrumb={[
          { label: "Membresías", href: `/admin/student-memberships` },
          {
            label: `Detalles`,
          },
        ]}
      />
      <div className="flex flex-col page-content">
        <TabsRouteNavigation
          routes={tabsRoutes}
          basePath={`/admin/student-memberships/${studentMembershipId}`}
          defaultRoute="/"
        />
        {children}
      </div>
    </>
  );
}
