import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@heroui/react";
import { ArrowLeft02Icon, LockKeyIcon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getCurrentUserContext } from "@/shared/helpers/server-context";
import { getGroupContext } from "@/modules/teacher/actions/get-group-context";
import {
  TeacherGroupHeader,
  TeacherGroupTabs,
  TeacherGroupOverview,
  TeacherParticipantList,
  TeacherSessionList,
  TeacherAttendanceSection,
  TeacherEvaluationsSection,
} from "@/modules/teacher";

interface TeacherGroupWorkspacePageProps {
  params: Promise<{
    type: string;
    id: string;
  }>;
  searchParams: Promise<{
    tab?: string;
    sessionId?: string;
    participantId?: string;
  }>;
}

export default async function TeacherGroupWorkspacePage({
  params,
  searchParams,
}: TeacherGroupWorkspacePageProps) {
  const { type, id } = await params;
  const { tab, sessionId, participantId } = await searchParams;

  // 1. Validate type segment (COURSE | TEAM)
  const normalizedType = type?.toUpperCase();
  if (normalizedType !== "COURSE" && normalizedType !== "TEAM") {
    notFound();
  }

  // 2. Fetch Group Context from Server Action (derived from session / JWT)
  const groupRes = await getGroupContext(normalizedType, id);

  // 3. Error Handling (Forbidden / Resource Access Denied / Not Found)
  if (groupRes.error || !groupRes.data) {
    const isForbidden =
      groupRes.statusCode === 403 ||
      groupRes.message?.toLowerCase().includes("no asignado") ||
      groupRes.message?.toLowerCase().includes("acceso denegado") ||
      groupRes.message?.toLowerCase().includes("forbidden") ||
      groupRes.message?.toLowerCase().includes("inactivo");

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/teacher/groups"
            className="text-default-400 hover:text-foreground transition-colors flex items-center gap-1 font-medium"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
            <span>Mis grupos</span>
          </Link>
          <span className="text-default-300">/</span>
          <span className="text-default-500">Detalle de grupo</span>
        </div>

        <div className="p-8 sm:p-12 text-center border border-danger/30 rounded-3xl bg-danger/5 max-w-lg mx-auto mt-6 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4 border border-danger/20">
            <HugeiconsIcon
              icon={isForbidden ? LockKeyIcon : AlertCircleIcon}
              size={28}
            />
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2">
            {isForbidden
              ? "Acceso no autorizado al grupo"
              : "No se pudo cargar el grupo"}
          </h3>

          <p className="text-xs text-default-600 mb-6 max-w-sm mx-auto leading-relaxed">
            {groupRes.message ||
              (isForbidden
                ? "No tienes asignación docente activa en este grupo o tu rol no cuenta con los permisos necesarios."
                : "Ocurrió un error al intentar consultar el contexto del grupo.")}
          </p>

          <Link href="/teacher/groups">
            <Button size="sm" variant="outline" className="text-xs font-semibold">
              <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
              <span>Volver a Mis grupos</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const group = groupRes.data;

  // 4. Permission-adaptive Tab Resolution
  const userContext = await getCurrentUserContext();
  const permissions = userContext?.permissions || [];
  const canReadEvaluations = permissions.includes("READ_PROGRESS_EVALUATIONS");
  const canCreateEvaluations = permissions.includes("CREATE_PROGRESS_EVALUATIONS");
  const canUpdateEvaluations = permissions.includes("UPDATE_PROGRESS_EVALUATIONS");
  const canCreateSessions = permissions.includes("CREATE_SESSIONS");
  const canUpdateSessions = permissions.includes("UPDATE_SESSIONS");
  const canReadIncidents = permissions.includes("READ_SESSION_INCIDENTS");
  const canCreateIncidents = permissions.includes("CREATE_SESSION_INCIDENTS");
  const canUpdateIncidents = permissions.includes("UPDATE_SESSION_INCIDENTS");

  const hasParticipants = group.participants !== undefined;
  const hasSessions =
    group.upcomingSessions !== undefined || group.recentSessions !== undefined;

  let activeTab = "overview";
  if (tab === "participants" && hasParticipants) {
    activeTab = "participants";
  } else if (tab === "sessions" && hasSessions) {
    activeTab = "sessions";
  } else if (tab === "attendance") {
    activeTab = "attendance";
  } else if (tab === "evaluations" && canReadEvaluations) {
    activeTab = "evaluations";
  }

  return (
    <div className="space-y-6">
      {/* 1. Group Header with Breadcrumb and Identity */}
      <TeacherGroupHeader group={group} />

      {/* 2. Deep-Link Navigation Tabs (Client Island) */}
      <TeacherGroupTabs
        currentTab={activeTab}
        hasParticipants={hasParticipants}
        hasSessions={hasSessions}
        hasAttendance={true}
        hasEvaluations={canReadEvaluations}
        participantCount={group.participantCount}
        upcomingSessionsCount={group.upcomingSessions?.length}
      />

      {/* 3. Tab Section Content (SSR Rendered) */}
      <section className="pt-2">
        {activeTab === "overview" && <TeacherGroupOverview group={group} />}
        {activeTab === "participants" && (
          <TeacherParticipantList participants={group.participants} />
        )}
        {activeTab === "sessions" && (
          <TeacherSessionList
            upcomingSessions={group.upcomingSessions}
            recentSessions={group.recentSessions}
            groupType={group.type}
            groupId={group.id}
            groupName={group.name}
            groupDetail={group.detail}
            canCreate={canCreateSessions}
            canUpdate={canUpdateSessions}
          />
        )}
        {activeTab === "attendance" && (
          <TeacherAttendanceSection
            group={group}
            selectedSessionId={sessionId}
            canCreateIncidents={canCreateIncidents}
            canUpdateIncidents={canUpdateIncidents}
            canReadIncidents={canReadIncidents}
          />
        )}
        {activeTab === "evaluations" && canReadEvaluations && (
          <TeacherEvaluationsSection
            group={group}
            selectedParticipantId={participantId}
            canCreate={canCreateEvaluations}
            canUpdate={canUpdateEvaluations}
          />
        )}
      </section>
    </div>
  );
}
