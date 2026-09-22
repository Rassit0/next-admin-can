import { ModuleGuard } from "@/ui";
import React from "react";
import { notFound } from "next/navigation";
import { getSecretarySummary } from "@/modules/quick-operations/actions/get-secretary-summary";
import { getPersonContacts } from "@/modules/persons/actions/get-person-contacts";
import { Person360Container } from "@/modules/quick-operations/components/Person360Container";
import { resolvePageData } from "@/utils/resolvePageData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ficha Personal | Next Admin CAN",
};

interface Props {
  params: Promise<{ personId: string }>;
}

export default async function QuickOperationsPersonPage({ params }: Props) {
  const { personId } = await params;

  const [summaryRes, contactsRes] = await resolvePageData(
    [getSecretarySummary(personId), getPersonContacts(personId)],
    { path: { href: "/admin/quick-operations", label: "Volver al listado" } }
  );

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
    fullName:
      `${summaryRes.data.data.profile.lastName} ${summaryRes.data.data.profile.secondLastName || ""} ${summaryRes.data.data.profile.name}`
        .replace(/\s+/g, " ")
        .trim(),
  };

  return (
    <ModuleGuard
      moduleId="quick-operations"
      childRouteId="quick-ops-person"
    >
      <Person360Container
        personId={personId}
        selectedPerson={selectedPerson as any}
        initialSummary={summaryRes.data.data}
        initialContacts={contactsRes.data}
      />
    </ModuleGuard>
  );
}
