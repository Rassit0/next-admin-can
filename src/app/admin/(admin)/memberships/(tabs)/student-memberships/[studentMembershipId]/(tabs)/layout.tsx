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
    { value: "/", title: "InformaciiÂ³n General" },
    { value: "/charges", title: "Cargos" },
    // { value: "/player-memberships", title: "MembresiÂ­as" },
    // { value: "/payment-plans", title: "Planes de Pago" },
    // { value: "/payments", title: "Transacciones" },
  ];

  return (
    <>
      <HeaderPage
        title={
          membership.student
            ? `${membership.student.person.name} ${membership.student.person.lastName} ${membership.student.person.secondLastName || ""}`
            : "MembresiÂ­a del Estudiante"
        }
        description={`Curso: ${membership.courseSeason.course.name} ÃÂ· Temporada: ${membership.courseSeason.season.name}`}
        breadcrumb={[
          { label: "MembresiÂ­as", href: `/admin/student-memberships` },
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
