export const CLUB_CONTACT = {
  name: "Club Atli©tico Nacional",
  phone: "+54 11 4567-8900",
  whatsapp: "+54 9 11 1234-5678",
  email: "secretaria@verticeatletico.ar",
  web: "www.verticeatletico.ar",
  hours: {
    weekday: "09:00 - 18:00",
    saturday: "10:00 - 14:00",
    sunday: "Cerrado",
  },
  location: {
    address: "Av. Rivadavia 4567, Buenos Aires",
    city: "Buenos Aires",
    country: "Argentina",
  },
};

export const getWhatsAppLink = (message: string) =>
  `https://wa.me/${CLUB_CONTACT.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

export const getTelLink = () => `tel:${CLUB_CONTACT.phone}`;

export const getEmailLink = () => `mailto:${CLUB_CONTACT.email}`;
