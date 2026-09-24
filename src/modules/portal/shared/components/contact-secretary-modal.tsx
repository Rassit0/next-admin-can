"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MessageCircle, X, Globe, Clock } from "lucide-react";
import {
  CLUB_CONTACT,
  getWhatsAppLink,
  getTelLink,
  getEmailLink,
} from "@/modules/portal/core/constants/contact-info";

interface ContactSecretaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function ContactSecretaryModal({
  isOpen,
  onClose,
  title = "Contacta a Nuestra Secretari­a",
  message = "Estamos disponibles para responder tus preguntas sobre inscripciones, aranceles y mi¡s información sobre nuestros programas.",
}: ContactSecretaryModalProps) {
  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-neon/20 bg-white p-8 shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-primary/40 transition-colors hover:text-primary"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Content */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="font-oswald text-2xl font-bold text-primary">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-primary/70">{message}</p>
              </div>

              {/* Hours */}
              <div className="space-y-2 rounded-lg bg-silver-deep p-4">
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-neon" />
                  <div>
                    <p className="font-semibold text-primary">
                      Horarios de Atención
                    </p>
                    <p className="text-sm text-primary/70">
                      Lunes a Viernes: {CLUB_CONTACT.hours.weekday}
                    </p>
                    <p className="text-sm text-primary/70">
                      Si¡bados: {CLUB_CONTACT.hours.saturday}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Options */}
              <div className="space-y-3">
                {/* Phone */}
                <a
                  href={getTelLink()}
                  className="flex items-center gap-3 rounded-lg border border-primary/10 bg-white px-4 py-3 transition-all duration-200 hover:border-neon/30 hover:bg-silver-deep/50 hover:shadow-md"
                >
                  <Phone className="h-5 w-5 text-neon" />
                  <div>
                    <p className="text-sm font-medium text-primary">Llamar</p>
                    <p className="text-sm text-primary/70">
                      {CLUB_CONTACT.phone}
                    </p>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={getWhatsAppLink(
                    `Hola! Quisiera consultar sobre los programas de ${CLUB_CONTACT.name}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-primary/10 bg-white px-4 py-3 transition-all duration-200 hover:border-neon/30 hover:bg-silver-deep/50 hover:shadow-md"
                >
                  <MessageCircle className="h-5 w-5 text-neon" />
                  <div>
                    <p className="text-sm font-medium text-primary">WhatsApp</p>
                    <p className="text-sm text-primary/70">
                      {CLUB_CONTACT.whatsapp}
                    </p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={getEmailLink()}
                  className="flex items-center gap-3 rounded-lg border border-primary/10 bg-white px-4 py-3 transition-all duration-200 hover:border-neon/30 hover:bg-silver-deep/50 hover:shadow-md"
                >
                  <Mail className="h-5 w-5 text-neon" />
                  <div>
                    <p className="text-sm font-medium text-primary">Email</p>
                    <p className="text-sm text-primary/70">
                      {CLUB_CONTACT.email}
                    </p>
                  </div>
                </a>

                {/* Web */}
                <a
                  href={`https://${CLUB_CONTACT.web}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-primary/10 bg-white px-4 py-3 transition-all duration-200 hover:border-neon/30 hover:bg-silver-deep/50 hover:shadow-md"
                >
                  <Globe className="h-5 w-5 text-neon" />
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Sitio Web
                    </p>
                    <p className="text-sm text-primary/70">
                      {CLUB_CONTACT.web}
                    </p>
                  </div>
                </a>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="w-full rounded-lg border-2 border-neon bg-white px-4 py-3 font-semibold text-neon transition-all duration-200 hover:bg-neon/5"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
