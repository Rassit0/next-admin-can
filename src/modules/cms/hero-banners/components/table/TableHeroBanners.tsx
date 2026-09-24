"use client";
import { IHeroBanner } from "../../interfaces/hero-banner.interface";
import { Chip } from "@heroui/react";
import Image from "next/image";
import { HeroBannerActionDropdown } from "./actions/HeroBannerActionDropdown";
import { useState } from "react";
import { AddHeroBannerModal } from "../modal/AddHeroBannerModal";

interface Props {
  heroBanners: IHeroBanner[];
}

export const TableHeroBanners = ({ heroBanners }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {/* <div className="flex justify-between items-center bg-background-tertiary p-4 rounded-xl">
        <h2 className="text-xl font-bold">Listado de Hero Banners</h2>
        <AddHeroBannerModal buttonFloatingMobile />
      </div> */}

      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="bg-background-tertiary text-default-600 text-sm">
              <th className="px-4 py-3 rounded-l-xl w-32">Imagen 16:9</th>
              <th className="px-4 py-3 min-w-50">Ti­tulo</th>
              <th className="px-4 py-3">CTA</th>
              <th className="px-4 py-3">Redirección</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 rounded-r-xl w-16">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {heroBanners.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-default-500">
                  No hay Hero Banners registrados.
                </td>
              </tr>
            ) : (
              heroBanners.map((heroBanner) => (
                <tr
                  key={heroBanner.id}
                  className="border-b border-default-200 last:border-b-0 hover:bg-background-tertiary/50"
                >
                  <td className="px-4 py-3">
                    <div className="relative w-24 h-13.5 rounded-md overflow-hidden bg-default-100">
                      <Image
                        src={heroBanner.image16x9 || ""}
                        alt={heroBanner.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-sm line-clamp-2">
                      {heroBanner.title}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm line-clamp-1">
                      {heroBanner.ctaText || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm line-clamp-1">
                      {heroBanner.redirectTo || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold">
                      {heroBanner.sortOrder}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Chip
                      size="sm"
                      variant="soft"
                      color={heroBanner.isActive ? "success" : "default"}
                    >
                      {heroBanner.isActive ? "Activo" : "Inactivo"}
                    </Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <HeroBannerActionDropdown heroBanner={heroBanner} />
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
