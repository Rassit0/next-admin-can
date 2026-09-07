import { Modal, Button, Avatar } from "@heroui/react";
import { IPersonContact, ContactRelationshipLabels } from "@/modules/persons";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  contact: IPersonContact | null;
}

export const ContactDetailsModal = ({ isOpen, onOpenChange, contact }: Props) => {
  if (!contact) return null;

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Detalle de Contacto</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="pb-6">
            <div className="flex flex-col items-center justify-center gap-4 py-4">
              <Avatar size="lg" className="w-24 h-24 text-large">
                <Avatar.Image src={contact.contactPerson.imageUrl || undefined} />
                <Avatar.Fallback>
                  {contact.contactPerson.name.charAt(0) +
                    (contact.contactPerson.lastName?.charAt(0) || "")}
                </Avatar.Fallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-bold">
                  {contact.contactPerson.name} {contact.contactPerson.lastName}
                </h3>
                <p className="text-default-500 font-medium">
                  {ContactRelationshipLabels[contact.relationship] ||
                    contact.relationship}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <i className="ri-id-card-line text-xl"></i>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-default-500 uppercase font-bold">
                    Documento
                  </span>
                  <span className="font-medium">
                    {contact.contactPerson.documentType && contact.contactPerson.documentNumber
                      ? `${contact.contactPerson.documentType} ${contact.contactPerson.documentNumber}`
                      : "No especificado"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <i className="ri-phone-line text-xl"></i>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-default-500 uppercase font-bold">
                    Teléfono
                  </span>
                  <span className="font-medium">
                    {contact.contactPerson.phone || "No especificado"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <i className="ri-mail-line text-xl"></i>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs text-default-500 uppercase font-bold">
                    Correo Electrónico
                  </span>
                  <span className="font-medium truncate">
                    {contact.contactPerson.email || "No especificado"}
                  </span>
                </div>
              </div>
            </div>

            {(contact.isEmergencyContact || contact.isBillingContact) && (
              <div className="flex gap-2 mt-4 justify-center">
                {contact.isEmergencyContact && (
                  <span className="px-3 py-1 bg-danger/10 text-danger rounded-full text-xs font-bold">
                    Emergencia
                  </span>
                )}
                {contact.isBillingContact && (
                  <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold">
                    Facturación
                  </span>
                )}
              </div>
            )}
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
