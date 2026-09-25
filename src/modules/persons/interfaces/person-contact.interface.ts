export enum ContactRelationship {
  FATHER = "FATHER",
  MOTHER = "MOTHER",
  BROTHER = "BROTHER",
  SISTER = "SISTER",
  SPOUSE = "SPOUSE",
  PARTNER = "PARTNER",
  UNCLE = "UNCLE",
  AUNT = "AUNT",
  GRANDPARENT = "GRANDPARENT",
  FRIEND = "FRIEND",
  TUTOR = "TUTOR",
  OTHER = "OTHER",
}

export const ContactRelationshipLabels: Record<ContactRelationship, string> = {
  [ContactRelationship.FATHER]: "Padre",
  [ContactRelationship.MOTHER]: "Madre",
  [ContactRelationship.BROTHER]: "Hermano",
  [ContactRelationship.SISTER]: "Hermana",
  [ContactRelationship.SPOUSE]: "Cónyuge",
  [ContactRelationship.PARTNER]: "Pareja",
  [ContactRelationship.UNCLE]: "Tío",
  [ContactRelationship.AUNT]: "Tía",
  [ContactRelationship.GRANDPARENT]: "Abuelo/a",
  [ContactRelationship.FRIEND]: "Amigo/a",
  [ContactRelationship.TUTOR]: "Tutor/a",
  [ContactRelationship.OTHER]: "Otro",
};

export interface IPersonContact {
  personId: string;
  contactPersonId: string;
  relationship: ContactRelationship;
  isEmergencyContact: boolean;
  isBillingContact: boolean;
  createdAt: string;
  contactPerson: {
    id: string;
    name: string;
    lastName: string;
    imageUrl: string | null;
    email?: string | null;
    phone?: string | null;
    documentType?: string;
    documentNumber?: string;
  };
}
