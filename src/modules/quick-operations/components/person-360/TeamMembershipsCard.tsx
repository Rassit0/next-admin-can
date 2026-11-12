"use client";
import React from "react";
import { Card } from "@heroui/react";
import { IPlayerMembershipSummary } from "../../interfaces/secretary-summary.interface";
import {
  StatusChip as PlayerStatusChip,
  PlayerMembershipStatus,
} from "@/modules/player-memberships";

import { MembershipActions } from "@/modules/player-memberships/components/actions/MembershipActions";
import { IPlayerMembership } from "@/modules/player-memberships";
import { revalidatePersonSummaryCache } from "../../actions/revalidate-summary";
import { formatCurrency } from "@/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { listItemTransition } from "@/ui/animations/transitions";
import { getChargeOriginConfig } from "@/modules/charge-transactions/constants/charge-origin";

interface Props {
  memberships: IPlayerMembershipSummary[];
  personId: string;
  onSuccess?: () => void;
}

export const TeamMembershipsCard = ({
  memberships,
  personId,
  onSuccess,
}: Props) => {
  const prefersReducedMotion = useReducedMotion();
  const origin = getChargeOriginConfig("MEMBERSHIP");

  return (
    <Card className="h-full shadow-sm">
      <Card.Header className="pb-1">
        <div className="flex items-center justify-between gap-2 w-full">
          <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2 text-foreground">
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-md border ${origin.headerIconBoxClass}`}
              aria-hidden
            >
              <i className={`${origin.iconClass} text-sm`} />
            </span>
            <span>Membresías Team</span>
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-default/60 text-muted tabular-nums">
            {memberships.length}
          </span>
        </div>
      </Card.Header>
      <Card.Content className="px-4 pt-1 pb-4 flex flex-col gap-2.5 h-full">
        {memberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center grow p-4 text-muted">
            <i className="ri-inbox-line text-2xl mb-1" aria-hidden />
            <p className="text-sm text-center">No hay membresías de equipo</p>
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
                    {membership.teamName}
                  </h4>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <PlayerStatusChip
                      status={membership.status as PlayerMembershipStatus}
                      size="sm"
                    />
                    <MembershipActions
                      membership={membership as unknown as IPlayerMembership}
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
                    <i
                      className={`ri-calendar-event-line ${origin.seasonIconClass} shrink-0 text-[13px]`}
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
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 min-w-0">
                      <span className="font-medium text-foreground/85 wrap-break-word">
                        {membership.disciplineName}
                      </span>
                      <span className="text-muted/60" aria-hidden>
                        •
                      </span>
                      <span className="text-muted wrap-break-word">
                        {membership.categoryName}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted flex items-center gap-1 shrink-0 tabular-nums ml-auto">
                      <i className="ri-calendar-line text-[12px]" aria-hidden />
                      <span>
                        {new Date(membership.startedAt).toLocaleDateString()}
                      </span>
                    </span>
                  </div>

                  {membership.status !== "CANCELLED" &&
                    membership.status !== "WITHDRAWN" &&
                    membership.totalPendingAmount !== undefined && (
                      <div className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-muted">Estado de cuenta</span>
                        {membership.totalPendingAmount > 0 ? (
                          <span className="font-medium text-warning tabular-nums">
                            Deuda: {formatCurrency(membership.totalPendingAmount)}
                          </span>
                        ) : (
                          <span className="font-medium text-success">
                            Al día
                          </span>
                        )}
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
