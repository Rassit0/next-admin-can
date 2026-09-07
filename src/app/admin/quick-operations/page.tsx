import React, { Suspense } from "react";
import { QuickOperationsClient } from "@/modules/quick-operations/components/QuickOperationsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operaciones Rápidas | Next Admin CAN",
  description: "Centro de búsqueda y operaciones de secretaría",
};

export default function QuickOperationsPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando...</div>}>
      <QuickOperationsClient />
    </Suspense>
  );
}
