import { auth } from "@/auth";
import { Header } from "@/ui";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@heroui/react";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function CalendarLayout({ children }: LayoutProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen transition-all duration-300">
      <div className="max-w-400 mx-auto">
        {/* Container for ultra-wide screens */}
        {/* <!-- TopNavBar --> */}
        <Header
          showLogo={true}
          actions={
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Volver al Meníº
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
    </div>
  );
}
