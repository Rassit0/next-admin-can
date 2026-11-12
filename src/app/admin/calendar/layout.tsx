import { getCurrentUserContext } from "@/shared/helpers/server-context";
import { Header, GlobalFooter } from "@/ui";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@heroui/react";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function CalendarLayout({ children }: LayoutProps) {
  const context = await getCurrentUserContext();

  if (!context?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300">
      <div className="max-w-400 mx-auto flex-1 w-full">
        {/* Container for ultra-wide screens */}
        {/* <!-- TopNavBar --> */}
        <Header
          showLogo={true}
          user={context.user}
          person={context.person}
          actions={
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Volver al Menú
              </Button>
            </Link>
          }
        />
        {/* <!-- Dashboard Canvas --> */}
        <main className="page-content">
          <div className="flex flex-col gap-4 max-w-400 mx-auto pb-10">
            <div className="mt-2 px-4 md:px-8">{children}</div>
          </div>
        </main>
      </div>
      <GlobalFooter />
    </div>
  );
}
