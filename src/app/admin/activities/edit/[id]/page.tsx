import {
  FormActivity,
  getActivityById,
  getLocationsOptions,
} from "@/modules/activities";
import { ErrorPage, HeaderPage } from "@/ui";
import { redirect } from "next/navigation";

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (isNaN(Number(id))) {
    return <ErrorPage message="ID de actividad inválido" />;
  }

  const response = await getActivityById({ id });

  const locationsResponse = await getLocationsOptions();

  if ((response.error && response.statusCode !== 200) || !response.data) {
    return <ErrorPage message={response.message} />;
  }

  if (
    (locationsResponse.error && locationsResponse.statusCode !== 200) ||
    !locationsResponse.data
  ) {
    return <ErrorPage message={locationsResponse.message} />;
  }

  return (
    <>
      {/* <!-- Breadcrumbs & Header --> */}
      <HeaderPage
        title="Crear Actividad"
        description="Configure los parámetros técnicos, financieros y operativos de la nueva oferta del club."
        //   action={<AddModal />}
        breadcrumb={[
          { label: "Actividades", href: "/activities" },
          { label: "Nueva Actividad" },
        ]}
      />
      {/* <FormActivity
        typesPermits="all"
        activity={response.data}
        formId="form-edit-activity"
      /> */}
    </>
  );
}
