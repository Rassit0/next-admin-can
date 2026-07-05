import { FormActivity, getLocationsOptions } from "@/modules/activities";
import { ErrorPage, HeaderPage } from "@/ui";
import { redirect } from "next/navigation";

export default async function AddActivityPage() {
  const result = await getLocationsOptions();

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (result.error && result.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (result.error) {
    return <ErrorPage message={result.message} />;
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
      {/* <FormActivity formId="form-add-activity"
       locations={result.data.data} 
      /> */}
    </>
  );
}
