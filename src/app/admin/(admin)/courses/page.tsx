import {
  getDisciplinesOptions,
  SelectSchoolOptions,
  SelectDisciplineOptions,
} from "@/modules/courses";
import { ErrorPage } from "@/ui";
import { Card } from "@heroui/react";
import { FootballIcon, Structure04FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { redirect } from "next/navigation";
import { resolvePageData } from "@/utils/resolvePageData";

export default async function CoursesPage() {
  const [disciplinesOptionsResponse] = await resolvePageData(
    [getDisciplinesOptions()],
    {
      path: { href: "/courses", label: "Volver a la lista de cursos" },
    },
  );

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
            urlBase="/admin/courses"
          />
        </Card.Content>
      </Card>
    </>
  );
}
