"use client";
import { Chip } from "@heroui/react";
import { IStudentMembership } from "@/modules/student-memberships";
import { getCurrentCycle, getPendingCurrentCycle, getUpcomingCycles, isMembershipInGap, getPastCycles } from "@/modules/student-memberships/helpers/domain";

interface Props {
  membership: IStudentMembership;
  size?: "sm" | "md" | "lg";
}

export const ParticipationChip = ({ membership, size = "sm" }: Props) => {
  const currentCycle = getCurrentCycle(membership.cycleEnrollments);
  const isGap = isMembershipInGap(membership);

  if (membership.status === "SUSPENDED") {
    return (
      <Chip color="default" variant="soft" size={size}>
        <span className="size-1.5 rounded-full bg-muted" aria-hidden />
        <Chip.Label>No disponible</Chip.Label>
      </Chip>
    );
  }

  if (currentCycle) {
    const startDate = new Date(currentCycle.cycleStartDate);
    const monthFormatter = new Intl.DateTimeFormat("es-BO", { month: "long", year: "numeric", timeZone: "UTC" });
    const monthName = monthFormatter.format(startDate);
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    return (
      <div className="flex flex-col gap-1 items-start">
        <Chip color="success" variant="soft" size={size}>
          <span className="size-1.5 rounded-full bg-success" aria-hidden />
          <Chip.Label>{capitalizedMonth}</Chip.Label>
        </Chip>
      </div>
    );
  }

  const pendingCycle = getPendingCurrentCycle(membership.cycleEnrollments);
  if (pendingCycle) {
    const startDate = new Date(pendingCycle.cycleStartDate);
    const monthFormatter = new Intl.DateTimeFormat("es-BO", { month: "long", year: "numeric", timeZone: "UTC" });
    const monthName = monthFormatter.format(startDate);
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    let expirationText = "";
    if (pendingCycle.createdAt) {
      const expirationDate = new Date(new Date(pendingCycle.createdAt).getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();
      const diffMs = Math.max(0, expirationDate.getTime() - now.getTime());
      
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours > 0) {
        expirationText = `Vence en ${diffHours} h`;
      } else {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        expirationText = `Vence en ${diffMins} min`;
      }
    }

    return (
      <div className="flex flex-col gap-1 items-start">
        <Chip color="warning" variant="soft" size={size}>
          <span className="size-1.5 rounded-full bg-warning" aria-hidden />
          <Chip.Label>{capitalizedMonth} (Pendiente)</Chip.Label>
        </Chip>
        {expirationText && <span className="text-[10px] text-muted font-medium">{expirationText}</span>}
      </div>
    );
  }

  const upcomingCycles = getUpcomingCycles(membership.cycleEnrollments);
  if (isGap && upcomingCycles.length > 0) {
    const nextCycle = upcomingCycles[0];
    const startDate = new Date(nextCycle.cycleStartDate);
    const monthFormatter = new Intl.DateTimeFormat("es-BO", { month: "long", year: "numeric", timeZone: "UTC" });
    const monthName = monthFormatter.format(startDate);
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    
    const pastCycles = getPastCycles(membership.cycleEnrollments);
    if (pastCycles.length === 0) {
      return (
        <div className="flex flex-col gap-1 items-start">
          <Chip color="accent" variant="soft" size={size}>
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            <Chip.Label>Próximo: {capitalizedMonth}</Chip.Label>
          </Chip>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1 items-start">
        <Chip color="warning" variant="soft" size={size}>
          <span className="size-1.5 rounded-full bg-warning" aria-hidden />
          <Chip.Label>En pausa</Chip.Label>
        </Chip>
        <span className="text-[10px] text-muted">Próximo: {capitalizedMonth}</span>
      </div>
    );
  }

  if (isGap) {
    return (
      <div className="flex flex-col gap-1 items-start">
        <Chip color="warning" variant="soft" size={size}>
          <span className="size-1.5 rounded-full bg-warning" aria-hidden />
          <Chip.Label>En pausa</Chip.Label>
        </Chip>
        <span className="text-[10px] text-muted">Sin ciclo vigente</span>
      </div>
    );
  }

  return (
    <Chip color="default" variant="soft" size={size}>
      <span className="size-1.5 rounded-full bg-muted" aria-hidden />
      <Chip.Label>Sin participación</Chip.Label>
    </Chip>
  );
};
