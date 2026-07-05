import {
  getDisciplinesOptions,
  SelectClubOptions,
  SelectDisciplineOptions,
} from "@/modules/teams";
import { ErrorPage } from "@/ui";
import { Card } from "@heroui/react";
import { FootballIcon, Structure04FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { redirect } from "next/navigation";

export default async function TeamsPage() {
  const disciplinesOptionsResponse = await getDisciplinesOptions();

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
        path={{ href: "/teams", label: "Volver a la lista de equipos" }}
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
          />
        </Card.Content>
      </Card>
    </>
  );
}
