import { ErrorPage, SectionFilters } from "@/ui";
import { getTeamSeasonById, getTeamSeasonCategories, CategorySelectFilter, ITeamSeasonCategory } from "@/modules/team-seasons";
import { TeamSeasonPaymentsMatrix } from "@/modules/reports/components/TeamSeasonPaymentsMatrix";
import { Card } from "@heroui/react";
import { resolvePageData } from "@/utils/resolvePageData";

interface Props {
  searchParams: Promise<{
    teamSeasonCategoryId?: string;
  }>;
  params: Promise<{
    teamSeasonId: string;
  }>;
}

export default async function PaymentsPage({ params, searchParams }: Props) {
  const { teamSeasonId } = await params;
  const { teamSeasonCategoryId } = await searchParams;

  const [teamSeasonResponse, categoriesResponse] = await resolvePageData([
    getTeamSeasonById({ id: teamSeasonId }),
    getTeamSeasonCategories(teamSeasonId),
  ]);

  if (teamSeasonResponse.error || !teamSeasonResponse.data) {
    return <ErrorPage message={teamSeasonResponse.message || "Error loading team season"} />;
  }

  const categories = categoriesResponse.data || [];
  const GENDER_MAP: Record<string, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
    MIXED: "Mixto",
  };

  return (
    <Card className="flex-1 rounded-t-none bg-surface p-1 shadow-sm md:p-4">
      <Card.Header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between w-full px-2">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">Control de Pagos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Matriz de control de pagos para esta temporada.
          </p>
        </div>
      </Card.Header>

      <Card.Content className="px-2 mt-2 flex flex-col gap-4">
        <SectionFilters>
          <CategorySelectFilter
            categories={categories.map((c: ITeamSeasonCategory) => ({
              id: c.id,
              name: `${c.category.name} - ${GENDER_MAP[c.gender] || c.gender}`,
            }))}
          />
        </SectionFilters>
        <TeamSeasonPaymentsMatrix 
          teamSeasonId={teamSeasonId} 
          teamSeasonCategoryId={teamSeasonCategoryId}
        />
      </Card.Content>
    </Card>
  );
}
