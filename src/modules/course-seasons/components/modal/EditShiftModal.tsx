"use client";

import {
  Button,
  Modal,
  Select,
  useOverlayState,
  ListBox,
  Label,
  Switch,
} from "@heroui/react";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useEffect, useState } from "react";
import { ICourseSeason, ICourseSeasonShift } from "@/modules/course-seasons";
import { editShiftAction } from "@/modules/course-seasons/actions/edit-shift";
import { toast } from "sonner";
import { getCategoriesByDisciplineOptions } from "@/modules/course-seasons/actions/get-categories-options";
import { ICategoryOption, Gender } from "@/modules/course-seasons";
import { SelectCategory } from "../form/SelectCategory";

interface Props {
  courseSeasonId: string;
  urlBase: string;
  shift: ICourseSeasonShift;
}

export const EditShiftModal = ({ courseSeasonId, urlBase, shift }: Props) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);

  const [maxMembers, setMaxMembers] = useState<number>(20);
  const [minMembers, setMinMembers] = useState<number>(5);

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [minBirthYear, setMinBirthYear] = useState<number | null>(null);
  const [maxBirthYear, setMaxBirthYear] = useState<number | null>(null);
  const [validateAge, setValidateAge] = useState<boolean>(true);
  const [categoriesOptions, setCategoriesOptions] = useState<ICategoryOption[]>(
    [],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (state.isOpen) {
      // Pre-fill state when opening
      setCategoryId(shift.categoryId || null);
      setGender(shift.gender || null);
      setMinBirthYear(shift.minBirthYear || null);
      setMaxBirthYear(shift.maxBirthYear || null);
      setValidateAge(shift.validateAge ?? true);
      setMinMembers(shift.minMembers ?? 5);
      setMaxMembers(shift.maxMembers ?? 20);
      setErrors({});

      // Fetch categories
      const disciplineId = urlBase.split("/")[3];
      if (disciplineId) {
        getCategoriesByDisciplineOptions(disciplineId).then((res) => {
          if (!res.error && res.data) {
            setCategoriesOptions(res.data.data);
          }
        });
      }
    }
  }, [state.isOpen, shift, urlBase]);

  const handleEditShift = async () => {
    const newErrors: Record<string, string> = {};
    if (!categoryId) newErrors.categoryId = "Seleccione una categoría";
    if (!gender) newErrors.gender = "Seleccione un género";
    if (minBirthYear && maxBirthYear && minBirthYear > maxBirthYear) {
      newErrors.minBirthYear = "Error en rango de años";
    }
    if (minMembers > maxMembers) {
      newErrors.minMembers = "Mínimo no puede ser mayor que el máximo";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Existen errores en el formulario");
      return;
    }

    setLoading(true);
    const res = await editShiftAction(courseSeasonId, shift.id, {
      categoryId: categoryId!,
      gender: gender!,
      validateAge,
      minBirthYear,
      maxBirthYear,
      maxMembers,
      minMembers,
    });
    setLoading(false);

    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      state.close();
    }
  };

  return (
    <Modal>
      <button
        onClick={() => state.open()}
        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors"
        title="Editar Configuración"
      >
        <HugeiconsIcon
          icon={Edit02Icon}
          size={18}
          className="text-muted-foreground"
        />
      </button>

      <Modal.Backdrop
        isOpen={state.isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setErrors({});
          }
          state.setOpen(isOpen);
        }}
      >
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <HugeiconsIcon icon={Edit02Icon} />
              </Modal.Icon>
              <Modal.Heading>Editar Configuración de Turno</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Turno: <span className="font-bold">{shift.shift?.name}</span>
              </p>
            </Modal.Header>
            <Modal.Body className="p-0 md:p-6">
              <div className="flex flex-col gap-4 mt-2 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <SelectCategory
                      label="Categoría"
                      categoriesOptions={categoriesOptions}
                      categoryId={categoryId}
                      setCategoryId={setCategoryId}
                      errors={errors}
                      handleRemoveError={(f) => {
                        const newErr = { ...errors };
                        delete newErr[f];
                        setErrors(newErr);
                      }}
                      isRequired
                      isDisabled={loading}
                    />
                  </div>
                  <div className="col-span-2">
                    <Select
                      isRequired
                      isDisabled={loading}
                      className="w-full"
                      name="gender"
                      placeholder="Seleccione un genero"
                      variant="secondary"
                      isInvalid={!!errors.gender || undefined}
                      value={gender || ""}
                      onChange={(e: any) => {
                        const val = e?.target ? e.target.value : e;
                        setGender((val as Gender) || null);
                        const newErr = { ...errors };
                        delete newErr.gender;
                        setErrors(newErr);
                      }}
                    >
                      <Label>Rama</Label>
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="MALE" textValue="MALE">
                            Masculino
                          </ListBox.Item>
                          <ListBox.Item id="FEMALE" textValue="FEMALE">
                            Femenino
                          </ListBox.Item>
                          <ListBox.Item id="MIXED" textValue="MIXED">
                            Mixto
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Switch
                      isSelected={validateAge}
                      onChange={setValidateAge}
                      isDisabled={loading}
                    >
                      <Switch.Content>
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                        Validar edad al inscribir
                      </Switch.Content>
                    </Switch>
                  </div>

                  <div className="col-span-1">
                    <label className="text-xs font-bold mb-1 block">
                      Año Nacimiento Min (Opcional)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-surface-container border border-border/50 rounded-md p-2 text-sm"
                      value={minBirthYear || ""}
                      onChange={(e) =>
                        setMinBirthYear(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      disabled={loading}
                    />
                    {errors.minBirthYear && (
                      <span className="text-xs text-danger mt-1">
                        {errors.minBirthYear}
                      </span>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs font-bold mb-1 block">
                      Año Nacimiento Max (Opcional)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-surface-container border border-border/50 rounded-md p-2 text-sm"
                      value={maxBirthYear || ""}
                      onChange={(e) =>
                        setMaxBirthYear(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block">
                      Cupo Máximo
                    </label>
                    <input
                      type="number"
                      className="w-full bg-surface-container border border-border/50 rounded-md p-2 text-sm"
                      value={maxMembers}
                      onChange={(e) => setMaxMembers(Number(e.target.value))}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block">
                      Cupo Mínimo
                    </label>
                    <input
                      type="number"
                      className="w-full bg-surface-container border border-border/50 rounded-md p-2 text-sm"
                      value={minMembers}
                      onChange={(e) => setMinMembers(Number(e.target.value))}
                      disabled={loading}
                    />
                    {errors.minMembers && (
                      <span className="text-xs text-danger mt-1">
                        {errors.minMembers}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onPress={() => state.close()}
                isDisabled={loading}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onPress={handleEditShift}
                isPending={loading}
              >
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
