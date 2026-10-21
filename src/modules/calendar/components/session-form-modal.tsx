"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Select,
  Label,
  ListBox,
  Input,
  TextField,
  CheckboxGroup,
  Checkbox,
  CloseButton,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Edit02Icon,
  Mortarboard02Icon,
  UserGroupIcon,
  LockPasswordIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { createSession } from "../actions/create-session.action";
import { updateSession } from "../actions/update-session.action";
import { getLocations, ILocation } from "@/modules/locations";
import { getTeamSeasons } from "@/modules/team-seasons";
import { getCourseSeasons } from "@/modules/course-seasons/actions/get";
import { buildCalendarRecurrenceRule } from "../utils/calendar-recurrence.utils";
import { createTeacherSession } from "@/modules/teacher/actions/create-teacher-session";
import { updateTeacherSession } from "@/modules/teacher/actions/update-teacher-session";
import { getTeacherLocations } from "@/modules/teacher/actions/get-teacher-locations";
import {
  CreateTeacherSessionInput,
  UpdateTeacherSessionInput,
} from "@/modules/teacher/interfaces/teacher.interface";

export interface PresetGroupContext {
  type: "COURSE" | "TEAM";
  groupId: string; // CourseSeasonShift ID or TeamSeasonCategory ID
  groupName: string;
  seasonEndDate?: string;
  isTeacherContext?: boolean;
}

export interface SessionInitialData {
  id: string;
  title?: string;
  locationId?: string;
  startDate: string; // ISO 8601
  durationMin: number;
  recurrenceRule?: string;
  timezone?: string;
  seriesId?: string;
  teamSeasonCategoryIds?: string[];
  courseSeasonShiftIds?: string[];
}

export interface SessionFormModalProps {
  state?: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
  };
  isOpen?: boolean;
  onClose?: () => void;
  mode: "create" | "edit";
  initialData?: SessionInitialData | null;
  onSuccess?: () => void;
  presetGroup?: PresetGroupContext;
}

export const SessionFormModal = ({
  state,
  isOpen: propsIsOpen,
  onClose,
  mode,
  initialData,
  onSuccess,
  presetGroup,
}: SessionFormModalProps) => {
  const isOpen = state ? state.isOpen : Boolean(propsIsOpen);

  const handleClose = () => {
    if (state) state.close();
    if (onClose) onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) handleClose();
    else if (state) state.open();
  };

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Options
  const [locations, setLocations] = useState<
    Array<{ id: string; name: string; address?: string | null }>
  >([]);
  const [categories, setCategories] = useState<
    { id: string; name: string; gender: string; seasonName?: string }[]
  >([]);
  const [shifts, setShifts] = useState<
    {
      id: string;
      shiftName: string;
      categoryName?: string;
      courseName?: string;
    }[]
  >([]);

  // Form State
  const [title, setTitle] = useState("");
  const [locationId, setLocationId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [durationMin, setDurationMin] = useState(90);

  // Associations
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedShiftIds, setSelectedShiftIds] = useState<Set<string>>(
    new Set(),
  );

  // Recurrence State
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [recurrenceDays, setRecurrenceDays] = useState<string[]>([]);
  const [untilDate, setUntilDate] = useState("");

  // Update Scope (only for edit mode with seriesId)
  const [updateScope, setUpdateScope] = useState<
    "single" | "following" | "all"
  >("single");

  useEffect(() => {
    if (isOpen) {
      loadDependencies();
      if (mode === "edit" && initialData) {
        setTitle(initialData.title || "");
        setLocationId(initialData.locationId || "");
        setDurationMin(initialData.durationMin || 90);

        if (presetGroup) {
          if (presetGroup.type === "COURSE") {
            setSelectedShiftIds(new Set([presetGroup.groupId]));
            setSelectedCategoryIds(new Set());
          } else {
            setSelectedCategoryIds(new Set([presetGroup.groupId]));
            setSelectedShiftIds(new Set());
          }
        } else {
          setSelectedCategoryIds(
            new Set(initialData.teamSeasonCategoryIds || []),
          );
          setSelectedShiftIds(new Set(initialData.courseSeasonShiftIds || []));
        }

        // Format dates for inputs
        if (initialData.startDate) {
          const d = new Date(initialData.startDate);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          setStartDate(`${year}-${month}-${day}`);

          const hours = String(d.getHours()).padStart(2, "0");
          const mins = String(d.getMinutes()).padStart(2, "0");
          setStartTime(`${hours}:${mins}`);
        }

        if (initialData.recurrenceRule) {
          setIsRecurrent(true);
        } else {
          setIsRecurrent(false);
        }
      } else {
        resetForm();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode, initialData, presetGroup]);

  const resetForm = () => {
    const defaultTitle = presetGroup
      ? presetGroup.type === "COURSE"
        ? "Clase Regular"
        : "Entrenamiento Regular"
      : "";
    setTitle(defaultTitle);
    setLocationId("");

    // Default to tomorrow 16:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");
    setStartDate(`${year}-${month}-${day}`);
    setStartTime("16:00");
    setDurationMin(90);

    if (presetGroup) {
      if (presetGroup.type === "COURSE") {
        setSelectedShiftIds(new Set([presetGroup.groupId]));
        setSelectedCategoryIds(new Set());
      } else {
        setSelectedCategoryIds(new Set([presetGroup.groupId]));
        setSelectedShiftIds(new Set());
      }
      if (presetGroup.seasonEndDate) {
        setUntilDate(presetGroup.seasonEndDate.split("T")[0]);
      } else {
        setUntilDate("");
      }
    } else {
      setSelectedCategoryIds(new Set());
      setSelectedShiftIds(new Set());
      setUntilDate("");
    }

    setIsRecurrent(false);
    setRecurrenceDays([]);
    setUpdateScope("single");
  };

  const loadDependencies = async () => {
    setLoadingData(true);
    try {
      if (presetGroup?.isTeacherContext) {
        const locsRes = await getTeacherLocations();
        if (!locsRes.error && locsRes.data) {
          setLocations(
            locsRes.data.map((l) => ({
              id: l.id,
              name: l.name,
              address: l.address ?? undefined,
            })),
          );
        }
      } else {
        const [locsRes, seasonsRes, courseRes] = await Promise.all([
          getLocations({ per_page: "100" }),
          !presetGroup
            ? getTeamSeasons({ per_page: "100" })
            : Promise.resolve({ error: false, data: { data: [] } }),
          !presetGroup
            ? getCourseSeasons({ per_page: "100" })
            : Promise.resolve({ error: false, data: { data: [] } }),
        ]);

        if (!locsRes.error && locsRes.data) {
          setLocations(
            locsRes.data.data.map((l: any) => ({
              id: String(l.id),
              name: l.name,
              address: l.address ?? undefined,
            })),
          );
        }

        if (!seasonsRes.error && seasonsRes.data?.data) {
          const cats = seasonsRes.data.data.flatMap((ts: any) =>
            ts.categories.map((c: any) => ({
              id: c.id,
              name: c.category.name,
              gender: c.gender,
              seasonName: ts.season.name,
            })),
          );
          setCategories(cats);
        }

        if (!courseRes.error && courseRes.data?.data) {
          const mappedShifts = courseRes.data.data.flatMap((cs: any) =>
            cs.shifts.map((sh: any) => ({
              id: sh.id,
              shiftName: sh.shift.name,
              categoryName: sh.category?.name,
              courseName: cs.course?.name,
            })),
          );
          setShifts(mappedShifts);
        }
      }
    } catch (e) {
      toast.error("Error cargando dependencias de programación");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!startDate || !startTime || !durationMin) {
      toast.error("Fechas y duración requeridas");
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}:00`);

    if (isNaN(startDateTime.getTime())) {
      toast.error("Fecha u hora inválida");
      return;
    }

    const endDateTime = new Date(startDateTime.getTime() + durationMin * 60000);

    const rrule = isRecurrent
      ? buildCalendarRecurrenceRule(recurrenceDays, untilDate)
      : undefined;

    setLoading(true);
    try {
      let res;

      if (presetGroup?.isTeacherContext) {
        // Teacher Portal protected endpoint
        if (mode === "create") {
          const teacherPayload: CreateTeacherSessionInput = {
            title: title.trim() || undefined,
            startDate: startDateTime.toISOString(),
            endDate: endDateTime.toISOString(),
            durationMin: Number(durationMin),
            locationId: locationId || null,
            recurrenceRule: rrule || undefined,
            timezone: isRecurrent
              ? Intl.DateTimeFormat().resolvedOptions().timeZone ||
                "America/La_Paz"
              : undefined,
          };
          res = await createTeacherSession(
            presetGroup.type,
            presetGroup.groupId,
            teacherPayload,
          );
        } else {
          const updatePayload: UpdateTeacherSessionInput = {
            title: title.trim() || undefined,
            startDate: startDateTime.toISOString(),
            endDate: endDateTime.toISOString(),
            durationMin: Number(durationMin),
            locationId: locationId || null,
          };
          res = await updateTeacherSession(
            presetGroup.type,
            presetGroup.groupId,
            initialData!.id,
            updatePayload,
          );
        }
      } else {
        // Administrative / Calendar unified engine endpoint
        const targetCategoryIds =
          presetGroup?.type === "TEAM"
            ? [presetGroup.groupId]
            : Array.from(selectedCategoryIds);

        const targetShiftIds =
          presetGroup?.type === "COURSE"
            ? [presetGroup.groupId]
            : Array.from(selectedShiftIds);

        const payload: any = {
          title: title.trim() || undefined,
          locationId: locationId || undefined,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          durationMin: Number(durationMin),
          teamSeasonCategoryIds:
            targetCategoryIds.length > 0 ? targetCategoryIds : undefined,
          courseSeasonShiftIds:
            targetShiftIds.length > 0 ? targetShiftIds : undefined,
        };

        if (isRecurrent && rrule) {
          payload.recurrenceRule = rrule;
          payload.timezone =
            Intl.DateTimeFormat().resolvedOptions().timeZone || "America/La_Paz";
        }

        if (mode === "create") {
          res = await createSession(payload);
        } else {
          res = await updateSession(
            initialData!.id,
            payload,
            initialData?.seriesId ? updateScope : "single",
          );
        }
      }

      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        handleClose();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || "Error guardando la sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="max-w-2xl bg-content1 border border-divider shadow-xl rounded-2xl">
            <Modal.Header>
              <div className="flex justify-between items-center w-full">
                <h3 className="font-semibold text-lg text-foreground">
                  {mode === "create" ? "Programar Sesión" : "Editar Sesión"}
                </h3>
                <CloseButton onPress={handleClose} />
              </div>
            </Modal.Header>
            <Modal.Body className="max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col gap-5 p-1">
                {/* Preset Group Locked Indicator */}
                {presetGroup && (
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20 text-primary shrink-0">
                        <HugeiconsIcon
                          icon={
                            presetGroup.type === "COURSE"
                              ? Mortarboard02Icon
                              : UserGroupIcon
                          }
                          size={18}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-wider text-primary font-bold">
                          {presetGroup.type === "COURSE"
                            ? "Turno de Escuela"
                            : "Categoría de Equipo"}{" "}
                          (Bloqueado)
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {presetGroup.groupName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-content2 text-default-500 text-xs font-medium">
                      <HugeiconsIcon icon={LockPasswordIcon} size={14} />
                      <span>Contexto Fijo</span>
                    </div>
                  </div>
                )}

                {/* Title */}
                <TextField>
                  <Label className="font-semibold text-sm">
                    Título descriptivo
                  </Label>
                  <Input
                    variant="secondary"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Entrenamiento Táctico / Clase Regular"
                  />
                </TextField>

                {/* Scope Editor if Series in edit mode */}
                {mode === "edit" && initialData?.seriesId && (
                  <div className="bg-warning/10 border border-warning/20 p-3 rounded-xl flex flex-col gap-2">
                    <p className="text-sm text-warning font-semibold">
                      Esta sesión pertenece a una serie recurrente.
                    </p>
                    <Select
                      variant="secondary"
                      selectedKey={updateScope}
                      onSelectionChange={(k) =>
                        setUpdateScope(k as "single" | "following" | "all")
                      }
                    >
                      <Label className="text-sm">¿Qué deseas modificar?</Label>
                      <Select.Trigger />
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="single" textValue="Solo esta sesión">
                            Solo esta sesión
                          </ListBox.Item>
                          <ListBox.Item
                            id="following"
                            textValue="Esta y las siguientes"
                          >
                            Esta y las siguientes
                          </ListBox.Item>
                          <ListBox.Item id="all" textValue="Toda la serie">
                            Toda la serie
                          </ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                )}

                {/* Dates & Times */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <TextField>
                    <Label className="font-semibold text-sm">
                      Fecha Inicio *
                    </Label>
                    <Input
                      type="date"
                      variant="secondary"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </TextField>
                  <TextField>
                    <Label className="font-semibold text-sm">Hora Inicio *</Label>
                    <Input
                      type="time"
                      variant="secondary"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </TextField>
                  <TextField>
                    <Label className="font-semibold text-sm">
                      Duración (min) *
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      variant="secondary"
                      value={String(durationMin)}
                      onChange={(e) => setDurationMin(Number(e.target.value))}
                    />
                  </TextField>
                </div>

                {/* Location */}
                <Select
                  variant="secondary"
                  selectedKey={locationId}
                  onSelectionChange={(k) => setLocationId(k ? String(k) : "")}
                  isDisabled={loadingData}
                >
                  <Label className="font-semibold text-sm">
                    Ubicación / Instalación
                  </Label>
                  <Select.Trigger />
                  <Select.Popover>
                    <ListBox
                      items={[
                        { id: "empty", name: "-- Por definir --" },
                        ...locations,
                      ]}
                    >
                      {(l) => (
                        <ListBox.Item
                          id={l.id === "empty" ? "" : l.id}
                          textValue={l.name}
                        >
                          {l.name}
                        </ListBox.Item>
                      )}
                    </ListBox>
                  </Select.Popover>
                </Select>

                {/* Associations (Only when no presetGroup) */}
                {!presetGroup && (
                  <>
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold text-sm">
                        Equipos (Categorías)
                      </Label>
                      <div className="border border-border rounded-lg p-3 max-h-48 overflow-y-auto bg-secondary/50">
                        <CheckboxGroup
                          value={Array.from(selectedCategoryIds)}
                          onChange={(val) =>
                            setSelectedCategoryIds(new Set(val))
                          }
                        >
                          {categories.map((c) => (
                            <Checkbox key={c.id} value={c.id}>
                              {c.name} ({c.gender}){" "}
                              {c.seasonName && (
                                <span className="text-xs text-muted ml-1">
                                  - {c.seasonName}
                                </span>
                              )}
                            </Checkbox>
                          ))}
                          {categories.length === 0 && !loadingData && (
                            <span className="text-sm text-muted">
                              No hay equipos disponibles
                            </span>
                          )}
                        </CheckboxGroup>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold text-sm">
                        Escuelas (Turnos)
                      </Label>
                      <div className="border border-border rounded-lg p-3 max-h-48 overflow-y-auto bg-secondary/50">
                        <CheckboxGroup
                          value={Array.from(selectedShiftIds)}
                          onChange={(val) => setSelectedShiftIds(new Set(val))}
                        >
                          {shifts.map((s) => (
                            <Checkbox key={s.id} value={s.id}>
                              {s.shiftName}{" "}
                              {s.categoryName && `(${s.categoryName})`}
                              <span className="text-xs text-muted ml-1">
                                - {s.courseName}
                              </span>
                            </Checkbox>
                          ))}
                          {shifts.length === 0 && !loadingData && (
                            <span className="text-sm text-muted">
                              No hay turnos disponibles
                            </span>
                          )}
                        </CheckboxGroup>
                      </div>
                    </div>
                  </>
                )}

                {/* Recurrence Editor */}
                {mode === "create" && (
                  <div className="border-t border-border mt-2 pt-4 flex flex-col gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-primary focus:ring-primary"
                        checked={isRecurrent}
                        onChange={(e) => setIsRecurrent(e.target.checked)}
                      />
                      <span className="font-semibold text-sm text-foreground">
                        Programar recurrencia semanal (Serie periódica)
                      </span>
                    </label>

                    {isRecurrent && (
                      <div className="flex flex-col gap-4 bg-default-50 border border-divider p-4 rounded-xl">
                        <CheckboxGroup
                          value={recurrenceDays}
                          onChange={setRecurrenceDays}
                          className="flex flex-row flex-wrap gap-2"
                        >
                          <Label className="text-sm font-semibold w-full">
                            Días de repetición semanal *
                          </Label>
                          <Checkbox value="MO">Lun</Checkbox>
                          <Checkbox value="TU">Mar</Checkbox>
                          <Checkbox value="WE">Mié</Checkbox>
                          <Checkbox value="TH">Jue</Checkbox>
                          <Checkbox value="FR">Vie</Checkbox>
                          <Checkbox value="SA">Sáb</Checkbox>
                          <Checkbox value="SU">Dom</Checkbox>
                        </CheckboxGroup>

                        <TextField>
                          <Label className="font-semibold text-sm">
                            Repetir hasta *
                          </Label>
                          <Input
                            type="date"
                            variant="secondary"
                            value={untilDate}
                            max={
                              presetGroup?.seasonEndDate
                                ? presetGroup.seasonEndDate.split("T")[0]
                                : undefined
                            }
                            onChange={(e) => setUntilDate(e.target.value)}
                          />
                          {presetGroup?.seasonEndDate && (
                            <span className="text-xs text-default-400 mt-1 block">
                              Vigencia máxima de la temporada:{" "}
                              {presetGroup.seasonEndDate.split("T")[0]}
                            </span>
                          )}
                        </TextField>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={handleClose}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onPress={handleSubmit}
                isPending={loading}
                isDisabled={
                  loading ||
                  loadingData ||
                  !startDate ||
                  !startTime ||
                  !durationMin ||
                  (isRecurrent && (!recurrenceDays.length || !untilDate))
                }
              >
                <HugeiconsIcon
                  icon={mode === "create" ? Add01Icon : Edit02Icon}
                  size={18}
                />
                {mode === "create" ? "Guardar Sesión" : "Actualizar Sesión"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
