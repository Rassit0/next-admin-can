"use client";

import React, { createContext, useContext, ReactNode } from "react";

// Contexto genérico para almacenar un array de permisos (strings)
const PermissionsContext = createContext<string[]>([]);

export const PermissionsProvider = ({
  children,
  permissions,
}: {
  children: ReactNode;
  permissions: string[];
}) => {
  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  );
};

// Hook personalizado para acceder fácilmente a los permisos
export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error(
      "usePermissions debe ser usado dentro de un PermissionsProvider"
    );
  }
  return context;
};
