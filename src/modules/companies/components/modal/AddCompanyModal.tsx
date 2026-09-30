"use client";
import { Button, Modal } from "@heroui/react";
import { Add01Icon, Building01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FormCompany } from "@/modules/companies/components/form/FormCompany";
import { useState } from "react";
import { ICompanyOption } from "@/modules/companies/interfaces/company.interface";

interface Props {
  isIcon?: boolean;
  onSubmited?: (company?: ICompanyOption) => void;
}

export const AddCompanyModal = ({ isIcon = false, onSubmited }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Modal>
      {!isIcon && (
        <Button variant="primary" onPress={() => setIsOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} />
          Agregar Empresa
        </Button>
      )}
      {isIcon && (
        <Button variant="primary" onPress={() => setIsOpen(true)} isIconOnly>
          <HugeiconsIcon icon={Add01Icon} />
        </Button>
      )}
      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen} isDismissable={false}>
        <Modal.Container placement="center" scroll="outside">
          <Modal.Dialog className="sm:max-w-2xl bg-background-tertiary" aria-label="Agregar Empresa">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2">
                <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                  <HugeiconsIcon icon={Building01Icon} />
                </Modal.Icon>
                <Modal.Heading>Agregar Empresa / Entidad</Modal.Heading>
              </div>
            </Modal.Header>
            <Modal.Body className="p-0 md:p-6">
              <FormCompany
                formId="add-company-form"
                onSubmited={(company) => {
                  onSubmited?.(company);
                  setIsOpen(false);
                }}
                isLoading={loading}
                setIsLoading={setLoading}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" isDisabled={loading} onPress={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" form="add-company-form" variant="primary" isPending={loading}>
                Guardar Empresa
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
