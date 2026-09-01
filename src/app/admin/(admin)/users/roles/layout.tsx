import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles y Permisos | Next Admin CAN",
  description: "Gestión de roles y permisos",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
