"use client";
import React, { useState } from "react";
import { SelectOrCreatePerson } from "@/modules/charge-transactions";
import { IPersonOption } from "@/common/actions/get-persons-options";
import { Person360Container } from "./Person360Container";
import { findPersonById } from "@/modules/persons/actions/find-by-id";
import { Spinner } from "@heroui/react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export const QuickOperationsClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const urlPersonId = searchParams.get("personId");

  const [personId, setPersonId] = useState<string | null>(urlPersonId);
  const [selectedPerson, setSelectedPerson] = useState<IPersonOption | null>(
    null,
  );

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

  const [isInitializing, setIsInitializing] = useState(!!urlPersonId);

  React.useEffect(() => {
    const initializeSelectedPerson = async () => {
      if (urlPersonId) {
        setPersonId(urlPersonId);
        const res = await findPersonById({ id: urlPersonId });
        if (res.data) {
          const person = res.data;
          setSelectedPerson({
            id: person.id,
            fullName:
              `${person.lastName || ""} ${person.secondLastName || ""} ${person.name}`
                .replace(/\s+/g, " ")
                .trim(),
            name: person.name,
            lastName: person.lastName || "",
            secondLastName: person.secondLastName || null,
            documentType: person.documentType || null,
            documentNumber: person.documentNumber || null,
            imageUrl: person.imageUrl || null,
            gender: person.gender || null,
            birthDate: person.birthDate || null,
          });
        }
      }
      setIsInitializing(false);
    };

    if (!selectedPerson) {
      initializeSelectedPerson();
    } else {
      setIsInitializing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isInitializing) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center p-6 pt-0">
        <Spinner size="lg" color="accent" />
        <p className="mt-4 text-default-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-6 pt-0">
      <div className="max-w-xl w-full bg-content1 p-4 rounded-xl shadow-sm border border-default-200">
        <SelectOrCreatePerson
          label="Buscar persona por nombre, apellido o documento"
          personId={personId}
          setPersonId={setPersonId}
          setSelectedPerson={setSelectedPerson}
          isRequired={false}
          defaultPerson={selectedPerson}
        />
      </div>

      <Person360Container personId={personId} selectedPerson={selectedPerson} />
    </div>
  );
};
