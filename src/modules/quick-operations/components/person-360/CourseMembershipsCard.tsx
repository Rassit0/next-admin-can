"use client";
import React from "react";
import { Card } from "@heroui/react";
import { IStudentMembershipSummary } from "../../interfaces/secretary-summary.interface";
import {
  StatusChip as StudentStatusChip,
  StudentMembershipStatus,
} from "@/modules/student-memberships";

import { MembershipActions } from "@/modules/student-memberships/components/actions/MembershipActions";
import { IStudentMembership } from "@/modules/student-memberships";
import { revalidatePersonSummaryCache } from "../../actions/revalidate-summary";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { listItemTransition } from "@/ui/animations/transitions";

interface Props {
  memberships: IStudentMembershipSummary[];
  personId: string;
  onSuccess?: () => void;
}

export const CourseMembershipsCard = ({ memberships, personId, onSuccess }: Props) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Card className="h-full shadow-sm">
      <Card.Header>
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <i className="ri-book-read-line text-default-500"></i> Membresías
          Curso ({memberships.length})
        </h3>
      </Card.Header>
      <Card.Content className="px-4 py-2 flex flex-col gap-3 h-full">
        {memberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center grow p-4 text-default-400">
            <i className="ri-inbox-line text-2xl mb-1"></i>
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
                className="border border-default-200 rounded-lg p-3 flex flex-col gap-2 origin-top"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-semibold text-sm leading-tight">
                      {membership.courseName}
                    </h4>
                    <p className="text-xs text-default-500 mt-0.5">
                      {membership.institutionName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StudentStatusChip
                      status={membership.status as StudentMembershipStatus}
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
                <div className="flex justify-between items-end mt-1">
                  <span className="text-xs font-medium bg-default-100 text-default-600 px-2 py-0.5 rounded-md">
                    <i className="ri-time-line mr-1"></i>
                    {membership.shiftName
                      ? membership.shiftName
                      : "Turno no asignado"}
                  </span>
                  <span className="text-xs text-default-500">
                    <i className="ri-calendar-line"></i>{" "}
                    {new Date(membership.startedAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

      </Card.Content>
    </Card>
  );
};
