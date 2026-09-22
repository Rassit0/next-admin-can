import { ModuleGuard } from "@/ui";
import React from "react";
import { notFound } from "next/navigation";
import { getSecretarySummary } from "@/modules/quick-operations/actions/get-secretary-summary";
import { Person360Container } from "@/modules/quick-operations/components/Person360Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ficha Personal | Next Admin CAN",
};

interface Props {
  params: Promise<{ personId: string }>;
}

export default async function QuickOperationsPersonPage({ params }: Props) {
  const { personId } = await params;

  const summaryRes = await getSecretarySummary(personId);

  if (summaryRes.error || !summaryRes.data) {
    if (summaryRes.statusCode === 404 || summaryRes.message?.toLowerCase().includes("not found")) {
      notFound();
    }
    
    return (
      <div className="flex flex-col items-center justify-center p-12 text-danger border-2 border-dashed border-danger-200 rounded-xl mt-6">
        <p className="text-lg">Error al cargar la información.</p>
        <p className="text-sm">{summaryRes.message}</p>
      </div>
    );
  }

  // selectedPerson is used for the header/drawers
  const selectedPerson = {
    id: summaryRes.data.data.profile.id,
    name: summaryRes.data.data.profile.name,
    lastName: summaryRes.data.data.profile.lastName,
    secondLastName: summaryRes.data.data.profile.secondLastName,
    documentType: summaryRes.data.data.profile.documentNumber ? "DNI" : null, // Fallback if type missing
    documentNumber: summaryRes.data.data.profile.documentNumber || null,
    imageUrl: summaryRes.data.data.profile.imageUrl || null,
    gender: null, // Since gender is not in IPersonProfileSummary, we can pass null
    birthDate: null,
    fullName: `${summaryRes.data.data.profile.lastName} ${summaryRes.data.data.profile.secondLastName || ""} ${summaryRes.data.data.profile.name}`.replace(/\s+/g, " ").trim(),
  };

  return (
    <ModuleGuard moduleId="quick-operations" childRouteId="quick-operations-person">
      <Person360Container
      personId={personId}
      selectedPerson={selectedPerson as any}
      initialSummary={summaryRes.data.data}
      />
    </ModuleGuard>
  );
}

