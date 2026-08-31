"use client";

import { Button, Modal, useOverlayState, Chip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  Edit02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import React, { useState, useEffect } from "react";
import {
  ITeamSeason,
  ITeamSeasonCategory,
  ICategoryOption,
} from "@/modules/team-seasons";
import {
  getTeamSeasonCategories,
  deactivateTeamSeasonCategory,
  activateTeamSeasonCategory,
} from "@/modules/team-seasons/actions/categories.actions";
import { getCategoriesByDisciplineOptions } from "@/modules/team-seasons/actions/get-categories-options";
import { DrawerCategory } from "../categories/DrawerCategory";
import { FinalizeCategoryModal } from "@/modules/team-seasons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  teamSeason: ITeamSeason;
  urlBase: string;
}

const GENDER_MAP: Record<
  string,
  {
    label: string;
    className:
      | "bg-primary text-background"
      | "bg-accent text-background"
      | "bg-success text-background";
  }
> = {
  MALE: { label: "Masculino", className: "bg-primary text-background" },
  FEMALE: { label: "Femenino", className: "bg-accent text-background" },
  MIXED: { label: "Mixto", className: "bg-success text-background" },
};

export const ViewCategoriesModal = ({ teamSeason, urlBase }: Props) => {
  const state = useOverlayState();
  const router = useRouter();
  const [categories, setCategories] = useState<ITeamSeasonCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState<ICategoryOption[]>(
    [],
  );

  // Edit logic
  const [selectedCategory, setSelectedCategory] = useState<
    ITeamSeasonCategory | undefined
  >();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (state.isOpen) {
      loadData();
    }
  }, [state.isOpen]);

  const loadData = async () => {
    setLoading(true);
    const disciplineId = urlBase.split("/")[3];
    const [catsRes, optsRes] = await Promise.all([
      getTeamSeasonCategories(teamSeason.id),
      getCategoriesByDisciplineOptions(disciplineId),
    ]);

    if (!catsRes.error && catsRes.data) {
      setCategories(catsRes.data);
    }
    if (!optsRes.error && optsRes.data) {
      setCategoriesOptions(optsRes.data.data);
    }
    setLoading(false);
  };

  const handleEdit = (category: ITeamSeasonCategory) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
  };

  const handleToggleStatus = async (category: ITeamSeasonCategory) => {
    let res;
    if (category.isActive) {
      res = await deactivateTeamSeasonCategory(teamSeason.id, category.id);
    } else {
      res = await activateTeamSeasonCategory(teamSeason.id, category.id);
    }

    if (res.error) {
      toast.error(res.message || "Ocurrió un error al cambiar el estado");
    } else {
      toast.success(
        `Categoría ${category.isActive ? "desactivada" : "activada"} exitosamente`,
      );
      loadData();
    }
  };

  const renderCategory = (category: ITeamSeasonCategory) => {
    return (
      <div
        key={category.id}
        className={`p-3 bg-surface-container-low border border-border/50 rounded-xl mb-3 ${!category.isActive ? "opacity-70" : ""}`}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col">
            <span className="font-bold text-sm text-foreground">
              {category.category.name}
            </span>
            <div className="flex gap-2 items-center mt-1">
              <Chip
                size="sm"
                variant="soft"
                className={GENDER_MAP[category.gender]?.className}
              >
                {GENDER_MAP[category.gender]?.label || category.gender}
              </Chip>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold ${
                  category.status === "FINISHED"
                    ? "bg-warning/20 text-warning"
                    : category.isActive
                      ? "bg-success/20 text-success"
                      : "bg-danger/20 text-danger"
                }`}
              >
                {category.status === "FINISHED"
                  ? "Finalizada"
                  : category.isActive
                    ? "Activa"
                    : "Inactiva"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              onPress={() => handleEdit(category)}
            >
              <HugeiconsIcon icon={Edit02Icon} size={16} />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2 text-xs">
          <span className="text-muted-foreground">Miembros permitidos:</span>
          <span className="font-semibold flex items-center gap-2">
            <span className="bg-surface-container-highest px-2 py-0.5 rounded-full text-[10px]">
              {category._count?.player_membership || 0} / {category.maxMembers}
            </span>
          </span>
        </div>
        <div className="flex justify-between items-center mt-1 text-xs">
          <span className="text-muted-foreground">Año de Nac.:</span>
          <span className="font-semibold">
            {category.minBirthYear || "-"} - {category.maxBirthYear || "-"}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-3 pt-3 border-t border-border/50">
          <Button
            size="sm"
            variant="secondary"
            className="flex-1 font-bold text-[10px]"
            onPress={() => {
              state.close();
              router.push(
                `${urlBase}/${teamSeason.id}/player-memberships?teamSeasonCategoryId=${category.id}`,
              );
            }}
          >
            <HugeiconsIcon icon={UserGroupIcon} size={14} />
            Ver Miembros
          </Button>
          <Button
            size="sm"
            variant={category.isActive ? "danger-soft" : "primary"}
            className="font-bold text-[10px] flex-1"
            onPress={() => handleToggleStatus(category)}
            isDisabled={category.status === "FINISHED"}
          >
            {category.isActive ? "Desactivar" : "Activar"}
          </Button>
          <FinalizeCategoryModal
            teamSeasonId={teamSeason.id}
            category={category}
            onSuccess={loadData}
          />
        </div>
      </div>
    );
  };

  return (
    <Modal>
      <Button
        size="sm"
        variant="secondary"
        className="font-bold text-xs w-full justify-start px-4"
        onPress={() => state.open()}
      >
        <span className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="text-accent shrink-0"
          />
          <span>Categorías</span>
        </span>
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="inside">
          <Modal.Dialog className="sm:max-w-xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <HugeiconsIcon icon={Search01Icon} />
              </Modal.Icon>
              <Modal.Heading>Categorías Deportivas</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                {teamSeason.season.name}
              </p>
            </Modal.Header>
            <Modal.Body className="p-0 md:p-6 overflow-y-auto">
              <div className="flex flex-col mt-2 mb-4">
                {loading && (
                  <div className="text-center py-4">Cargando categorías...</div>
                )}
                {!loading && categories.map(renderCategory)}
                {!loading && categories.length === 0 && (
                  <div className="text-center text-sm text-muted py-8">
                    No hay categorías registradas.
                  </div>
                )}
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>

      <DrawerCategory
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          loadData();
        }}
        teamSeasonId={teamSeason.id}
        category={selectedCategory}
        categoriesOptions={categoriesOptions}
      />
    </Modal>
  );
};
