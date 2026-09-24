"use client";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { IPersonOption, SelectOrCreatePerson } from "@/modules/persons";
import { findPersonById } from "@/modules/persons/actions/find-by-id";
import { useRouter, useParams, usePathname } from "next/navigation";

export const QuickOperationsPersonSelector = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const personIdParam = params.personId as string | undefined;

  const [personId, setPersonId] = useState<string | null>(
    personIdParam || null,
  );
  const [selectedPerson, setSelectedPerson] = useState<IPersonOption | null>(
    null,
  );

  // Sincronizar personId con la URL
  useEffect(() => {
    if (personIdParam) {
      if (personIdParam !== personId) {
        setPersonId(personIdParam);
      }

      // Fetch the person data if we don't have it
      if (!selectedPerson || selectedPerson.id !== personIdParam) {
        findPersonById({ id: personIdParam }).then((res) => {
          if (res.data) {
            const person = res.data;
            const newPersonOption: IPersonOption = {
              id: person.id,
              name: person.name,
              lastName: person.lastName,
              secondLastName: person.secondLastName || null,
              documentType: person.documentType || null,
              documentNumber: person.documentNumber,
              gender: person.gender,
              birthDate: person.birthDate ? person.birthDate : null,
              imageUrl: person.imageUrl,
              fullName:
                `${person.lastName} ${person.secondLastName || ""} ${person.name}`
                  .replace(/\s+/g, " ")
                  .trim(),
            };
            setSelectedPerson(newPersonOption);
          }
        });
      }
    } else if (!personIdParam && personId) {
      setPersonId(null);
      setSelectedPerson(null);
    }
  }, [personIdParam]);

  const handleSetPersonId: Dispatch<SetStateAction<string | null>> = (
    value,
  ) => {
    let nextValue: string | null = null;
    if (typeof value === "function") {
      nextValue = value(personId);
    } else {
      nextValue = value;
    }
    setPersonId(nextValue);

    // Navegar solo si el cambio es diferente al de la URL actual
    if (nextValue && nextValue !== personIdParam) {
      router.push(`/admin/quick-operations/${nextValue}`);
    } else if (!nextValue && personIdParam) {
      router.push(`/admin/quick-operations`);
    }
  };

  // Ocultar el selector si no estamos en la pestaña principal (Ficha Personal)
  const isExcluded = ["/cash-flow", "/dashboard", "/reports"].some((route) =>
    pathname.includes(route),
  );
  if (isExcluded) return null;

  return (
    <div className="max-w-xl w-full bg-content1 p-4 rounded-xl shadow-sm border border-default-200">
      <SelectOrCreatePerson
        label="Buscar persona por nombre, apellido o documento"
        personId={personId}
        setPersonId={handleSetPersonId}
        setSelectedPerson={setSelectedPerson}
        isRequired={false}
        defaultPerson={selectedPerson}
      />
    </div>
  );
};
