"use client";

import React, { useState, useMemo, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search01Icon,
  UserIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TeacherParticipant } from "../../interfaces/teacher.interface";

interface TeacherParticipantSelectorProps {
  participants: TeacherParticipant[];
  selectedParticipantId?: string;
}

export const TeacherParticipantSelector: React.FC<
  TeacherParticipantSelectorProps
> = ({ participants, selectedParticipantId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredParticipants = useMemo(() => {
    if (!searchTerm.trim()) return participants;
    const term = searchTerm.toLowerCase().trim();

    return participants.filter((p) => {
      const fullName = `${p.lastName || ""} ${p.secondLastName || ""} ${
        p.firstName || ""
      }`.toLowerCase();
      const doc = p.documentNumber?.toLowerCase() || "";
      return fullName.includes(term) || doc.includes(term);
    });
  }, [participants, searchTerm]);

  const handleSelectParticipant = (participantId: string) => {
    if (participantId === selectedParticipantId) return;

    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("tab", "evaluations");
    params.set("participantId", participantId);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 1. Local Search Filter Bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-default-400">
          <HugeiconsIcon icon={Search01Icon} size={15} />
        </span>
        <input
          type="text"
          placeholder="Buscar participante por nombre o CI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-divider bg-content1 text-foreground text-xs font-medium placeholder:text-default-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-default-400 hover:text-foreground cursor-pointer"
          >
            ×
          </button>
        )}
      </div>

      {/* 2. Participant List (Vertical Stack / Mobile Touch Friendly) */}
      <div className="flex flex-col gap-1.5 max-h-[380px] sm:max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
        {filteredParticipants.length === 0 ? (
          <div className="p-6 text-center rounded-2xl border border-dashed border-divider bg-content1/40">
            <p className="text-xs text-default-500 font-medium">
              No se encontraron participantes que coincidan con &ldquo;{searchTerm}&rdquo;
            </p>
          </div>
        ) : (
          filteredParticipants.map((p) => {
            const isSelected = p.participantId === selectedParticipantId;
            const fullName = `${p.lastName} ${p.secondLastName || ""} ${
              p.firstName
            }`.trim();

            return (
              <button
                key={p.participantId}
                type="button"
                onClick={() => handleSelectParticipant(p.participantId)}
                disabled={isPending}
                className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-content1 border-divider/60 hover:border-divider hover:bg-default-100/70"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={fullName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 border border-divider"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                      {`${p.firstName?.[0] || ""}${p.lastName?.[0] || ""}`.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold truncate ${
                        isSelected ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {fullName}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-default-500">
                      <span>{p.type === "STUDENT" ? "Estudiante" : "Jugador"}</span>
                      {p.documentNumber && (
                        <>
                          <span>•</span>
                          <span>CI: {p.documentNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <span className="shrink-0 text-primary">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
