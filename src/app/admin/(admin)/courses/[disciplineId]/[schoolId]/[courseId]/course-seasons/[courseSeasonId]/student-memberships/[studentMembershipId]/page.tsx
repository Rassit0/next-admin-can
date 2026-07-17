import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPaymentPlans } from "@/modules/payment-plans";
import { getStudents } from "@/modules/students";
import { getCourseSeasonById } from "@/modules/course-seasons";
import {
  EnrollMembershipDrawer,
  getStudentMembershipById,
  getStudentMemberships,
  MetricsCards,
  TableMemberships,
  StatusChip,
} from "@/modules/student-memberships";
import { Button, Card, Alert, Chip, Tabs } from "@heroui/react";
import {
  Wallet01Icon,
  UserCircleIcon,
  File02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getCharges, TableCharges } from "@/modules/charge-transactions";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    status?: string;
  }>;
  params: Promise<{
    disciplineId: string;
    schoolId: string;
    courseId: string;
    courseSeasonId: string;
    studentMembershipId: string;
  }>;
}

export default async function StudentMembershipPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page, status } = await searchParams;
  const {
    disciplineId,
    schoolId,
    courseId,
    courseSeasonId,
    studentMembershipId,
  } = await params;

  const [membershipResponse, courseSeasonResponse, chargesResponse] =
    await Promise.all([
      getStudentMembershipById({ id: studentMembershipId }),
      getCourseSeasonById({ id: courseSeasonId }),
      getCharges({
        search,
        page,
        per_page,
        studentMembershipId,
      }),
    ]);

  if (membershipResponse.error && membershipResponse.statusCode === 401) {
    redirect("/login");
  }
  if (courseSeasonResponse.error) {
    return <ErrorPage message={courseSeasonResponse.message} />;
  }
  if (membershipResponse.error) {
    return <ErrorPage message={membershipResponse.message} />;
  }

  const courseSeason = courseSeasonResponse.data;
  const membership = membershipResponse.data;
  const charges = chargesResponse.error
    ? {
        data: [],
        meta: {
          currentPage: 1,
          itemsPerPage: 10,
          totalPages: 1,
          totalItems: 0,
        },
      }
    : chargesResponse.data;

  const GENDER_MAP: Record<string, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
    MIXED: "Mixto",
  };

  return (
    <>
      <HeaderPage
        title={`${courseSeason.category.name} (${GENDER_MAP[courseSeason.gender] || courseSeason.gender}) · ${courseSeason.season.name}`}
        description={`Equipo: ${courseSeason.course.name} · Gestiona las membresías de la temporada y sus cargos iniciales`}
        action={
          <>
            <Link
              href={`/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons/${courseSeasonId}/payments`}
            >
              <Button variant="secondary">
                <HugeiconsIcon icon={Wallet01Icon} size={18} />
                Ver pagos
              </Button>
            </Link>
          </>
        }
        breadcrumb={[
          { label: "Gestión Cursos", href: `/` },
          {
            label: `Temporadas`,
            href: `/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`,
          },
          {
            label: `Membresías`,
            href: `/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons/${courseSeasonId}/student-memberships`,
          },
          {
            label: `Jugador`,
          },
        ]}
      />

      <Tabs className="w-full" variant="secondary">
        <Tabs.ListContainer>
          <Tabs.List aria-label="Charges">
            <Tabs.Tab id="charges" className="py-6 md:py-2">
              Cargos
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="info" className="py-6 md:py-2">
              Información General
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
        <Tabs.Panel className="pt-4" id="charges">
          <div className="flex w-full flex-col gap-4">
            <div className="flex justify-between items-center">
              <SectionFilters
                actions={
                  <CreateManualChargeButton
                    studentMembershipId={studentMembershipId}
                  />
                }
              />
            </div>
            <TableCharges charges={charges.data} />
            <PaginationSection
              totalPages={charges.meta.totalPages}
              itemsPerPage={charges.meta.itemsPerPage}
              totalItems={charges.meta.totalItems}
            />
          </div>
        </Tabs.Panel>
        <Tabs.Panel className="pt-4" id="info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 shadow-sm border border-border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <HugeiconsIcon icon={UserCircleIcon} className="text-primary" />
                Datos Personales del Jugador
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Nombre Completo
                  </p>
                  <p className="font-semibold text-foreground text-md">
                    {membership.student?.person.name}{" "}
                    {membership.student?.person.lastName}{" "}
                    {membership.student?.person.secondLastName || ""}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Documento
                    </p>
                    <p className="font-semibold text-foreground">
                      {membership.student?.person.documentType}:{" "}
                      {membership.student?.person.documentNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Teléfono
                    </p>
                    <p className="font-semibold text-foreground">
                      {membership.student?.person.phone || "No registrado"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Correo Electrónico
                  </p>
                  <p className="font-semibold text-foreground">
                    {membership.student?.person.email || "No registrado"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-sm border border-border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <HugeiconsIcon icon={File02Icon} className="text-primary" />
                Detalles de la Membresía
              </h3>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Plan de Pago
                    </p>
                    <p className="font-semibold text-foreground">
                      {membership.paymentPlan?.name || "Sin Plan"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Estado Actual
                    </p>
                    <StatusChip status={membership.status} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fecha de Inicio
                    </p>
                    <p className="font-semibold text-foreground">
                      {new Date(membership.startedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fecha de Fin
                    </p>
                    <p className="font-semibold text-foreground">
                      {membership.finishedAt
                        ? new Date(membership.finishedAt).toLocaleDateString()
                        : "Indefinido"}
                    </p>
                  </div>
                </div>
                {membership.totalPendingAmount > 0 && (
                  <div className="mt-2 p-3 bg-danger-50 text-danger-600 rounded-lg">
                    <p className="text-sm font-semibold">
                      Deuda Total Pendiente
                    </p>
                    <p className="text-xl font-bold">
                      {membership.totalPendingAmount} Bs
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </Tabs.Panel>
        <Tabs.Panel className="pt-4" id="medical-info">
          <Card className="p-5 shadow-sm border border-border">
            <p className="text-muted-foreground text-center">
              La información médica no está disponible por el momento.
            </p>
          </Card>
        </Tabs.Panel>
        <Tabs.Panel className="pt-4" id="memberships">
          <Card className="p-5 shadow-sm border border-border">
            <p className="text-muted-foreground text-center">
              El historial de membresías estará disponible pronto.
            </p>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

import { CreateManualChargeButton } from "./CreateManualChargeButton";
