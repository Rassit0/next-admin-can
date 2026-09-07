"use client";
import React, { useEffect, useState } from "react";
import { Card, Spinner, Avatar } from "@heroui/react";
import { usePermissions } from "@/shared/providers/PermissionsProvider";
import { getPersonContacts } from "../../../persons/actions/get-person-contacts";
import { IPersonContact, ContactRelationshipLabels } from "../../../persons/interfaces/person-contact.interface";
import { PersonContactDrawer } from "./PersonContactDrawer";
import { DeleteContactModal } from "./DeleteContactModal";
import { ContactDetailsModal } from "./ContactDetailsModal";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { listItemTransition } from "@/ui/animations/transitions";

interface Props {
  personId: string;
}

export const PersonContactsCard = ({ personId }: Props) => {
  const permissions = usePermissions();
  const canRead = permissions.includes("READ_PERSONS");
  const canUpdate = permissions.includes("UPDATE_PERSONS");
  const prefersReducedMotion = useReducedMotion();

  const [contacts, setContacts] = useState<IPersonContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<IPersonContact | null>(null);

  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getPersonContacts(personId);
      if (res.error) {
        setError(res.message);
      } else {
        setContacts(res.data || []);
      }
    } catch (err) {
      setError("Error al cargar los contactos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!canRead || !personId) return;
    fetchContacts();
  }, [personId, canRead]);

  const handleAdd = () => {
    setSelectedContact(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (contact: IPersonContact) => {
    setSelectedContact(contact);
    setIsDrawerOpen(true);
  };

  const handleDelete = (contact: IPersonContact) => {
    setSelectedContact(contact);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (contact: IPersonContact) => {
    setSelectedContact(contact);
    setIsDetailsModalOpen(true);
  };

  const handleDrawerClose = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setTimeout(() => setSelectedContact(null), 300);
    }
  };

  const handleDeleteModalClose = (open: boolean) => {
    setIsDeleteModalOpen(open);
    if (!open) {
      setTimeout(() => setSelectedContact(null), 300);
    }
  };

  const handleDetailsModalClose = (open: boolean) => {
    setIsDetailsModalOpen(open);
    if (!open) {
      setTimeout(() => setSelectedContact(null), 300);
    }
  };

  if (!canRead) return null;

  return (
    <>
      <Card className="h-full shadow-sm">
        <Card.Header className="flex justify-between items-center">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <i className="ri-team-line text-default-500"></i> Familiares y Contactos (
            {contacts.length})
          </h3>
          {canUpdate && (
            <button 
              className="text-primary hover:text-primary-600 text-sm font-medium transition-colors"
              onClick={handleAdd}
            >
              Agregar contacto
            </button>
          )}
        </Card.Header>
        <Card.Content className="px-4 py-2 flex flex-col gap-3 h-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center grow p-4">
              <Spinner />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center grow p-4 text-danger">
              <p className="text-sm text-center">{error}</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center grow p-4 text-default-400">
              <i className="ri-user-unfollow-line text-2xl mb-1"></i>
              <p className="text-sm text-center">Sin contactos registrados</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {contacts.map((contact) => (
                <motion.div
                  key={contact.contactPersonId}
                  layout={!prefersReducedMotion}
                  variants={prefersReducedMotion ? {} : listItemTransition}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="border border-default-200 rounded-lg p-3 flex flex-col gap-2 relative origin-top"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleViewDetails(contact)} className="hover:opacity-80 transition-opacity">
                        <Avatar size="md">
                          <Avatar.Image src={contact.contactPerson.imageUrl || undefined} />
                          <Avatar.Fallback>
                            {contact.contactPerson.name.charAt(0) + (contact.contactPerson.lastName?.charAt(0) || "")}
                          </Avatar.Fallback>
                        </Avatar>
                      </button>
                      <div>
                        <h4 className="font-semibold text-sm leading-tight hover:text-primary cursor-pointer transition-colors" onClick={() => handleViewDetails(contact)}>
                          {contact.contactPerson.name} {contact.contactPerson.lastName}
                        </h4>
                        <p className="text-xs text-default-500 mt-0.5">
                          {ContactRelationshipLabels[contact.relationship] || contact.relationship}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        className="text-default-400 hover:text-primary transition-colors"
                        onClick={() => handleViewDetails(contact)}
                        title="Ver detalles"
                      >
                        <i className="ri-eye-line text-lg"></i>
                      </button>
                      {canUpdate && (
                        <>
                          <button 
                            className="text-default-400 hover:text-primary transition-colors"
                            onClick={() => handleEdit(contact)}
                            title="Editar contacto"
                          >
                            <i className="ri-pencil-line text-lg"></i>
                          </button>
                          <button 
                            className="text-default-400 hover:text-danger transition-colors"
                            onClick={() => handleDelete(contact)}
                            title="Eliminar contacto"
                          >
                            <i className="ri-delete-bin-line text-lg"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-1">
                    <div className="flex gap-2">
                      {contact.isEmergencyContact && (
                        <span className="text-xs font-medium bg-danger-100 text-danger-600 px-2 py-0.5 rounded-md flex items-center">
                          <i className="ri-heart-pulse-line mr-1"></i> Emergencia
                        </span>
                      )}
                      {contact.isBillingContact && (
                        <span className="text-xs font-medium bg-primary-100 text-primary-600 px-2 py-0.5 rounded-md flex items-center">
                          <i className="ri-bill-line mr-1"></i> Facturación
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </Card.Content>
      </Card>

      <PersonContactDrawer
        isOpen={isDrawerOpen}
        onOpenChange={handleDrawerClose}
        personId={personId}
        contact={selectedContact}
        onSuccess={fetchContacts}
      />
      
      <DeleteContactModal
        isOpen={isDeleteModalOpen}
        onOpenChange={handleDeleteModalClose}
        personId={personId}
        contact={selectedContact}
        onSuccess={fetchContacts}
      />

      <ContactDetailsModal
        isOpen={isDetailsModalOpen}
        onOpenChange={handleDetailsModalClose}
        contact={selectedContact}
      />
    </>
  );
};
