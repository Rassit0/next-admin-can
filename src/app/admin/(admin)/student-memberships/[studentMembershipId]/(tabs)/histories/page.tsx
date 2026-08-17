import React from "react";
import { MembershipTimeline } from "@/modules/student-memberships/components/MembershipTimeline";

interface PageProps {
  params: Promise<{
    studentMembershipId: string;
  }>;
}

export default async function StudentMembershipHistoriesPage({
  params,
}: PageProps) {
  const { studentMembershipId } = await params;

  return (
    <div className="flex flex-col gap-6 py-6 max-w-3xl">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Actividad de la Membresía</h2>
        <p className="text-default-500 text-sm">
          Registro de cambios de estado, transferencias de turno y otras acciones administrativas.
        </p>
      </div>
      
      <MembershipTimeline studentMembershipId={studentMembershipId} />
    </div>
  );
}
