import {
  ButtonsSubmit,
  FormTeamSeason,
  getCategoriesByDisciplineOptions,
  getSeasonsByDisciplineOptions,
} from "@/modules/team-seasons";
import { getTeamById } from "@/modules/teams";
import { ErrorPage, HeaderPage } from "@/ui";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ disciplineId: string; clubId: string; teamId: string }>;
}

export default async function AddTeamSeasonPage({ params }: Props) {
  const { disciplineId, clubId, teamId } = await params;
  const [teamResponse, categoriesOptions, seasonsOptions] = await Promise.all([
    getTeamById({ id: teamId }),
    getCategoriesByDisciplineOptions(disciplineId),
    getSeasonsByDisciplineOptions(disciplineId),
  ]);

  if (teamResponse.error && teamResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (teamResponse.error) {
    return (
      <ErrorPage
        message={teamResponse.message}
        path={{
          href: `/clubs`,
          label: "Volver a la lista de clubes",
        }}
      />
    );
  }

  if (categoriesOptions.error) {
    return (
      <ErrorPage
        message={categoriesOptions.message}
        path={{
          href: `/clubs/${teamResponse.data.club.id}/manage`,
          label: "Volver a la lista de equipos",
        }}
      />
    );
  }

  if (seasonsOptions.error) {
    return (
      <ErrorPage
        message={seasonsOptions.message}
        path={{
          href: `/clubs/${teamResponse.data.club.id}/manage`,
          label: "Volver a la lista de equipos",
        }}
      />
    );
  }
  return (
    <>
      <HeaderPage
        title={`Crear Oferta de Temporada - ${teamResponse.data.name}`}
        description="Formulario para la creación de una nueva oferta de temporada."
        action={
          <>
            <ButtonsSubmit
              cancelHref={`/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons`}
              formId="form-team-season"
            />
          </>
        }
        urlBase={`/admin/teams/${disciplineId}/${clubId}`}
        breadcrumb={[
          { label: "Gestión Equipos", href: `/` },
          {
            label: `Gestión de Temporadas - ${teamResponse.data.name}`,
            href: `${teamId}/team-seasons`,
          },
          {
            label: `Crear Oferta de Temporada`,
          },
        ]}
      />
      <FormTeamSeason
        formId="form-team-season"
        team={teamResponse.data}
        categoriesOptions={categoriesOptions.data.data}
        seasonsOptions={seasonsOptions.data.data}
        urlRedirect={`/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons`}
      />
    </>
  );
}
