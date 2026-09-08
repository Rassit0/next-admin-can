"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  ComboBox,
  ListBox,
  Label,
  Switch,
  Autocomplete,
  SearchField,
  Spinner,
  cn,
  Input,
} from "@heroui/react";
import { toast } from "sonner";
import { addPersonContact } from "@/modules/persons/actions/add-person-contact";
import { editPersonContact } from "@/modules/persons/actions/edit-person-contact";
import { SelectOrCreatePerson } from "@/modules/persons";
import { IPersonOption } from "@/common/actions/get-persons-options";
import { IPersonContact, ContactRelationshipLabels, ContactRelationship } from "@/modules/persons/interfaces/person-contact.interface";
import { revalidatePersonContactsCache } from "../../actions/revalidate-contacts";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  personId: string;
  contact?: IPersonContact | null;
  onSuccess?: () => void;
}

export const PersonContactDrawer = ({
  isOpen,
  onOpenChange,
  personId,
  contact,
  onSuccess,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [contactPersonId, setContactPersonId] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<IPersonOption | null>(null);
  const [relationship, setRelationship] = useState<ContactRelationship | "">("");
  const [isEmergencyContact, setIsEmergencyContact] = useState(false);
  const [isBillingContact, setIsBillingContact] = useState(false);

  const isEditing = !!contact;
  const drawerTitle = isEditing ? "Editar Contacto" : "Agregar Contacto";

  useEffect(() => {
    if (isOpen && contact) {
      setContactPersonId(contact.contactPersonId);
      // We don't have the full IPersonOption in contact (just name/lastName), but since we are editing we don't allow changing the person anyway.
      setRelationship(contact.relationship);
      setIsEmergencyContact(contact.isEmergencyContact);
      setIsBillingContact(contact.isBillingContact);
    } else if (isOpen && !contact) {
      setContactPersonId(null);
      setSelectedPerson(null);
      setRelationship("");
      setIsEmergencyContact(false);
      setIsBillingContact(false);
    }
  }, [isOpen, contact]);

  const resetForm = () => {
    setContactPersonId("");
    setRelationship("");
    setIsEmergencyContact(false);
    setIsBillingContact(false);
  };

  const handleSubmit = async () => {
    if (!contactPersonId) {
      toast.error("Debe seleccionar una persona");
      return;
    }
    if (!relationship) {
      toast.error("Debe seleccionar la relación");
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        const res = await editPersonContact(personId, contactPersonId, {
          relationship: relationship as ContactRelationship,
          isEmergencyContact,
          isBillingContact,
        });
        
        if (res.error) {
          toast.error(res.message);
        } else {
          toast.success(res.message);
          await revalidatePersonContactsCache(personId);
          onOpenChange(false);
          onSuccess?.();
        }
      } else {
        const res = await addPersonContact(personId, {
          contactPersonId: contactPersonId,
          relationship: relationship as ContactRelationship,
          isEmergencyContact,
          isBillingContact,
        });

        if (res.error) {
          // Status 400 or 409 etc. Handled by generic message from backend
          toast.error(res.message);
        } else {
          toast.success(res.message);
          await revalidatePersonContactsCache(personId);
          onOpenChange(false);
          onSuccess?.();
        }
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="w-full sm:max-w-md">
          <Drawer.CloseTrigger />
          <Drawer.Header className="border-b border-border">
            <Drawer.Heading className="text-lg font-bold">
              {drawerTitle}
            </Drawer.Heading>
          </Drawer.Header>
          
          <Drawer.Body className="gap-6 pt-6 pb-6">
            {!isEditing ? (
              <SelectOrCreatePerson
                label="Persona Contacto"
                personId={contactPersonId}
                setPersonId={setContactPersonId}
                setSelectedPerson={setSelectedPerson}
                isRequired
              />
            ) : (
              <div className="w-full flex flex-col gap-1">
                <Label className="text-sm font-semibold text-default-600">Persona Contacto</Label>
                <div className="p-3 bg-default-100 rounded-lg border border-default-200">
                  <span className="font-medium">{contact.contactPerson.name} {contact.contactPerson.lastName}</span>
                </div>
              </div>
            )}

            <ComboBox
              className="w-full"
              variant="secondary"
              menuTrigger="focus"
              selectedKey={relationship}
              onSelectionChange={(key) => {
                if (key) setRelationship(key as ContactRelationship);
              }}
              isRequired
            >
              <Label className="text-sm font-semibold">Relación</Label>
              <ComboBox.InputGroup>
                <Input
                  variant="secondary"
                  placeholder="Seleccione la relación"
                />
                <ComboBox.Trigger />
              </ComboBox.InputGroup>
              <ComboBox.Popover>
                <ListBox>
                  {Object.entries(ContactRelationshipLabels).map(([key, label]) => (
                    <ListBox.Item key={key} id={key} textValue={label}>
                      {label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </ComboBox.Popover>
            </ComboBox>

            <div className="flex flex-col gap-4 mt-2">
              <Switch
                isSelected={isEmergencyContact}
                onChange={setIsEmergencyContact}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Contacto de Emergencia</span>
                  <span className="text-xs text-default-500">Notificar en caso de incidencias de salud o emergencias.</span>
                </div>
              </Switch>

              <Switch
                isSelected={isBillingContact}
                onChange={setIsBillingContact}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Contacto de Facturación</span>
                  <span className="text-xs text-default-500">Recibe notificaciones sobre estados de cuenta y vencimientos.</span>
                </div>
              </Switch>
            </div>
          </Drawer.Body>

          <Drawer.Footer className="border-t border-border gap-2">
            <Button
              variant="outline"
              onPress={() => onOpenChange(false)}
              isDisabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onPress={handleSubmit}
              isDisabled={isLoading}
            >
              {isLoading ? "Cargando..." : isEditing ? "Guardar Cambios" : "Agregar Contacto"}
            </Button>
          </Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
