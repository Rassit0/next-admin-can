import { FormPerson } from "@/modules/persons";
import { getPlayerById } from "@/modules/players";
import { ErrorPage, HeaderPage } from "@/ui";
import { Tabs } from "@heroui/react";
import { cookies } from "next/headers";

interface Props {
  params: Promise<{ playerId: string; clubId: string }>;
}
export default async function PlayerPage({ params }: Props) {
  const { playerId, clubId } = await params;
  const playerResponse = await getPlayerById({ id: playerId });
  const cookieStore = await cookies();
  const playerBackUrl = cookieStore.get("playerBackUrl");

  if (playerResponse.error) {
    return <ErrorPage message={playerResponse.message} />;
  }

  return (
    <>
      <HeaderPage
        title={`${playerResponse.data.person.name} ${playerResponse.data.person.lastName}`}
        description={`Detalles de ${playerResponse.data.person.name} ${playerResponse.data.person.lastName}.`}
        breadcrumb={[
          {
            label: "Jugadores",
            href: playerBackUrl?.value || `/admin/players`,
          },
          {
            label: `${playerResponse.data.person.name}`,
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
              formId={`${playerId}-form-person`}
              person={playerResponse.data.person}
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
