import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPaymentPlans } from "@/modules/payment-plans";
import { getStudents } from "@/modules/students";
import {
  getCourseSeasonById,
  ShiftSelectFilter,
} from "@/modules/course-seasons";
import {
  EnrollMembershipDrawer,
  getStudentMemberships,
  MetricsCards,
  TableMemberships,
  CycleCapacityModal,
} from "@/modules/student-memberships";
import { Button, Card, Alert, Chip, Popover } from "@heroui/react";
import {
  Wallet01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const InfoTooltip = ({ text }: { text: string }) => (
  <Popover>
    <Button
      isIconOnly
      variant="ghost"
      size="sm"
      className="h-4 w-4 min-w-4 text-muted-foreground ml-1 p-0"
    >
      <HugeiconsIcon icon={InformationCircleIcon} size={14} />
    </Button>
    <Popover.Content placement="top">
      <Popover.Dialog className="max-w-50 px-3 py-2">
        <Popover.Arrow />
        <p className="text-xs font-normal normal-case tracking-normal text-foreground">
          {text}
        </p>
      </Popover.Dialog>
    </Popover.Content>
  </Popover>
);

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    status?: string;
    shiftId?: string;
  }>;
  params: Promise<{
    disciplineId: string;
    schoolId: string;
    courseId: string;
    courseSeasonId: string;
  }>;
}

export default async function StudentMembershipsPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page = "5", status, shiftId } = await searchParams;
  const { disciplineId, schoolId, courseId, courseSeasonId } = await params;

  const [membershipsResponse, courseSeasonResponse, paymentPlansResponse] =
    await resolvePageData([
      getStudentMemberships({
        search,
        page,
        per_page,
        courseSeasonId,
        status,
        shiftId,
      }),
      getCourseSeasonById({ id: courseSeasonId }),
      getPaymentPlans({ per_page: "100", courseSeasonId }),
    ]);

  const courseSeason = courseSeasonResponse.data;
  const memberships = membershipsResponse.data.data;
  const meta = membershipsResponse.data.meta;
  const paymentPlans = paymentPlansResponse.error
    ? []
    : paymentPlansResponse.data.data;

  const GENDER_MAP: Record<string, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
    MIXED: "Mixto",
  };

  return (
    <>
      <div className="flex flex-col gap-6 page-content mt-2">
        <Card className="shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border">
          <HeaderPage
            title="Atletas inscritos"
            description="Asigna membresías y revisa los cargos iniciales generados"
            action={
              <div className="w-full flex gap-2 justify-end">
                <CycleCapacityModal courseSeasonId={courseSeasonId} />
                <CreateMassiveManualChargeButton
                  courseSeasonId={courseSeasonId}
                />
                <EnrollMembershipDrawer
                  courseSeason={courseSeason}
                  paymentPlans={paymentPlans}
                  size="md"
                  defaultShiftId={shiftId}
                />
              </div>
            }
            showButtonBack={false}
          />
          <SectionFilters>
            <ShiftSelectFilter
              shifts={courseSeason.shifts.map((s: any) => ({
                id: s.id,
                name: s.shift.name,
              }))}
            />
          </SectionFilters>
          <TableMemberships
            memberships={memberships}
            courseSeason={courseSeason}
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

import { CreateMassiveManualChargeButton } from "@/modules/student-memberships";
import { resolvePageData } from "@/utils/resolvePageData";
