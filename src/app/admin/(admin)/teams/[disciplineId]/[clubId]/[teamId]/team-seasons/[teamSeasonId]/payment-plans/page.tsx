import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Tabs } from "@heroui/react";
import {
  AddModal,
  getPaymentPlans,
  TablePaymentPlans,
} from "@/modules/payment-plans";
import { getTeamSeasonById } from "@/modules/team-seasons";
import { parseDate } from "@internationalized/date";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
  }>;
  params: Promise<{
    disciplineId: string;
    clubId: string;
    teamId: string;
    teamSeasonId: string;
  }>;
}
export default async function PaymentPlansPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page } = await searchParams;
  const { disciplineId, clubId, teamId, teamSeasonId } = await params;
  const [paymentPlansResponse, teamSeasonResponse] = await Promise.all([
    getPaymentPlans({
      search,
      page,
      per_page,
      teamSeasonId: teamSeasonId,
    }),
    getTeamSeasonById({ id: teamSeasonId }),
  ]);

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (paymentPlansResponse.error && paymentPlansResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (paymentPlansResponse.error) {
    return <ErrorPage message={paymentPlansResponse.message} />;
  }

  if (teamSeasonResponse.error) {
    return <ErrorPage message={teamSeasonResponse.message} />;
  }

  const basePath = `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons/${teamSeasonId}`;

  return (
    <>
      {/* <!-- Header --> */}
      <HeaderPage
        title={`Planes de Pago - ${teamSeasonResponse.data.team.name} - ${teamSeasonResponse.data.season.name}`}
        description="Administra los planes de pago de la temporada"
        action={<AddModal teamSeasonId={teamSeasonId} teamSeasonBillingType={teamSeasonResponse.data.billingConfig?.billingType!} />}
        breadcrumb={[
          { label: "Gestión Equipos", href: `/` },
          {
            label: `Gestión de Temporadas - ${teamSeasonResponse.data.team.name}`,
            href: `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons`,
          },
          {
            label: `Gestión de Planes de Pago - ${teamSeasonResponse.data.team.name} - ${teamSeasonResponse.data.season.name}`,
          },
        ]}
      />

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border pb-4">
        <Link href={`${basePath}/payment-plans`}>
          <div className="px-4 py-2 rounded-t-lg font-medium text-foreground border-b-2 border-accent bg-accent-soft">
            Planes de Pago
          </div>
        </Link>
        <Link href={`${basePath}/membresias`}>
          <div className="px-4 py-2 rounded-t-lg font-medium text-muted hover:text-foreground hover:bg-surface transition">
            Membresías
          </div>
        </Link>
        <Link href={`${basePath}/pagos`}>
          <div className="px-4 py-2 rounded-t-lg font-medium text-muted hover:text-foreground hover:bg-surface transition">
            Pagos
          </div>
        </Link>
      </div>

      {/* <!-- Search and Filter Bar (Tonal Architecture) --> */}
      <SectionFilters />
      {/* <!-- Main Member Table --> */}
      <TablePaymentPlans
        paymentPlans={paymentPlansResponse.data.data}
        teamSeasonId={teamSeasonId}
      />
      <PaginationSection
        totalPages={paymentPlansResponse.data.meta.totalPages}
        itemsPerPage={paymentPlansResponse.data.meta.itemsPerPage}
        totalItems={paymentPlansResponse.data.meta.totalItems}
      />
    </>
  );
}
