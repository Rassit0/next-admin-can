"use client";

import { useEffect, useState } from "react";
import { 
  Spinner, 
  Card,
  Chip, 
  Avatar
} from "@heroui/react";
import { getStudentMembershipHistories } from "../actions/get-histories";
import { 
  IStudentMembershipHistory, 
  StudentMembershipStatus 
} from "../interfaces/student-membership.interface";

// Utility icons
const StatusIcon = ({ status }: { status: StudentMembershipStatus | "TRANSFER" }) => {
  switch (status) {
    case "ACTIVE":
      return <div className="w-3 h-3 rounded-full bg-success" />;
    case "SUSPENDED":
      return <div className="w-3 h-3 rounded-full bg-warning" />;
    case "FINISHED":
      return <div className="w-3 h-3 rounded-full bg-primary" />;
    case "WITHDRAWN":
      return <div className="w-3 h-3 rounded-full bg-danger" />;
    case "TRANSFER":
      return <div className="w-3 h-3 rounded-full bg-secondary" />;
    default:
      return <div className="w-3 h-3 rounded-full bg-default-400" />;
  }
};

const getStatusColor = (status: StudentMembershipStatus | "TRANSFER") => {
  switch (status) {
    case "ACTIVE": return "success";
    case "SUSPENDED": return "warning";
    case "FINISHED": return "accent";
    case "WITHDRAWN": return "danger";
    case "TRANSFER": return "default";
    default: return "default";
  }
};

const getStatusLabel = (status: StudentMembershipStatus | "TRANSFER") => {
  switch (status) {
    case "ACTIVE": return "Activa";
    case "SUSPENDED": return "Suspendida";
    case "FINISHED": return "Finalizada";
    case "WITHDRAWN": return "Baja";
    case "TRANSFER": return "Transferencia";
    case "PENDING_ACTIVE": return "Pendiente";
    default: return status;
  }
};

interface Props {
  studentMembershipId: string;
}

export function MembershipTimeline({ studentMembershipId }: Props) {
  const [histories, setHistories] = useState<IStudentMembershipHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      const res = await getStudentMembershipHistories(studentMembershipId);
      if (!res.error && res.data) {
        setHistories(res.data);
      } else {
        setError(res.message || "Error al cargar el historial");
      }
      setIsLoading(false);
    }
    load();
  }, [studentMembershipId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-3">
        <Spinner size="lg" />
        <span className="text-sm text-default-500">Cargando historial...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-50 p-4 rounded-medium text-danger text-center">
        {error}
      </div>
    );
  }

  if (histories.length === 0) {
    return (
      <div className="bg-default-50 p-8 rounded-medium border border-default-200 text-default-500 text-center">
        No existen eventos registrados para esta membresía.
      </div>
    );
  }

  return (
    <div className="relative border-l border-default-200 ml-3 md:ml-4 space-y-8 py-4">
      {histories.map((history, index) => {
        // Detectar si es una transferencia (Mismo estado previo y nuevo, y empieza con "Transferencia de turno")
        const isTransfer = 
          history.previousStatus === history.newStatus && 
          history.reason?.startsWith("Transferencia de turno");
        
        const displayStatus = isTransfer ? "TRANSFER" : history.newStatus;
        const color = getStatusColor(displayStatus);

        return (
          <div key={history.id} className="relative pl-6 sm:pl-8 group">
            {/* Timeline Dot */}
            <div className="absolute -left-1.25 top-1.5 ring-4 ring-background">
              <StatusIcon status={displayStatus} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Chip 
                    size="sm" 
                    color={color as "success" | "warning" | "danger" | "default" | "accent"} 
                    variant="soft"
                    className="font-medium"
                  >
                    {getStatusLabel(displayStatus)}
                  </Chip>
                  {history.previousStatus && !isTransfer && (
                    <span className="text-xs text-default-400">
                      (era {getStatusLabel(history.previousStatus)})
                    </span>
                  )}
                </div>
                
                <time className="text-xs text-default-400 font-medium whitespace-nowrap">
                  {new Intl.DateTimeFormat("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(history.createdAt))}
                </time>
              </div>

              {history.reason && (
                <div className="bg-default-50 rounded-medium p-3 text-sm text-default-600">
                  {isTransfer ? (
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-default-700">Transferencia de turno</span>
                      <p>{history.reason}</p>
                    </div>
                  ) : (
                    <p>{history.reason}</p>
                  )}
                </div>
              )}

              {history.createdBy && (
                <div className="pt-2 flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <Avatar.Fallback>
                      {history.createdBy.person
                        ? history.createdBy.person.name.charAt(0).toUpperCase()
                        : "A"}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {history.createdBy.person
                        ? `${history.createdBy.person.name} ${history.createdBy.person.lastName}`
                        : "Administrador"}
                    </span>
                    <span className="text-xs text-default-500">
                      {history.createdBy.email}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
