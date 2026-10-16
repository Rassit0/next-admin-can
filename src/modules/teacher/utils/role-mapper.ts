export const STAFF_ROLE_LABELS: Record<string, string> = {
  HEAD_COACH: "Profesor Principal / DT",
  ASSISTANT_COACH: "Entrenador Asistente",
  ASSISTANT: "Auxiliar / Ayudante",
  VOLUNTEER: "Voluntario",
  DELEGATE: "Delegado",
  OTHER: "Cuerpo Técnico",
};

export const formatStaffRole = (
  role?: string | null,
  customRole?: string | null,
): string => {
  if (customRole && customRole.trim()) {
    return customRole.trim();
  }
  if (!role) return "Personal Técnico";
  return STAFF_ROLE_LABELS[role] || role;
};
