"use client";
import React, { useState, useEffect } from "react";
import { Drawer, Button, Spinner, useOverlayState } from "@heroui/react";
import { FormPerson } from "@/modules/persons/components/form/Form";
import { findPersonById, IPerson } from "@/modules/persons";
import { revalidatePersonSummaryCache } from "../../actions/revalidate-summary";
import { Edit03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface Props {
  personId: string;
}

export const Person360EditAction = ({ personId }: Props) => {
  const state = useOverlayState();
  const [isLoading, setIsLoading] = useState(false);
  const [personData, setPersonData] = useState<IPerson | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.isOpen && personId) {
      loadPerson();
    } else {
      setPersonData(null);
      setError(null);
    }
  }, [state.isOpen, personId]);

  const loadPerson = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await findPersonById({ id: personId as any });
      if (res.error) {
        setError(res.message || "Error al cargar los datos de la persona");
      } else {
        setPersonData(res.data);
      }
    } catch (err: any) {
      setError(err?.message || "Error desconocido al cargar la persona");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmited = () => {
    state.close();
    revalidatePersonSummaryCache(personId);
  };

  return (
    <>
      <Button
        isIconOnly
        variant="ghost"
        onPress={() => state.open()}
        aria-label="Editar Perfil"
      >
        <HugeiconsIcon icon={Edit03Icon} />
      </Button>

      <Drawer.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Drawer.Content placement="right">
          <Drawer.Dialog className="w-full sm:max-w-4xl overflow-y-auto flex flex-col h-full bg-background-tertiary">
            <Drawer.CloseTrigger />
            <Drawer.Header className="border-b border-border shrink-0">
              <Drawer.Heading className="text-xl font-bold flex items-center gap-2">
                <HugeiconsIcon icon={Edit03Icon} className="text-default-500" />{" "}
                Editar Perfil
              </Drawer.Heading>
              <p className="text-sm text-default-500 mt-1">
                Modifica los datos personales y de contacto.
              </p>
            </Drawer.Header>

            <Drawer.Body className="p-6 flex-1 relative overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <Spinner size="lg" />
                  <span className="text-sm text-default-500">
                    Cargando perfil...
                  </span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3 text-danger">
                  <i className="ri-error-warning-line text-3xl"></i>
                  <span className="text-sm">{error}</span>
                  <Button variant="outline" onPress={loadPerson}>
                    Reintentar
                  </Button>
                </div>
              ) : personData ? (
                <FormPerson
                  formId="person-360-edit-form"
                  person={personData}
                  onSubmited={handleSubmited}
                />
              ) : null}
            </Drawer.Body>

            <Drawer.Footer className="border-t border-border shrink-0">
              <Button
                variant="secondary"
                onPress={() => state.close()}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="person-360-edit-form"
                className="w-full sm:w-auto"
                isDisabled={isLoading || !!error || !personData}
              >
                Guardar Cambios
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
};
