import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPaymentPlans } from "@/modules/payment-plans";
import { getPlayers } from "@/modules/players";
import { getTeamSeasonById } from "@/modules/team-seasons";
import {
  EnrollMembershipDrawer,
  getPlayerMemberships,
  MetricsCards,
  TableMemberships,
} from "@/modules/player-memberships";
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
  }>;
  params: Promise<{
    disciplineId: string;
    clubId: string;
    teamId: string;
    teamSeasonId: string;
  }>;
}

export default async function PlayerMembershipsPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page, status } = await searchParams;
  const { disciplineId, clubId, teamId, teamSeasonId } = await params;

  const [membershipsResponse, teamSeasonResponse, paymentPlansResponse] =
    await Promise.all([
      getPlayerMemberships({ search, page, per_page, teamSeasonId, status }),
      getTeamSeasonById({ id: teamSeasonId }),
      getPaymentPlans({ per_page: "100", teamSeasonId }),
    ]);

  if (membershipsResponse.error && membershipsResponse.statusCode === 401) {
    redirect("/login");
  }
  if (teamSeasonResponse.error) {
    return <ErrorPage message={teamSeasonResponse.message} />;
  }
  if (membershipsResponse.error) {
    return <ErrorPage message={membershipsResponse.message} />;
  }

  const teamSeason = teamSeasonResponse.data;
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
      <div className="flex flex-col gap-6 mt-2">
        <Card className="shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border">
          <HeaderPage
            title="Atletas inscritos"
            description="Asigna membresías y revisa los cargos iniciales generados"
            action={
              <div className="w-full flex gap-2 justify-end">
                <CreateMassiveManualChargeButton teamSeasonId={teamSeasonId} />
                <EnrollMembershipDrawer
                  teamSeason={teamSeason}
                  paymentPlans={paymentPlans}
                  size="md"
                />
              </div>
            }
            showButtonBack={false}
          />
          <SectionFilters />
          <TableMemberships memberships={memberships} teamSeason={teamSeason} />
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

import { CreateMassiveManualChargeButton } from "@/modules/player-memberships";
