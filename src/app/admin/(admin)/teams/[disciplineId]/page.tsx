import {
  AddModal,
  FiltersBar,
  MetricsPanel,
  GridCards,
  getClubsOptions,
  SelectClubOptions,
  SelectDisciplineOptions,
  getDisciplinesOptions,
} from "@/modules/teams";
import { getTeams } from "@/modules/teams";
import { TableTeams } from "@/modules/teams/components/table/Table";
import { ServiceResponse } from "@/types/api";
import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { Card, Separator, Surface } from "@heroui/react";
import { FootballIcon, Structure04FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
  }>;
  params: Promise<{ disciplineId: string }>;
}

export default async function TeamsPage({ searchParams, params }: Props) {
  const { search, page, per_page } = await searchParams;
  const { disciplineId } = await params;

  const [clubsOptionsResponse, disciplinesOptionsResponse] = await Promise.all([
    getClubsOptions(disciplineId),
    getDisciplinesOptions(),
  ]);

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (clubsOptionsResponse.error && clubsOptionsResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (clubsOptionsResponse.error) {
    return (
      <ErrorPage
        message={clubsOptionsResponse.message}
        path={{ href: "/clubs", label: "Volver a la lista de clubes" }}
      />
    );
  }

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (
    disciplinesOptionsResponse.error &&
    disciplinesOptionsResponse.statusCode === 401
  ) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (disciplinesOptionsResponse.error) {
    return (
      <ErrorPage
        message={disciplinesOptionsResponse.message}
        path={{ href: "/clubs", label: "Volver a la lista de clubes" }}
      />
    );
  }

  return (
    <>
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Structure04FreeIcons} />
            <Card.Title className="text-xl font-bold">
              Seleccione una Disciplina
            </Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <SelectDisciplineOptions
            disciplineOptions={disciplinesOptionsResponse.data.data}
            urlBase="/admin/teams"
            disciplineId={disciplineId}
          />
        </Card.Content>
      </Card>
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={FootballIcon} />
            <Card.Title className="text-xl font-bold">
              Seleccione un Club
            </Card.Title>
          </div>
        </Card.Header>
        <Card.Content>
          <SelectClubOptions
            clubOptions={clubsOptionsResponse.data.data}
            urlBase={`/admin/teams/${disciplineId}`}
          />
        </Card.Content>
      </Card>
    </>
  );
}
