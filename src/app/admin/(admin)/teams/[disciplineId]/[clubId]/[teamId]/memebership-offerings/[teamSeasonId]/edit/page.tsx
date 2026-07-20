import {
  FormTeamOffering,
  getSeasonsOptions,
  getTeamSeasonById,
} from "@/modules/team-membership-offerings";
import { ButtonsSubmit } from "@/modules/team-membership-offerings/components/form/ButtonsSubmit";
import { getTeamById } from "@/modules/teams";
import { ErrorPage, HeaderPage } from "@/ui";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ teamId: string; teamSeasonId: string }>;
}

export default async function AddBidManagementPage({ params }: Props) {
  const { teamId, teamSeasonId } = await params;
  const [teamResponse, teamOfferingResponse] = await Promise.all([
    getTeamById({ id: teamId }),
    getTeamSeasonById({ id: teamSeasonId }),
  ]);

  if (teamResponse.error && teamResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (teamResponse.error) {
    return (
      <ErrorPage
        message={"Error al obtener el equipo"}
        path={{
          href: `/admin/clubs`,
          label: "Volver a la lista de clubes",
        }}
      />
    );
  }

  if (teamOfferingResponse.error && teamOfferingResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (teamOfferingResponse.error) {
    return (
      <ErrorPage
        message={"Error al obtener la oferta"}
        path={{
          href: `/clubs/${teamResponse.data.club.id}/manage/${teamId}/bid-management`,
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
            <span className="text-accent">{teamResponse.data.name}</span>
          </span>
        }
        description="Configuración de la nueva oferta para el equipo."
        action={
          <ButtonsSubmit
            cancelHref={`/admin/clubs/${teamResponse.data.club.id}/manage/${teamId}/bid-management`}
          />
        }
        urlBase="/admin/clubs"
        breadcrumb={[
          { label: "Clubes", href: "manage" },
          {
            label: teamResponse.data.club.name,
            href: `${teamResponse.data.club.id}/manage`,
          },
          {
            label: `${teamResponse.data.name}`,
            href: `${teamResponse.data.club.id}/manage/${teamId}/bid-management`,
          },
          { label: `Editar Oferta` },
        ]}
      />
      <FormTeamOffering
        teamSeason={teamOfferingResponse.data}
        team={teamResponse.data}
        urlRedirect={`/admin/clubs/${teamResponse.data.club.id}/manage/${teamId}/bid-management`}
      />
    </>
  );
}
