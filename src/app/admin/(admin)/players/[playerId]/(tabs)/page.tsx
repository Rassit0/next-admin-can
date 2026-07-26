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
      <FormPerson
        buttonsSubmit
        formId={`${playerId}-form-person`}
        person={playerResponse.data.person}
      />
    </>
  );
}
