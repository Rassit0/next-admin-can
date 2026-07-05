import {
  ErrorPage,
  HeaderPage,
  PaginationSection,
  SectionFilters,
  TabsTypeFilter,
} from "@/ui";
import { redirect } from "next/navigation";
import {
  AddModal,
  getDisciplinesOptions,
  getSeasons,
  GridCards,
  SelectDisciplineOptions,
  TableSeasons,
} from "@/modules/seasons";
import { Card } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Structure04FreeIcons } from "@hugeicons/core-free-icons";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    sortField?: "name" | "startDate" | "endDate" | "createdAt" | "updatedAt";
    orderBy?: "asc" | "desc";
  }>;
}
export default async function SelectDisciplineSeasonsPage({
  searchParams,
}: Props) {
  const { search, page, per_page, sortField, orderBy } = await searchParams;
  const [disciplinesOptionsResponse] = await Promise.all([
    getDisciplinesOptions(),
  ]);

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (
    disciplinesOptionsResponse.error &&
    disciplinesOptionsResponse.statusCode === 401
  ) {
    redirect("/login");
  }

  if (disciplinesOptionsResponse.error) {
    return <ErrorPage message={disciplinesOptionsResponse.message} />;
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
            urlBase="/admin/seasons"
          />
        </Card.Content>
      </Card>
    </>
  );
}
