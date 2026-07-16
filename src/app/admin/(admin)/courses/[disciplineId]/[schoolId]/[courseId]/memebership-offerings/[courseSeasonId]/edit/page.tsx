import {
  FormCourseOffering,
  getSeasonsOptions,
  getCourseSeasonById,
} from "@/modules/course-membership-offerings";
import { ButtonsSubmit } from "@/modules/course-membership-offerings/components/form/ButtonsSubmit";
import { getCourseById } from "@/modules/courses";
import { ErrorPage, HeaderPage } from "@/ui";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ courseId: string; courseSeasonId: string }>;
}

export default async function AddBidManagementPage({ params }: Props) {
  const { courseId, courseSeasonId } = await params;
  const [courseResponse, courseOfferingResponse] = await Promise.all([
    getCourseById({ id: courseId }),
    getCourseSeasonById({ id: courseSeasonId }),
  ]);

  if (courseResponse.error && courseResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (courseResponse.error) {
    return (
      <ErrorPage
        message={"Error al obtener el equipo"}
        path={{
          href: `/admin/schools`,
          label: "Volver a la lista de schooles",
        }}
      />
    );
  }

  if (courseOfferingResponse.error && courseOfferingResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (courseOfferingResponse.error) {
    return (
      <ErrorPage
        message={"Error al obtener la oferta"}
        path={{
          href: `/schools/${courseResponse.data.school.id}/manage/${courseId}/bid-management`,
          label: "Volver a la lista de ofertas",
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
            cancelHref={`/admin/schools/${courseResponse.data.school.id}/manage/${courseId}/bid-management`}
          />
        }
        urlBase="/admin/schools"
        breadcrumb={[
          { label: "Gestión Schooles", href: "manage" },
          {
            label: courseResponse.data.school.name,
            href: `${courseResponse.data.school.id}/manage`,
          },
          {
            label: `Gestión de Ofertas - ${courseResponse.data.name}`,
            href: `${courseResponse.data.school.id}/manage/${courseId}/bid-management`,
          },
          { label: `Editar Oferta` },
        ]}
      />
      <FormCourseOffering
        courseSeason={courseOfferingResponse.data}
        course={courseResponse.data}
        urlRedirect={`/admin/schools/${courseResponse.data.school.id}/manage/${courseId}/bid-management`}
      />
    </>
  );
}
