"use client";
import { IHomeDiscipline } from "../../interfaces/home-discipline.interface";
import { Chip } from "@heroui/react";
import Image from "next/image";
import { HomeDisciplineActionDropdown } from "./actions/HomeDisciplineActionDropdown";
import { useState } from "react";
import { AddHomeDisciplineModal } from "../modal/AddHomeDisciplineModal";

interface Props {
  homeDisciplines: IHomeDiscipline[];
}

export const TableHomeDisciplines = ({ homeDisciplines }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      {/* <div className="flex justify-between items-center bg-background-tertiary p-4 rounded-xl">
        <h2 className="text-xl font-bold">Listado de Bloques (Equipos/Escuela)</h2>
        <AddHomeDisciplineModal buttonFloatingMobile />
      </div> */}

      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="bg-background-tertiary text-default-600 text-sm">
              <th className="px-4 py-3 rounded-l-xl w-32">Imagen 4:3</th>
              <th className="px-4 py-3 min-w-50">Título</th>
              <th className="px-4 py-3">Redirección</th>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 rounded-r-xl w-16">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {homeDisciplines.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-default-500">
                  No hay bloques registrados.
                </td>
              </tr>
            ) : (
              homeDisciplines.map((homeDiscipline) => (
                <tr
                  key={homeDiscipline.id}
                  className="border-b border-default-200 last:border-b-0 hover:bg-background-tertiary/50"
                >
                  <td className="px-4 py-3">
                    <div className="relative w-25 h-18.75 rounded-md overflow-hidden bg-default-100">
                      <Image
                        src={homeDiscipline.image4x3 || ""}
                        alt={homeDiscipline.title}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-sm line-clamp-2">
                      {homeDiscipline.title}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm line-clamp-1">
                      {homeDiscipline.redirectTo || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold">
                      {homeDiscipline.sortOrder}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Chip
                      size="sm"
                      variant="soft"
                      color={homeDiscipline.isActive ? "success" : "default"}
                    >
                      {homeDiscipline.isActive ? "Activo" : "Inactivo"}
                    </Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <HomeDisciplineActionDropdown
                      homeDiscipline={homeDiscipline}
                    />
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
