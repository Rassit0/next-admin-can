import { IOrganization } from "@/modules/organizations";
import Link from "next/link";
import React from "react";

interface Props {
  organization: IOrganization;
}
export const Header = ({ organization }: Props) => {
  return (
    <Link href="/" className="px-4 lg:px-6 mb-8 flex items-center gap-3">
      <div className="w-10 h-10 shrink-0 rounded-full bg-primary-container flex items-center justify-center">
        <img
          src="/images/logo-can.png"
          alt="Escudo Club Atlético Nacional"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="hidden lg:block logo-details">
        <h1 className="text-xl font-bold tracking-tight text-sky-700 dark:text-sky-400 font-headline">
          {organization.name}
        </h1>
        <p className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wider">
          Administración
        </p>
      </div>
    </Link>
  );
};
