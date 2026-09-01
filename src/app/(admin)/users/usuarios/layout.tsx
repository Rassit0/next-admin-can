import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuarios | Next Admin CAN",
  description: "Gestión de usuarios",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
