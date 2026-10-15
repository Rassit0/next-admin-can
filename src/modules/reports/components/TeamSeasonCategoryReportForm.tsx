"use client";

import { useState, useEffect } from "react";
import type { Key } from "@heroui/react";
import { Select, ListBox, Label, Spinner, Button } from "@heroui/react";
import { Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import {
  getTeamSeasons,
  getTeamSeasonCategories,
  ITeamSeasonCategory,
} from "@/modules/team-seasons";
import { downloadMatrixAction } from "../actions/download-matrix.action";

interface TeamSeasonOption {
  id: string;
  label: string;
}

interface CategoryOption {
  id: string;
  label: string;
}

const GENDER_MAP: Record<string, string> = {
  MALE: "Masculino",
  FEMALE: "Femenino",
  MIXED: "Mixto",
};

export function TeamSeasonCategoryReportForm() {
  const [teamSeasons, setTeamSeasons] = useState<TeamSeasonOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const [teamSeasonId, setTeamSeasonId] = useState<Key | null>(null);
  const [teamSeasonCategoryId, setTeamSeasonCategoryId] = useState<Key | null>(null);

  const [isLoadingTeamSeasons, setIsLoadingTeamSeasons] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    setIsLoadingTeamSeasons(true);
    getTeamSeasons({ per_page: "100" })
      .then((res) => {
        if (!res.error && res.data?.data) {
          const options: TeamSeasonOption[] = res.data.data.map((ts) => {
            const disciplineName = ts.team?.club?.discipline?.name;
            const teamName = ts.team?.name || "Equipo";
            const seasonName = ts.season?.name || "Temporada";
            const label = disciplineName
              ? `${disciplineName} · ${teamName} - ${seasonName}`
              : `${teamName} - ${seasonName}`;

            return {
              id: ts.id,
              label,
            };
          });
          setTeamSeasons(options);
        } else {
          toast.error(res.message || "Error al cargar las temporadas de equipo");
        }
      })
      .catch((err) => {
        console.error("Error al cargar temporadas:", err);
        toast.error("Error al cargar las temporadas de equipo");
      })
      .finally(() => {
        setIsLoadingTeamSeasons(false);
      });
  }, []);

  useEffect(() => {
    // Reset category selection and options when team season changes
    setTeamSeasonCategoryId(null);
    setCategories([]);

    if (!teamSeasonId) {
      return;
    }

    setIsLoadingCategories(true);
    getTeamSeasonCategories(teamSeasonId.toString())
      .then((res) => {
        if (!res.error && res.data) {
          const options: CategoryOption[] = res.data.map(
            (c: ITeamSeasonCategory) => {
              const genderLabel = GENDER_MAP[c.gender] || c.gender;
              const statusLabel =
                c.status === "FINISHED" ? " (Finalizada)" : "";
              return {
                id: c.id,
                label: `${c.category.name} - ${genderLabel}${statusLabel}`,
              };
            },
          );
          setCategories(options);
        } else {
          toast.error(res.message || "Error al cargar categorías");
        }
      })
      .catch((err) => {
        console.error("Error al cargar categorías:", err);
        toast.error("Error al cargar las categorías de la temporada");
      })
      .finally(() => {
        setIsLoadingCategories(false);
      });
  }, [teamSeasonId]);

  const isFormValid = Boolean(teamSeasonId && teamSeasonCategoryId);

  const handleDownload = async () => {
    if (!teamSeasonId || !teamSeasonCategoryId) return;

    try {
      setIsDownloading(true);
      const endpoint = `reports/payments-matrix/team-seasons/${teamSeasonId.toString()}/pdf?teamSeasonCategoryId=${encodeURIComponent(
        teamSeasonCategoryId.toString(),
      )}&issuedAt=${encodeURIComponent(new Date().toISOString())}`;

      const result = await downloadMatrixAction(endpoint);

      if (!result.success || !result.url) {
        throw new Error(result.error || "Error al generar el reporte");
      }

      // Convert Data URL to Blob to prevent browser hanging on large base64 strings
      const base64Part = result.url.split(",")[1];
      const byteCharacters = atob(base64Part);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");

      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      toast.success("Reporte generado exitosamente");
    } catch (error: any) {
      toast.error(
        error.message || "Ocurrió un error inesperado al descargar el reporte",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-default-50 max-w-xl shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-primary">
          CONTROL DE PAGOS POR CATEGORÍA DE EQUIPO
        </h3>
        <p className="text-sm text-default-500 mt-1">
          Genera el control de pagos de los jugadores de una categoría específica de una temporada de equipo.
        </p>
      </div>

      {/* Select Temporada / Equipo */}
      <Select
        className="w-full"
        placeholder="Selecciona una temporada de equipo"
        value={teamSeasonId}
        onChange={(val) => setTeamSeasonId(val)}
        isDisabled={isLoadingTeamSeasons}
      >
        <Label>
          Temporada / Equipo {isLoadingTeamSeasons && <Spinner size="sm" />}
        </Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {teamSeasons.map((ts) => (
              <ListBox.Item key={ts.id} id={ts.id} textValue={ts.label}>
                {ts.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      {/* Select Categoría */}
      <Select
        className="w-full"
        placeholder={
          !teamSeasonId
            ? "Primero selecciona una temporada de equipo"
            : categories.length === 0 && !isLoadingCategories
              ? "No hay categorías disponibles"
              : "Selecciona una categoría"
        }
        value={teamSeasonCategoryId}
        onChange={(val) => setTeamSeasonCategoryId(val)}
        isDisabled={!teamSeasonId || isLoadingCategories}
      >
        <Label>
          Categoría {isLoadingCategories && <Spinner size="sm" />}
        </Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {categories.map((c) => (
              <ListBox.Item key={c.id} id={c.id} textValue={c.label}>
                {c.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      {/* Botón de Generación / Mensaje */}
      <div className="mt-4 pt-4 border-t flex flex-col gap-2">
        <Button
          className="w-full"
          variant="primary"
          onClick={handleDownload}
          isDisabled={!isFormValid || isDownloading}
        >
          {isDownloading ? (
            <>
              <Spinner size="sm" />
              Generando reporte...
            </>
          ) : (
            <>
              <HugeiconsIcon icon={Download01Icon} />
              Generar PDF
            </>
          )}
        </Button>

        {!isFormValid && (
          <div className="text-xs text-muted-foreground bg-default-100 p-2.5 rounded-md">
            Selecciona una temporada de equipo y una categoría para habilitar la descarga del reporte.
          </div>
        )}
      </div>
    </div>
  );
}
