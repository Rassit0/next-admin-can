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
import { Add01Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { createSession } from "../actions/create-session.action";
import { updateSession } from "../actions/update-session.action";
import { getLocations, ILocation } from "@/modules/locations";
import { getTeamSeasons } from "@/modules/team-seasons";
import { getCourseSeasons } from "@/modules/course-seasons/actions/get";
import { buildCalendarRecurrenceRule } from "../utils/calendar-recurrence.utils";

interface SessionInitialData {
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

interface Props {
  state: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
  };
  mode: "create" | "edit";
  initialData?: SessionInitialData | null;
  onSuccess?: () => void;
  // If editing an event from a series, backend could need the scope
  // If we don't have it here, we will just use single if seriesId is empty
}

export const SessionFormModal = ({
  state,
  mode,
  initialData,
  onSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Options
  const [locations, setLocations] = useState<ILocation[]>([]);
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
    if (state.isOpen) {
      loadDependencies();
      if (mode === "edit" && initialData) {
        setTitle(initialData.title || "");
        setLocationId(initialData.locationId || "");
        setDurationMin(initialData.durationMin || 90);

        setSelectedCategoryIds(
          new Set(initialData.teamSeasonCategoryIds || []),
        );
        setSelectedShiftIds(new Set(initialData.courseSeasonShiftIds || []));

        // Format dates for inputs
        if (initialData.startDate) {
          const d = new Date(initialData.startDate);
          // Get local date YYYY-MM-DD
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          setStartDate(`${year}-${month}-${day}`);

          // Get local time HH:mm
          const hours = String(d.getHours()).padStart(2, "0");
          const mins = String(d.getMinutes()).padStart(2, "0");
          setStartTime(`${hours}:${mins}`);
        }

        // Simplistic Recurrence display logic based on RRULE presence
        if (initialData.recurrenceRule) {
          setIsRecurrent(true);
          // NOTE: Extrapolating RRULE back to UI is complex. For this phase,
          // if we want to support full edit, we could parse RRULE.
          // But as requested: "Implementar iÂºnicamente las opciones que el backend soporte"
          // We will reset or assume they need to re-select if they change recurrences.
        } else {
          setIsRecurrent(false);
        }
      } else {
        resetForm();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen, mode, initialData]);

  const resetForm = () => {
    setTitle("");
    setLocationId("");
    setStartDate("");
    setStartTime("");
    setDurationMin(90);
    setSelectedCategoryIds(new Set());
    setSelectedShiftIds(new Set());
    setIsRecurrent(false);
    setRecurrenceDays([]);
    setUntilDate("");
    setUpdateScope("single");
  };

  const loadDependencies = async () => {
    setLoadingData(true);
    try {
      const [locsRes, seasonsRes, courseRes] = await Promise.all([
        getLocations({ per_page: "100" }),
        getTeamSeasons({ per_page: "100" }),
        getCourseSeasons({ per_page: "100" }),
      ]);

      if (!locsRes.error) setLocations(locsRes.data.data);

      if (!seasonsRes.error) {
        const cats = seasonsRes.data.data.flatMap((ts) =>
          ts.categories.map((c) => ({
            id: c.id,
            name: c.category.name,
            gender: c.gender,
            seasonName: ts.season.name,
          })),
        );
        setCategories(cats);
      }

      if (!courseRes.error) {
        const mappedShifts = courseRes.data.data.flatMap((cs) =>
          cs.shifts.map((sh) => ({
            id: sh.id,
            shiftName: sh.shift.name,
            categoryName: sh.category?.name,
            courseName: cs.course?.name,
          })),
        );
        setShifts(mappedShifts);
      }
    } catch (e) {
      toast.error("Error cargando catiÂ¡logos");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!startDate || !startTime || !durationMin) {
      toast.error("Fechas y duraciiÂ³n requeridas");
      return;
    }

    // Build Start & End Date (UTC ISO 8601)
    // The user selects local date/time, we create a local Date object.
    const startDateTime = new Date(`${startDate}T${startTime}:00`);

    // Validate valid date
    if (isNaN(startDateTime.getTime())) {
      toast.error("Fecha u hora inviÂ¡lida");
      return;
    }

    const endDateTime = new Date(startDateTime.getTime() + durationMin * 60000);

    const payload: any = {
      title: title || undefined,
      locationId: locationId || undefined,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      durationMin: Number(durationMin),
      teamSeasonCategoryIds: Array.from(selectedCategoryIds),
      courseSeasonShiftIds: Array.from(selectedShiftIds),
    };

    if (isRecurrent) {
      const rrule = buildCalendarRecurrenceRule(recurrenceDays, untilDate);
      if (rrule) {
        payload.recurrenceRule = rrule;
        // Defaulting timezone to local timezone name, or could use Intl API
        payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
    }

    setLoading(true);
    try {
      let res;
      if (mode === "create") {
        res = await createSession(payload);
      } else {
        res = await updateSession(
          initialData!.id,
          payload,
          initialData?.seriesId ? updateScope : "single",
        );
      }

      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        state.close();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || "Error guardando la sesiiÂ³n");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={state.isOpen} onOpenChange={state.toggle}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="max-w-2xl">
            <Modal.Header>
              <div className="flex justify-between items-center w-full">
                <h3 className="font-semibold text-lg">
                  {mode === "create" ? "Crear SesiiÂ³n" : "Editar SesiiÂ³n"}
                </h3>
                <CloseButton onPress={() => state.close()} />
              </div>
            </Modal.Header>
            <Modal.Body className="max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col gap-5 p-1">
                {/* Title */}
                <TextField>
                  <Label className="font-semibold text-sm">
                    TiÂ­tulo (Opcional)
                  </Label>
                  <Input
                    variant="secondary"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Entrenamiento de Resistencia"
                  />
                </TextField>

                {/* Scope Editor if Series */}
                {mode === "edit" && initialData?.seriesId && (
                  <div className="bg-warning/10 p-3 rounded-lg flex flex-col gap-2">
                    <p className="text-sm text-warning font-semibold">
                      Esta sesiiÂ³n pertenece a una serie recurrente.
                    </p>
                    <Select
                      variant="secondary"
                      selectedKey={updateScope}
                      onSelectionChange={(k) =>
                        setUpdateScope(k as "single" | "following" | "all")
                      }
                    >
                      <Label className="text-sm">
                        ÃÂ¿QuiÂ© deseas modificar?
                      </Label>
                      <Select.Trigger />
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item
                            id="single"
                            textValue="Solo esta sesiiÂ³n"
                          >
                            Solo esta sesiiÂ³n
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
                    <Label className="font-semibold text-sm">
                      Hora Inicio *
                    </Label>
                    <Input
                      type="time"
                      variant="secondary"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </TextField>
                  <TextField>
                    <Label className="font-semibold text-sm">
                      DuraciiÂ³n (min) *
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
                  <Label className="font-semibold text-sm">UbicaciiÂ³n</Label>
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

                {/* Associations */}
                <div className="flex flex-col gap-2">
                  <Label className="font-semibold text-sm">
                    Equipos (CategoriÂ­as)
                  </Label>
                  <div className="border border-border rounded-lg p-3 max-h-48 overflow-y-auto bg-secondary/50">
                    <CheckboxGroup
                      value={Array.from(selectedCategoryIds)}
                      onChange={(val) => setSelectedCategoryIds(new Set(val))}
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

                {/* Recurrence Editor */}
                {mode === "create" && (
                  <div className="border-t border-border mt-2 pt-4 flex flex-col gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-primary focus:ring-primary"
                        checked={isRecurrent}
                        onChange={(e) => setIsRecurrent(e.target.checked)}
                      />
                      <span className="font-semibold text-sm">
                        SesiiÂ³n Recurrente (Semanal)
                      </span>
                    </label>

                    {isRecurrent && (
                      <div className="flex flex-col gap-4 bg-muted/30 p-4 rounded-lg">
                        <CheckboxGroup
                          value={recurrenceDays}
                          onChange={setRecurrenceDays}
                          className="flex flex-row flex-wrap gap-2"
                        >
                          <Label className="text-sm font-semibold w-full">
                            DiÂ­as de repeticiiÂ³n
                          </Label>
                          <Checkbox value="MO">Lun</Checkbox>
                          <Checkbox value="TU">Mar</Checkbox>
                          <Checkbox value="WE">MiiÂ©</Checkbox>
                          <Checkbox value="TH">Jue</Checkbox>
                          <Checkbox value="FR">Vie</Checkbox>
                          <Checkbox value="SA">SiÂ¡b</Checkbox>
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
                            onChange={(e) => setUntilDate(e.target.value)}
                          />
                        </TextField>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={() => state.close()}>
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
                {mode === "create" ? "Guardar SesiiÂ³n" : "Actualizar SesiiÂ³n"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
