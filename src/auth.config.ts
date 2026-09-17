import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

import type { User as AuthUser } from "@/modules/auth/interfaces/auth-response.interface";
import { PermissionModule } from "./modules/roles";

// Heredamos del tipado oficial del módulo de Auth y le agregamos el 'token' que NextAuth inyecta
export interface BackendUser extends AuthUser {
  token?: string;
}

// Configuración de acceso: Rutas de Next.js -> Módulos del Backend
// Puedes ir agregando aquí las rutas y qué módulo de tu backend necesitan para entrar
export const moduleAccessControl: {
  path: string;
  requiredModule: PermissionModule;
}[] = [
  // Dashboard principal
  { path: "/admin/dashboard", requiredModule: "DASHBOARD" },

  // Administración de Accesos
  { path: "/admin/users", requiredModule: "USERS" },
  { path: "/admin/roles", requiredModule: "ROLES" },

  // Configuración de la Institución y Sitios
  { path: "/admin/settings", requiredModule: "INSTITUTIONS" },
  { path: "/admin/locations", requiredModule: "LOCATIONS" },
  { path: "/admin/web", requiredModule: "INSTITUTIONS" }, // Asume que la web se gestiona a nivel institución

  // Estructura Deportiva y Académica
  { path: "/admin/disciplines", requiredModule: "DISCIPLINES" },
  { path: "/admin/categories", requiredModule: "CATEGORIES" },
  { path: "/admin/seasons", requiredModule: "SEASONS" },
  { path: "/admin/clubs", requiredModule: "CLUBS" },
  { path: "/admin/schools", requiredModule: "SCHOOLS" },
  { path: "/admin/courses", requiredModule: "COURSES" },
  { path: "/admin/shifts", requiredModule: "SCHEDULES" }, // Mapeado a SCHEDULES temporalmente ya que SHIFTS no existe en BD

  // Gestión de Personas
  { path: "/admin/players", requiredModule: "PLAYERS" },
  { path: "/admin/students", requiredModule: "STUDENTS" },
  { path: "/admin/staff", requiredModule: "STAFF" },

  // Rutas con parámetros dinámicos (Sub-entidades)
  // Equipos (Usa find con regex por lo que soporta /admin/teams/...)
  { path: "/admin/teams", requiredModule: "TEAMS" },
  // { path: "/admin/teams/[disciplineId]/[clubId]", requiredModule: "TEAM_SEASONS" }, // Ejemplo

  // Gestión Operativa
  { path: "/admin/attendance", requiredModule: "SESSIONS" },
];

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Verificamos que tenga token del backend para considerarlo autenticado
      // Esto evita bucles infinitos cuando expira el token pero NextAuth mantiene un user genérico vacío
      const isLoggedIn = !!(auth?.user && (auth.user as BackendUser).token);
      const path = nextUrl.pathname;

      // Si ya está logueado e intenta acceder al login, lo redirigimos al dashboard
      if (isLoggedIn && path.startsWith("/admin/login")) {
        // Si viene con expired=true, permitimos que llegue al login para que el cliente ejecute signOut()
        if (nextUrl.searchParams.get("expired") === "true") {
          return true;
        }
        return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
      }

      if (
        path.startsWith("/admin/login") ||
        path.startsWith("/admin/unauthorized")
      ) {
        return true;
      }

      const isAdminRoute = path.startsWith("/admin");

      if (isAdminRoute) {
        if (!isLoggedIn) return false; // Redirige a /admin/login si no está autenticado
        return true;
      }

      return true;
    },
    // Necesario para guardar la data del backend (roles, permisos) dentro del token de la sesión
    async jwt({ token, user }) {
      const backendUser = user as BackendUser | undefined;
      if (backendUser) {
        // Obtenemos modulos únicos para reducir drásticamente el tamaño del token
        // Asignamos una version reducida del usuario para evitar el Error 431 (Headers Too Large)
        // Extraemos solo lo estrictamente necesario, descartando IDs, fechas y descripciones
        token.user = {
          id: backendUser.id,
          email: backendUser.email,
          isActive: backendUser.isActive,
          roleId: backendUser.roleId,
          modules: backendUser.modules || [],
          token: backendUser.token,
          person: backendUser.person
            ? {
                name: backendUser.person.name,
                lastName: backendUser.person.lastName,
                email: backendUser.person.email,
              }
            : null,
        };

        // Decodificamos el token JWT del backend para obtener su expiración (exp)
        if (backendUser.token) {
          try {
            const payload = JSON.parse(
              Buffer.from(backendUser.token.split(".")[1], "base64").toString(),
            );
            if (payload.exp) {
              token.backendExp = payload.exp;
            }
          } catch (e) {
            console.error("Error decoding backend token:", e);
          }
        }
      }

      // Si el token del backend expiró, limpiamos el token de NextAuth
      // Esto hará que en el middleware auth.user sea undefined y redirija al login (evita bucle en /unauthorized)
      if (
        typeof token.backendExp === "number" &&
        Date.now() / 1000 > token.backendExp
      ) {
        return {};
      }

      return token;
    },
    // Expone la información del token hacia la sesión final (auth.user)
    async session({ session, token }) {
      if (token?.user) {
        session.user = { ...session.user, ...token.user };
      }
      return session;
    },
  },
  session: {
    maxAge: 10 * 60 * 60, // 10 horas
  },
  providers: [],
} satisfies NextAuthConfig;
