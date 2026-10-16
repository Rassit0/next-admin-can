import { auth } from "@/auth";
import { getCurrentUserContext } from "@/shared/helpers/server-context";
import { getTeacherContext } from "@/modules/teacher/actions/get-teacher-context";
import { TeacherNavbar } from "@/modules/teacher/components/layout/TeacherNavbar";
import { redirect } from "next/navigation";
import React from "react";

interface TeacherLayoutProps {
  children: React.ReactNode;
}

export default async function TeacherLayout({ children }: TeacherLayoutProps) {
  // 1. Verificar sesión autenticada
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // 2. Verificar permisos y contexto del usuario
  const userContext = await getCurrentUserContext();
  const permissions = userContext?.permissions || [];

  const hasFunctionalPermission = [
    "READ_SESSIONS",
    "READ_SESSION_BOOKINGS",
    "READ_PROGRESS_EVALUATIONS",
  ].some((perm) => permissions.includes(perm));

  if (!hasFunctionalPermission) {
    redirect("/admin/unauthorized");
  }

  // 3. Verificar Person asociada y Staff activo en backend
  const staffContextRes = await getTeacherContext();
  if (!staffContextRes?.data?.isStaff) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
      <TeacherNavbar
        user={userContext?.user}
        person={userContext?.person}
      />
      <main className="max-w-400 mx-auto p-4 md:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
