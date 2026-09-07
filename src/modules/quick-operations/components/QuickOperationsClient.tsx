"use client";
import React, { useState } from "react";
import { SelectOrCreatePerson } from "@/modules/charge-transactions";
import { IPersonOption } from "@/common/actions/get-persons-options";
import { Person360Container } from "./Person360Container";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export const QuickOperationsClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const urlPersonId = searchParams.get("personId");

  const [personId, setPersonId] = useState<string | null>(urlPersonId);
  const [selectedPerson, setSelectedPerson] = useState<IPersonOption | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (personId) {
      if (params.get("personId") !== personId) {
        params.set("personId", personId);
        router.replace(`${pathname}?${params.toString()}`);
      }
    } else {
      if (params.has("personId")) {
        params.delete("personId");
        router.replace(`${pathname}?${params.toString()}`);
      }
    }
  }, [personId, pathname, router, searchParams]);

  React.useEffect(() => {
    if (urlPersonId && !selectedPerson) {
      setPersonId(urlPersonId);
    }
  }, [urlPersonId, selectedPerson]);

  return (
    <div className="flex flex-col w-full h-full p-6 pt-0">
      <div className="max-w-xl w-full bg-content1 p-4 rounded-xl shadow-sm border border-default-200">
        <SelectOrCreatePerson
          label="Buscar persona por nombre, apellido o documento"
          personId={personId}
          setPersonId={setPersonId}
          setSelectedPerson={setSelectedPerson}
        />
      </div>

      <Person360Container
        personId={personId}
        selectedPerson={selectedPerson}
      />
    </div>
  );
};
