import { HeaderPage, TabsRouteNavigation } from "@/ui";
import React from "react";
import { getUserById } from "@/modules/users/actions/users";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

export default async function UserGestionLayout({
  children,
  params,
}: LayoutProps) {
  const { id } = await params;
  const userResponse = await getUserById(id);

  if (userResponse.error && userResponse.statusCode === 401) {
    redirect("/login");
  }

  if (userResponse.error) {
    // If it fails, we still want to show something or let the page component handle it
    // but ideally we'd throw or show an error here. We will just pass through for now
    // and let the tab pages handle the detailed error or just redirect.
  }

  const userEmail = userResponse.data?.email || "Usuario no encontrado";

  const basePath = `/admin/users/${id}`;

  const tabsRoutes = [
    { value: "/", title: "Cuenta" },
    { value: "/person", title: "Datos Personales" },
  ];

  return (
    <>
      <HeaderPage
        title={`Gestión de Usuario: ${userEmail}`}
        description="Administre la información de acceso y el perfil personal asociado."
        breadcrumb={[
          { label: "Usuarios", href: `/admin/users` },
          { label: "Gestión" },
        ]}
      />
      <div className="flex flex-col page-content">
        <TabsRouteNavigation
          routes={tabsRoutes}
          basePath={basePath}
          defaultRoute="/"
        />
        {children}
      </div>
    </>
  );
}
