"use client";
import React from "react";
import { Card } from "@heroui/react";
import { IStudentMembershipSummary } from "../../interfaces/secretary-summary.interface";
import {
  StatusChip as StudentStatusChip,
  StudentMembershipStatus,
} from "@/modules/student-memberships";
import { ParticipationChip } from "@/modules/student-memberships/components/status/ParticipationChip";
import { MembershipActions } from "@/modules/student-memberships/components/actions/MembershipActions";
import { IStudentMembership } from "@/modules/student-memberships";
import { revalidatePersonSummaryCache } from "../../actions/revalidate-summary";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { listItemTransition } from "@/ui/animations/transitions";
import { getChargeOriginConfig } from "@/modules/charge-transactions/constants/charge-origin";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen01Icon,
  Calendar03Icon,
  Clock01Icon,
  InboxIcon,
} from "@hugeicons/core-free-icons";

interface Props {
  memberships: IStudentMembershipSummary[];
  personId: string;
  onSuccess?: () => void;
}

export const CourseMembershipsCard = ({
  memberships,
  personId,
  onSuccess,
}: Props) => {
  const prefersReducedMotion = useReducedMotion();
  const origin = getChargeOriginConfig("STUDENT");

  return (
    <Card className="h-full shadow-sm">
      <Card.Header className="pb-1">
        <div className="flex items-center justify-between gap-2 w-full">
          <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2 text-foreground">
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-md border shrink-0 ${origin.headerIconBoxClass}`}
              aria-hidden
            >
              <HugeiconsIcon
                icon={BookOpen01Icon}
                size={14}
                className="shrink-0 text-current"
              />
            </span>
            <span>Membresías Curso</span>
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-default/60 text-muted tabular-nums">
            {memberships.length}
          </span>
        </div>
      </Card.Header>
      <Card.Content className="px-4 pt-1 pb-4 flex flex-col gap-2.5 h-full">
        {memberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center grow p-4 text-muted">
            <HugeiconsIcon
              icon={InboxIcon}
              size={32}
              className="mb-1 opacity-60 text-muted"
              aria-hidden
            />
            <p className="text-sm text-center">No hay membresías de curso</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {memberships.map((membership) => (
              <motion.div
                key={membership.id}
                layout={!prefersReducedMotion}
                variants={prefersReducedMotion ? {} : listItemTransition}
                initial="hidden"
                animate="show"
                exit="exit"
                className={`rounded-xl border border-border/80 ${origin.accentBorderClass} bg-surface-secondary/50 hover:bg-surface-secondary/80 transition-colors p-3 flex flex-col gap-2 origin-top`}
              >
                {/* Bloque superior: identificación */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-foreground leading-snug min-w-0 flex-1 wrap-break-word">
                    {membership.courseName}
                  </h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <StudentStatusChip
                      status={membership.status as StudentMembershipStatus}
                      size="sm"
                    />
                    <MembershipActions
                      membership={membership as unknown as IStudentMembership}
                      origin="person-360"
                      onSuccess={async () => {
                        await revalidatePersonSummaryCache(personId);
                        onSuccess?.();
                      }}
                    />
                  </div>
                </div>

                {/* Bloque intermedio: temporada */}
                {membership.seasonName && (
                  <div className="flex items-center gap-2 rounded-lg bg-default/45 border border-border/40 px-2.5 py-1 text-xs font-medium text-foreground/95 min-w-0">
                    <HugeiconsIcon
                      icon={Calendar03Icon}
                      size={13}
                      className={`${origin.seasonIconClass} shrink-0`}
                      aria-hidden
                    />
                    <span className="leading-snug wrap-break-word min-w-0">
                      {membership.seasonName}
                    </span>
                  </div>
                )}

                {/* Bloque inferior: información complementaria */}
                <div className="pt-2 border-t border-border/50 flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-foreground/85 min-w-0">
                      <HugeiconsIcon
                        icon={Clock01Icon}
                        size={12}
                        className="text-muted shrink-0"
                        aria-hidden
                      />
                      <span className="leading-snug wrap-break-word min-w-0">
                        {membership.shiftName
                          ? membership.shiftName
                          : "Turno no asignado"}
                      </span>
                    </span>
                    <span className="text-[11px] text-muted flex items-center gap-1 shrink-0 tabular-nums ml-auto">
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        size={12}
                        className="text-muted shrink-0"
                        aria-hidden
                      />
                      <span>
                        {new Date(membership.startedAt).toLocaleDateString()}
                      </span>
                    </span>
                  </div>

                  {membership.cycleEnrollments &&
                    membership.status !== "CANCELLED" &&
                    membership.status !== "WITHDRAWN" && (
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="text-muted">Ciclo</span>
                        <div className="opacity-85">
                          <ParticipationChip
                            membership={membership as unknown as IStudentMembership}
                            size="sm"
                          />
                        </div>
                      </div>
                    )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </Card.Content>
    </Card>
  );
};
