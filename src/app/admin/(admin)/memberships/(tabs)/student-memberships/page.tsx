import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPaymentPlans } from "@/modules/payment-plans";
import { getPlayers } from "@/modules/players";
import { getTeamSeasonById } from "@/modules/team-seasons";

import {
  CreateMassiveManualChargeButton,
  TableMemberships,
} from "@/modules/student-memberships";
import { resolvePageData } from "@/utils/resolvePageData";
import { getStudentMemberships } from "@/modules/student-memberships";

import { Button, Card, Alert, Chip, Popover } from "@heroui/react";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    status?: string;
    courseSeasonId?: string;
  }>;
  params: Promise<{}>;
}

export default async function StudentMembershipsPage({ searchParams }: Props) {
  const {
    search,
    page,
    per_page = "5",
    status,
    courseSeasonId,
  } = await searchParams;

  const [membershipsRes, paymentPlansRes] = await resolvePageData([
    getStudentMemberships({
      search,
      page,
      per_page,
      courseSeasonId,
      status,
    }),
    getPaymentPlans({ per_page: "100", courseSeasonId }),
  ]);

  const memberships = membershipsRes.data.data;
  const meta = membershipsRes.data.meta;
  const paymentPlans = paymentPlansRes.data;

  const GENDER_MAP: Record<string, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
    MIXED: "Mixto",
  };

  return (
    <>
      <div className="flex flex-col gap-6 mt-2">
        <Card className="shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border">
          <HeaderPage
            title="Listado de Membresías"
            description="Gestiona todas las membresías, planes de pago y cargos de los atletas."
            action={
              <>
                {courseSeasonId && (
                  <CreateMassiveManualChargeButton
                    courseSeasonId={courseSeasonId}
                  />
                )}
              </>
            }
            showButtonBack={false}
          />
          <SectionFilters />
          <TableMemberships
            memberships={memberships}
            showStudentDetail={true}
          />
          <PaginationSection
            totalPages={meta.totalPages}
            itemsPerPage={meta.itemsPerPage}
            totalItems={meta.totalItems}
          />
        </Card>
      </div>
    </>
  );
}
