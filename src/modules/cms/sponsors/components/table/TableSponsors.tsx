"use client";
import React from "react";
import { Chip } from "@heroui/react";
import { ISponsor } from "../../interfaces/sponsor.interface";
import { EditSponsorModal } from "../modal/EditSponsorModal";
import { DeleteSponsorModal } from "../modal/DeleteSponsorModal";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare02Icon } from "@hugeicons/core-free-icons";

interface Props {
  sponsors: ISponsor[];
}

export const TableSponsors = ({ sponsors }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="bg-background-tertiary text-default-600 text-sm">
              <th className="px-4 py-3 rounded-l-xl w-32">Logo</th>
              <th className="px-4 py-3 min-w-50">Nombre</th>
              <th className="px-4 py-3">Sitio Web</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 rounded-r-xl w-24">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sponsors.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-default-500">
                  No hay auspiciadores registrados.
                </td>
              </tr>
            ) : (
              sponsors.map((sponsor) => (
                <tr
                  key={sponsor.id}
                  className="border-b border-default-200 last:border-b-0 hover:bg-background-tertiary/50"
                >
                  <td className="px-4 py-3">
                    <div className="w-20 h-12 border border-default-200 rounded overflow-hidden flex items-center justify-center bg-white p-1">
                      <img
                        src={sponsor.imageUrl}
                        alt={sponsor.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-sm">{sponsor.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {sponsor.websiteUrl ? (
                      <Link
                        href={sponsor.websiteUrl}
                        target="_blank"
                        className="text-primary hover:underline flex items-center gap-1 text-sm truncate max-w-37.5"
                        title={sponsor.websiteUrl}
                      >
                        <HugeiconsIcon
                          icon={LinkSquare02Icon}
                          className="w-4 h-4 shrink-0"
                        />
                        Visitar
                      </Link>
                    ) : (
                      <span className="text-default-400">Sin enlace</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{sponsor.sortOrder}</td>
                  <td className="px-4 py-3 text-center">
                    <Chip
                      variant="soft"
                      color={sponsor.isActive ? "success" : "default"}
                      size="sm"
                    >
                      {sponsor.isActive ? "Activo" : "Inactivo"}
                    </Chip>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <EditSponsorModal sponsor={sponsor} />
                      <DeleteSponsorModal sponsor={sponsor} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
