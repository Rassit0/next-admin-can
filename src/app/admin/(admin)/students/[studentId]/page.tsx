import { FormPerson } from "@/modules/persons";
import { getStudentById } from "@/modules/students";
import { ErrorPage, HeaderPage } from "@/ui";
import { Tabs } from "@heroui/react";
import { cookies } from "next/headers";

interface Props {
  params: Promise<{ studentId: string; schoolId: string }>;
}
export default async function StudentPage({ params }: Props) {
  const { studentId, schoolId } = await params;
  const studentResponse = await getStudentById({ id: studentId });
  const cookieStore = await cookies();
  const studentBackUrl = cookieStore.get("studentBackUrl");

  if (studentResponse.error) {
    return <ErrorPage message={studentResponse.message} />;
  }

  return (
    <>
      <HeaderPage
        title={`${studentResponse.data.person.name} ${studentResponse.data.person.lastName}`}
        description={`Detalles de ${studentResponse.data.person.name} ${studentResponse.data.person.lastName}.`}
        breadcrumb={[
          {
            label: "Lista de Jugadores",
            href: studentBackUrl?.value || `/admin/students`,
          },
          {
            label: `Gestión del jugador(a) - ${studentResponse.data.person.name}`,
          },
        ]}
      />
      <Tabs className="w-full" variant="secondary">
        <Tabs.ListContainer>
          <Tabs.List aria-label="Info General">
            <Tabs.Tab id="info-general" className="py-6 md:py-2">
              Información General
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="contact-info" className="py-6 md:py-2">
              Contactos
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="medical-info" className="py-6 md:py-2">
              Información Médica
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="memberships" className="py-6 md:py-2">
              Membresías
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel className="pt-4" id="info-general">
          <div className="w-full">
            <FormPerson
              buttonsSubmit
              formId={`${studentId}-form-person`}
              person={studentResponse.data.person}
            />
          </div>
        </Tabs.Panel>
        <Tabs.Panel className="pt-4" id="contact-info">
          <p>Información de Contacto.</p>
        </Tabs.Panel>
        <Tabs.Panel className="pt-4" id="medical-info">
          <p>Información Médica.</p>
        </Tabs.Panel>
        <Tabs.Panel className="pt-4" id="memberships">
          <p>Membresías.</p>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
