"use client";

import { useState } from "react";
import { toast } from "@heroui/react";
import { addTeamSeasonCategory, updateTeamSeasonCategory } from "../../actions/categories.actions";
import { ICategoryOption, ITeamSeasonCategory } from "@/modules/team-seasons";

interface Props {
  teamSeasonId: string;
  category?: ITeamSeasonCategory;
  categoriesOptions: ICategoryOption[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const FormCategory = ({
  teamSeasonId,
  category,
  categoriesOptions,
  onSuccess,
  onCancel,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!category;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const categoryId = formData.get("categoryId") as string;
    const gender = formData.get("gender") as "MALE" | "FEMALE" | "MIXED";
    const minMembers = Number(formData.get("minMembers"));
    const maxMembers = Number(formData.get("maxMembers"));
    const minBirthYearRaw = formData.get("minBirthYear");
    const maxBirthYearRaw = formData.get("maxBirthYear");
    const minBirthYear = minBirthYearRaw ? Number(minBirthYearRaw) : null;
    const maxBirthYear = maxBirthYearRaw ? Number(maxBirthYearRaw) : null;
    const validateAge = formData.get("validateAge") === "true" || formData.get("validateAge") === "on";

    const payload = {
      categoryId,
      gender,
      minMembers,
      maxMembers,
      minBirthYear,
      maxBirthYear,
      validateAge,
    };

    let response;
    if (isEditing) {
      const { categoryId, gender, ...updatePayload } = payload;
      response = await updateTeamSeasonCategory(teamSeasonId, category.id, updatePayload as any);
    } else {
      response = await addTeamSeasonCategory(teamSeasonId, payload as any);
    }

    setIsLoading(false);

    if (response.error) {
      toast.danger(response.message || "Ocurrió un error al guardar la categoría");
      return;
    }

    toast.success(`Categoría ${isEditing ? "actualizada" : "creada"} exitosamente`);
    if (onSuccess) onSuccess();
  };

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-medium">Categoría</label>
        <select
          name="categoryId"
          className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          defaultValue={category?.category?.id || ""}
          required
          disabled={isEditing}
        >
          <option value="" disabled>Seleccione una categoría</option>
          {categoriesOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <label className="text-sm font-medium">Género</label>
        <select
          name="gender"
          className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          defaultValue={category?.gender || ""}
          required
          disabled={isEditing}
        >
          <option value="" disabled>Seleccione el género</option>
          <option value="MALE">Masculino</option>
          <option value="FEMALE">Femenino</option>
          <option value="MIXED">Mixto</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium">Mínimo de atletas</label>
          <input
            className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            name="minMembers"
            type="number"
            defaultValue={category?.minMembers?.toString()}
            required
            min={1}
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium">Máximo de atletas</label>
          <input
            className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            name="maxMembers"
            type="number"
            defaultValue={category?.maxMembers?.toString()}
            required
            min={1}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium">Año Mín. de Nacimiento</label>
          <input
            className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            name="minBirthYear"
            type="number"
            defaultValue={category?.minBirthYear?.toString()}
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm font-medium">Año Máx. de Nacimiento</label>
          <input
            className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            name="maxBirthYear"
            type="number"
            defaultValue={category?.maxBirthYear?.toString()}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input 
          type="checkbox" 
          id="validateAge" 
          name="validateAge" 
          defaultChecked={category?.validateAge ?? true} 
          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="validateAge" className="text-sm font-medium leading-none">
          Validar Edad en la Inscripción
        </label>
      </div>

      <div className="flex justify-end gap-2 mt-4 w-full">
        {onCancel && (
          <button
            type="button"
            className="h-10 px-4 py-2 rounded-md border border-border text-sm font-medium hover:bg-surface-container-low transition-colors"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="h-10 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isEditing ? "Actualizar" : "Crear"} Categoría
        </button>
      </div>
    </form>
  );
};
