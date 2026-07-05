"use client";
import { Button, Card } from "@heroui/react";
import React, { useState } from "react";
import { FormSeason } from "../form/Form";

export const CardAdd = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="bg-surface-container-low p-8 rounded-2xl border-l-4 border-primary shadow-sm h-full">
      <h3 className="text-headline-sm font-bold text-on-surface mb-6">
        Apertura Nueva Temporada
      </h3>
      <FormSeason
        formId="form-season-add"
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        institutionId=""
        disciplineId=""
      />
      <Button
        type="submit"
        form="form-season-add"
        variant="primary"
        className="w-full"
        isPending={isLoading}
      >
        Crear Nueva Temporada
      </Button>
    </Card>
  );
};
