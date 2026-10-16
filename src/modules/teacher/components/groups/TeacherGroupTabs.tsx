"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  DashboardSquare02Icon,
  UserGroupIcon,
  Calendar01Icon,
  CheckmarkBadge01Icon,
  TaskDone01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface TeacherGroupTabsProps {
  currentTab: string;
  hasParticipants: boolean;
  hasSessions: boolean;
  hasAttendance?: boolean;
  hasEvaluations?: boolean;
  participantCount: number;
  upcomingSessionsCount?: number;
}

export const TeacherGroupTabs: React.FC<TeacherGroupTabsProps> = ({
  currentTab,
  hasParticipants,
  hasSessions,
  hasAttendance = true,
  hasEvaluations = false,
  participantCount,
  upcomingSessionsCount,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (key: string) => {
    if (key === currentTab) return;
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (key === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", key);
    }

    // Clean up cross-tab parameters so they don't pollute URLs
    if (key !== "attendance") {
      params.delete("sessionId");
    }
    if (key !== "evaluations") {
      params.delete("participantId");
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    startTransition(() => {
      router.push(`${pathname}${query}`, { scroll: false });
    });
  };

  const tabs = [
    {
      id: "overview",
      label: "Resumen",
      icon: DashboardSquare02Icon,
      badge: null,
    },
    ...(hasParticipants
      ? [
          {
            id: "participants",
            label: "Participantes",
            icon: UserGroupIcon,
            badge: participantCount,
          },
        ]
      : []),
    ...(hasSessions
      ? [
          {
            id: "sessions",
            label: "Sesiones",
            icon: Calendar01Icon,
            badge: upcomingSessionsCount,
          },
        ]
      : []),
    ...(hasAttendance
      ? [
          {
            id: "attendance",
            label: "Asistencia",
            icon: CheckmarkBadge01Icon,
            badge: null,
          },
        ]
      : []),
    ...(hasEvaluations
      ? [
          {
            id: "evaluations",
            label: "Evaluaciones",
            icon: TaskDone01Icon,
            badge: null,
          },
        ]
      : []),
  ];

  return (
    <div className="w-full border-b border-divider/60">
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              disabled={isPending}
              type="button"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-default-600 hover:text-foreground hover:bg-default-100"
              }`}
            >
              <HugeiconsIcon icon={tab.icon} size={15} />
              <span>{tab.label}</span>
              {tab.badge !== null && tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-white/20 text-primary-foreground"
                      : "bg-default-200 text-default-700"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
