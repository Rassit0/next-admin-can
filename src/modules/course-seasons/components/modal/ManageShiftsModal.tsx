"use client";

import {
  Button,
  Modal,
  Select,
  useOverlayState,
  ListBox,
  Label,
} from "@heroui/react";
import { Add01Icon, Time02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useEffect, useState } from "react";
import { ICourseSeason, IShiftOption } from "@/modules/course-seasons";
import { getShiftsOptions } from "@/modules/course-seasons/actions/get-shifts-options";
import { addShiftAction } from "@/modules/course-seasons/actions/add-shift";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getCategoriesByDisciplineOptions } from "@/modules/course-seasons/actions/get-categories-options";
import { ICategoryOption, Gender } from "@/modules/course-seasons";
import { SelectCategory } from "../form/SelectCategory";

interface Props {
  courseSeason: ICourseSeason;
  urlBase: string;
}

export const ManageShiftsModal = ({ courseSeason, urlBase }: Props) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);
  const [shiftsOptions, setShiftsOptions] = useState<IShiftOption[]>([]);
  const [selectedShiftId, setSelectedShiftId] = useState<string>("");

  const [maxMembers, setMaxMembers] = useState<number>(20);
  const [minMembers, setMinMembers] = useState<number>(5);

  // Independent configuration for this new shift
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
      getShiftsOptions().then((res) => {
        if (!res.error && res.data) {
          setShiftsOptions(res.data.data);
        }
      });
      // urlBase example: /admin/courses/disciplineId/schoolId/courseId/course-seasons...
      const disciplineId = urlBase.split("/")[3];
      if (disciplineId) {
        getCategoriesByDisciplineOptions(disciplineId).then((res) => {
          if (!res.error && res.data) {
            setCategoriesOptions(res.data.data);
          }
        });
      }
    }
  }, [state.isOpen, urlBase]);

  // Filtrar los turnos que ya esti¡n asignados a esta temporada
  const assignedShiftIds =
    courseSeason.shifts?.map((s) => s.shift?.id).filter(Boolean) || [];
  const availableShifts = shiftsOptions.filter(
    (opt) => !assignedShiftIds.includes(opt.id),
  );

  const handleAddShift = async () => {
    const newErrors: Record<string, string> = {};
    if (!selectedShiftId) newErrors.selectedShiftId = "Seleccione un turno";
    if (!categoryId) newErrors.categoryId = "Seleccione una categori­a";
    if (!gender) newErrors.gender = "Seleccione un gi©nero";
    if (minBirthYear && maxBirthYear && minBirthYear > maxBirthYear) {
      newErrors.minBirthYear = "Error en rango de ai±os";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Complete los campos obligatorios");
      return;
    }

    setLoading(true);
    const res = await addShiftAction(courseSeason.id, {
      shiftId: selectedShiftId,
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
      setSelectedShiftId("");
    }
  };

  return (
    <Modal>
      <Button
        size="sm"
        variant="secondary"
        className="font-bold text-xs w-full"
        onPress={() => state.open()}
      >
        <HugeiconsIcon icon={Add01Icon} size={14} />
        Agregar Turno
      </Button>

      <Modal.Backdrop
        isOpen={state.isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedShiftId("");
            setCategoryId(null);
            setGender(null);
            setMinBirthYear(null);
            setMaxBirthYear(null);
            setValidateAge(true);
            setMinMembers(5);
            setMaxMembers(20);
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
                <HugeiconsIcon icon={Time02Icon} />
              </Modal.Icon>
              <Modal.Heading>Agregar Turno Adicional</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Agrega una nueva opción logi­stica (horario) para esta oferta.
              </p>
            </Modal.Header>
            <Modal.Body className="p-0 md:p-6">
              <div className="flex flex-col gap-4 mt-2 mb-4">
                <Select
                  placeholder="Elija un turno disponible..."
                  variant="secondary"
                  className="w-full"
                  value={selectedShiftId || ""}
                  onChange={(e) => {
                    setSelectedShiftId(e ? (e as string) : "");
                  }}
                  isDisabled={loading || availableShifts.length === 0}
                >
                  <Label className="text-sm font-bold mb-1 block">
                    Seleccionar Turno
                  </Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {availableShifts.map((shift) => (
                        <ListBox.Item
                          key={shift.id}
                          id={shift.id}
                          textValue={shift.name}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold">{shift.name}</span>
                          </div>
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                      {availableShifts.length === 0 && (
                        <ListBox.Item
                          key="empty"
                          id="empty"
                          textValue="No hay turnos disponibles"
                          isDisabled
                        >
                          No hay turnos adicionales disponibles
                        </ListBox.Item>
                      )}
                    </ListBox>
                  </Select.Popover>
                </Select>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <SelectCategory
                      label="Categori­a"
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
                  <div className="col-span-1">
                    <label className="text-xs font-bold mb-1 block">
                      Ai±o Nacimiento Min (Opcional)
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
                  </div>
                  <div className="col-span-1">
                    <label className="text-xs font-bold mb-1 block">
                      Ai±o Nacimiento Max (Opcional)
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
                      Cupo Mi¡ximo
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
                      Cupo Mi­nimo
                    </label>
                    <input
                      type="number"
                      className="w-full bg-surface-container border border-border/50 rounded-md p-2 text-sm"
                      value={minMembers}
                      onChange={(e) => setMinMembers(Number(e.target.value))}
                      disabled={loading}
                    />
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
                onPress={handleAddShift}
                isPending={loading}
                isDisabled={!selectedShiftId}
              >
                Agregar Turno
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
