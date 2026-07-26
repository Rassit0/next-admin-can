import { IOrganization } from "@/modules/organizations";
import Link from "next/link";
import React from "react";
import { Crest } from "../crest";

interface Props {
  organization: IOrganization;
}
export const Header = ({ organization }: Props) => {
  return (
    <Link href="/" className="px-4 lg:px-6 mb-8 flex items-center gap-3">
      <span className="text-neon drop-shadow-[0_0_10px_var(--accent)]">
        <Crest className="h-12 w-10" />
      </span>

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
