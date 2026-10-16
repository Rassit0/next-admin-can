import React from "react";
import { Card } from "@heroui/react";
import { UserMultipleIcon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TeacherParticipant } from "../../interfaces/teacher.interface";

interface TeacherParticipantListProps {
  participants?: TeacherParticipant[];
}

export const TeacherParticipantList: React.FC<TeacherParticipantListProps> = ({
  participants,
}) => {
  if (participants === undefined) {
    return (
      <Card className="p-8 text-center border border-divider bg-content1">
        <p className="text-xs text-default-500">
          No tienes permisos suficientes para visualizar el listado de participantes.
        </p>
      </Card>
    );
  }

  if (participants.length === 0) {
    return (
      <Card className="p-8 border border-dashed border-divider bg-content1/50 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-default-100 flex items-center justify-center text-default-400 mb-2">
          <HugeiconsIcon icon={UserMultipleIcon} size={24} />
        </div>
        <h4 className="text-sm font-semibold text-foreground mb-1">
          Este grupo todavía no tiene participantes activos
        </h4>
        <p className="text-xs text-default-500 max-w-sm">
          A medida que los estudiantes o jugadores completen su inscripción en este
          turno o categoría, aparecerán automáticamente en esta lista.
        </p>
      </Card>
    );
  }

  const getInitials = (first: string, last: string) => {
    return `${(last || "").charAt(0)}${(first || "").charAt(0)}`.toUpperCase();
  };

  const calculateAge = (birthDate?: string | Date | null) => {
    if (!birthDate) return null;
    const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
    if (isNaN(birth.getTime())) return null;
    const ageDiff = Date.now() - birth.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="space-y-4">
      {/* Header with counter */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-default-500">
          Roster de Participantes ({participants.length})
        </span>
        <span className="text-xs text-default-400">
          Ordenado alfabéticamente por apellido
        </span>
      </div>

      {/* Mobile-first touch-friendly participant list */}
      <div className="divide-y divide-divider/60 border border-divider rounded-2xl bg-content1 overflow-hidden shadow-sm">
        {participants.map((p, index) => {
          const fullName = `${p.lastName} ${p.secondLastName || ""}, ${p.firstName}`.trim();
          const age = calculateAge(p.birthDate);
          const isConfirmed = p.status === "CONFIRMED" || p.status === "ACTIVE";

          return (
            <div
              key={p.membershipId || `${p.participantId}-${index}`}
              className="flex items-center justify-between p-3.5 sm:px-5 hover:bg-default-50 transition-colors gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar / Initials */}
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={fullName}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-divider"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                    {getInitials(p.firstName, p.lastName)}
                  </div>
                )}

                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate">
                    {fullName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-default-400">
                    {age !== null && <span>{age} años</span>}
                    {p.documentNumber && (
                      <>
                        <span>·</span>
                        <span>Doc: {p.documentNumber}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isConfirmed
                      ? "bg-success/10 text-success border border-success/20"
                      : "bg-warning/10 text-warning border border-warning/20"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
