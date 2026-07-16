import { getSchoolById } from "@/modules/schools";
import {
  FormCourseOffering,
  getSeasonsOptions,
} from "@/modules/course-membership-offerings";
import { ButtonsSubmit } from "@/modules/course-membership-offerings/components/form/ButtonsSubmit";
import { getCourseById } from "@/modules/courses";
import { ErrorPage, HeaderPage } from "@/ui";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ disciplineId: string; schoolId: string; courseId: string }>;
}

export default async function AddBidManagementPage({ params }: Props) {
  const { disciplineId, schoolId, courseId } = await params;
  const [courseResponse, schoolResponse] = await Promise.all([
    getCourseById({ id: courseId }),
    getSchoolById({ id: schoolId }),
  ]);

  if (courseResponse.error && courseResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (courseResponse.error) {
    return <ErrorPage message={courseResponse.message} />;
  }

  if (schoolResponse.error && schoolResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (schoolResponse.error) {
    return (
      <ErrorPage
        message={schoolResponse.message}
        path={{
          href: `/schools`,
          label: "Volver a la lista de schooles",
        }}
      />
    );
  }
  return (
    <>
      <HeaderPage
        title={
          <span className="text-4xl font-bold">
            Nueva Oferta -{" "}
            <span className="text-accent">{courseResponse.data.name}</span>
          </span>
        }
        description="Configuración de la nueva oferta para el equipo."
        action={
          <ButtonsSubmit
            cancelHref={`/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`}
          />
        }
        urlBase={`/admin/courses/${disciplineId}/${schoolId}`}
        breadcrumb={[
          { label: "Gestión Equipos", href: "/" },
          {
            label: `Gestión de Temporadas - ${courseResponse.data.name}`,
            href: `${courseId}/course-seasons`,
          },
          { label: `Nueva Oferta` },
        ]}
      />
      <FormCourseOffering
        course={courseResponse.data}
        urlRedirect={`/admin/schools/${schoolId}/manage/${courseId}/bid-management`}
      />
    </>
  );
}
