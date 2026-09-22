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
  Alert,
  CloseButton,
  CheckboxGroup,
  Checkbox,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { createGeneralEvent } from "../actions/create-general-event.action";
import { updateGeneralEvent } from "../actions/update-general-event.action";
import { getLocations, ILocation } from "@/modules/locations";
import { getTeamSeasons } from "@/modules/team-seasons";
import { getCourseSeasons } from "@/modules/course-seasons/actions/get";
import { getInstitutionContext } from "@/modules/organizations/actions/get-context";
import { buildCalendarRecurrenceRule } from "../utils/calendar-recurrence.utils";
import { ICourseSeason } from "@/modules/course-seasons/interfaces/course-season.interface";

interface GeneralEventInitialData {
  id: string;
  title?: string | null;
  description?: string | null;
  locationId?: string | null;
  startDate: string; // ISO 8601
  endDate: string;
  institutionId?: string | null;
  teamSeasonCategoryId?: string | null;
  courseSeasonId?: string | null;
  courseSeasonShiftId?: string | null;
  seriesId?: string | null;
  recurrenceRule?: string | null;
}

interface Props {
  state: {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    close: () => void;
  };
  mode?: "create" | "edit";
  initialData?: GeneralEventInitialData | null;
  onSuccess?: () => void;
}

type ContextType = "INSTITUTION" | "TEAM" | "SCHOOL";
type SchoolScope = "ALL" | "SHIFT";

export const GeneralEventFormModal = ({
  state,
  mode = "create",
  initialData,
  onSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [locations, setLocations] = useState<ILocation[]>([]);
  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; seasonName: string }[]>([]);
  const [courseSeasons, setCourseSeasons] = useState<ICourseSeason[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationId, setLocationId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [contextType, setContextType] = useState<ContextType>("INSTITUTION");
  const [schoolScope, setSchoolScope] = useState<SchoolScope>("ALL");

  const [institutionId, setInstitutionId] = useState("");
  const [teamSeasonCategoryId, setTeamSeasonCategoryId] = useState("");
  const [courseSeasonId, setCourseSeasonId] = useState("");
  const [courseSeasonShiftId, setCourseSeasonShiftId] = useState("");

  const [isRecurrent, setIsRecurrent] = useState(false);
  const [recurrenceDays, setRecurrenceDays] = useState<string[]>([]);
  const [untilDate, setUntilDate] = useState("");
  const [editScope, setEditScope] = useState<"single" | "following" | "all">("single");

  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [locsRes, instRes, seasonsRes, courseRes] = await Promise.all([
          getLocations({ per_page: "100" }),
          getInstitutionContext(),
          getTeamSeasons({ per_page: "100" }),
          getCourseSeasons({ per_page: "100" }),
        ]);

        if (!locsRes.error) setLocations(locsRes.data.data);
        if (!instRes.error && instRes.data) {
          setInstitutions([instRes.data]);
          if (!institutionId) {
            setInstitutionId(instRes.data.id);
          }
        }
        
        if (!seasonsRes.error) {
          const cats = seasonsRes.data.data.flatMap((ts) =>
            ts.categories.map((c) => ({
              id: c.id,
              name: c.category.name,
              seasonName: ts.season.name,
            }))
          );
          setCategories(cats);
        }

        if (!courseRes.error && courseRes.data) {
          setCourseSeasons(courseRes.data.data as ICourseSeason[]);
        }
      } catch (error) {
        toast.error("Error al cargar datos.");
      } finally {
        setLoadingData(false);
      }
    };
    if (state.isOpen) fetchData();
  }, [state.isOpen]);

  useEffect(() => {
    if (state.isOpen && initialData && mode === "edit") {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setLocationId(initialData.locationId || "");
      
      const toLocalDatetimeLocal = (iso: string) => {
        if (!iso) return "";
        const d = new Date(iso);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
      };
      
      setStartDate(toLocalDatetimeLocal(initialData.startDate));
      setEndDate(toLocalDatetimeLocal(initialData.endDate));

      if (initialData.institutionId) {
        setContextType("INSTITUTION");
        setInstitutionId(initialData.institutionId);
      } else if (initialData.teamSeasonCategoryId) {
        setContextType("TEAM");
        setTeamSeasonCategoryId(initialData.teamSeasonCategoryId);
      } else if (initialData.courseSeasonId) {
        setContextType("SCHOOL");
        setCourseSeasonId(initialData.courseSeasonId);
        if (initialData.courseSeasonShiftId) {
          setSchoolScope("SHIFT");
          setCourseSeasonShiftId(initialData.courseSeasonShiftId);
        } else {
          setSchoolScope("ALL");
        }
      }

      setIsRecurrent(!!initialData.recurrenceRule);
      setEditScope("single");
      setApiError(null);
    } else if (state.isOpen && mode === "create") {
      setTitle("");
      setDescription("");
      setLocationId("");
      setStartDate("");
      setEndDate("");
      setContextType("INSTITUTION");
      setTeamSeasonCategoryId("");
      setCourseSeasonId("");
      setCourseSeasonShiftId("");
      setIsRecurrent(false);
      setRecurrenceDays([]);
      setUntilDate("");
      setApiError(null);
    }
  }, [state.isOpen, initialData, mode]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setApiError(null);

    if (!startDate || !endDate) {
      setApiError("Las fechas son obligatorias.");
      return;
    }
    
    if (contextType === "TEAM" && !teamSeasonCategoryId) {
      setApiError("Debes seleccionar una categoría/equipo.");
      return;
    }
    if (contextType === "SCHOOL") {
      if (!courseSeasonId) {
        setApiError("Debes seleccionar una escuela.");
        return;
      }
      if (schoolScope === "SHIFT" && !courseSeasonShiftId) {
        setApiError("Debes seleccionar un turno.");
        return;
      }
    }

    setLoading(true);

    try {
      // Create local Date objects, then get ISO string which includes Z
      const startObj = new Date(startDate);
      const endObj = new Date(endDate);
      
      const payload: any = {
        title: title || undefined,
        description: description || undefined,
        locationId: locationId || null,
        startDate: startObj.toISOString(),
        endDate: endObj.toISOString(),
      };

      // Set contexts: enforce exactly one
      if (contextType === "INSTITUTION") {
        payload.institutionId = institutionId;
        payload.teamSeasonCategoryId = null;
        payload.courseSeasonId = null;
        payload.courseSeasonShiftId = null;
      } else if (contextType === "TEAM") {
        payload.institutionId = null;
        payload.teamSeasonCategoryId = teamSeasonCategoryId;
        payload.courseSeasonId = null;
        payload.courseSeasonShiftId = null;
      } else if (contextType === "SCHOOL") {
        payload.institutionId = null;
        payload.teamSeasonCategoryId = null;
        payload.courseSeasonId = courseSeasonId;
        payload.courseSeasonShiftId = schoolScope === "SHIFT" ? courseSeasonShiftId : null;
      }

      if (isRecurrent && mode === "create") {
        const rrule = buildCalendarRecurrenceRule(recurrenceDays, untilDate);
        if (rrule) {
          payload.recurrenceRule = rrule;
          payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
      }

      let res;
      if (mode === "create") {
        res = await createGeneralEvent(payload);
      } else {
        res = await updateGeneralEvent(initialData!.id, payload, editScope);
      }

      if (res.error) {
        setApiError(res.message);
      } else {
        toast.success(
          mode === "create"
            ? "Evento general creado con éxito"
            : "Evento general actualizado con éxito",
        );
        state.setOpen(false);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      setApiError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCourseSeason = courseSeasons.find(c => c.id === courseSeasonId);
  const availableShifts = selectedCourseSeason?.shifts || [];

  return (
    <Modal>
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen} />
      <Modal.Container placement="auto" scroll="inside">
        <Modal.Dialog className="sm:max-w-xl bg-background-tertiary">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading className="flex items-center gap-2 text-lg font-semibold">
              <HugeiconsIcon icon={mode === "create" ? Add01Icon : Edit02Icon} />
              {mode === "create" ? "Crear Evento General" : "Editar Evento General"}
            </Modal.Heading>
          </Modal.Header>
          <Modal.Body className="max-h-[70vh] p-4 md:p-6 overflow-y-auto">
            {apiError && (
              <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Error</Alert.Title>
                  <Alert.Description>{apiError}</Alert.Description>
                </Alert.Content>
                <CloseButton onPress={() => setApiError(null)} />
              </Alert>
            )}
            
            <TextField className="mb-4">
              <Label>Título (Opcional)</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Reunión Institucional" />
            </TextField>
            
            <TextField className="mb-4">
              <Label>Descripción (Opcional)</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </TextField>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <TextField>
                <Label>Inicio</Label>
                <Input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </TextField>
              <TextField>
                <Label>Fin</Label>
                <Input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </TextField>
            </div>

            <TextField className="mb-4">
              <Label>Locación (Opcional)</Label>
              <Select
                selectedKey={locationId || ""}
                onSelectionChange={(key) => setLocationId(key as string)}
              >
                <Select.Trigger />
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="" textValue="Sin locación">Sin locación</ListBox.Item>
                    {locations.map((loc) => (
                      <ListBox.Item id={loc.id} key={loc.id} textValue={loc.name}>
                        {loc.name}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </TextField>

            <div className="border-t my-4 pt-4">
              <h4 className="font-semibold mb-2">Contexto del Evento</h4>
              <TextField className="mb-4">
                <Label>Alcance</Label>
                <Select
                  selectedKey={contextType}
                  onSelectionChange={(key) => setContextType(key as ContextType)}
                >
                  <Select.Trigger />
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="INSTITUTION" textValue="Institucional">Institucional</ListBox.Item>
                      <ListBox.Item id="TEAM" textValue="Equipo / Categoría">Equipo / Categoría</ListBox.Item>
                      <ListBox.Item id="SCHOOL" textValue="Escuela / Temporada">Escuela / Temporada</ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </TextField>

              {contextType === "INSTITUTION" && (
                <TextField className="mb-4">
                  <Label>Institución</Label>
                  <Select
                    selectedKey={institutionId}
                    onSelectionChange={(key) => setInstitutionId(key as string)}
                  >
                    <Select.Trigger />
                    <Select.Popover>
                      <ListBox>
                        {institutions.map(inst => (
                          <ListBox.Item id={inst.id} key={inst.id} textValue={inst.name}>{inst.name}</ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </TextField>
              )}

              {contextType === "TEAM" && (
                <TextField className="mb-4">
                  <Label>Equipo / Categoría</Label>
                  <Select
                    selectedKey={teamSeasonCategoryId}
                    onSelectionChange={(key) => setTeamSeasonCategoryId(key as string)}
                  >
                    <Select.Trigger />
                    <Select.Popover>
                      <ListBox>
                        {categories.map(cat => (
                          <ListBox.Item id={cat.id} key={cat.id} textValue={`${cat.name} (${cat.seasonName})`}>
                            {cat.name} ({cat.seasonName})
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </TextField>
              )}

              {contextType === "SCHOOL" && (
                <>
                  <TextField className="mb-4">
                    <Label>Escuela / Temporada</Label>
                    <Select
                      selectedKey={courseSeasonId}
                      onSelectionChange={(key) => setCourseSeasonId(key as string)}
                    >
                      <Select.Trigger />
                      <Select.Popover>
                        <ListBox>
                          {courseSeasons.map(c => (
                            <ListBox.Item id={c.id} key={c.id} textValue={c.name}>{c.name}</ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </TextField>

                  <TextField className="mb-4">
                    <Label>Alcance en Escuela</Label>
                    <Select
                      selectedKey={schoolScope}
                      onSelectionChange={(key) => setSchoolScope(key as SchoolScope)}
                    >
                      <Select.Trigger />
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="ALL" textValue="Toda la escuela">Toda la escuela</ListBox.Item>
                          <ListBox.Item id="SHIFT" textValue="Un turno específico">Un turno específico</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </TextField>

                  {schoolScope === "SHIFT" && (
                    <TextField className="mb-4">
                      <Label>Turno Específico</Label>
                      <Select
                        selectedKey={courseSeasonShiftId}
                        onSelectionChange={(key) => setCourseSeasonShiftId(key as string)}
                      >
                        <Select.Trigger />
                        <Select.Popover>
                          <ListBox>
                            {availableShifts.map(s => (
                              <ListBox.Item id={s.id} key={s.id} textValue={s.shift?.name || "Turno"}>
                                {s.shift?.name || "Turno"}
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </TextField>
                  )}
                </>
              )}
            </div>

            {mode === "create" && (
              <div className="border-t pt-4 mb-4">
                <Checkbox
                  isSelected={isRecurrent}
                  onChange={(checked) => setIsRecurrent(checked)}
                  className="mb-2"
                >
                  Evento Recurrente
                </Checkbox>

                {isRecurrent && (
                  <div className="ml-6 space-y-4">
                    <CheckboxGroup
                      value={recurrenceDays}
                      onChange={setRecurrenceDays}
                      className="flex flex-row flex-wrap gap-2"
                    >
                      <Checkbox value="MO">Lu</Checkbox>
                      <Checkbox value="TU">Ma</Checkbox>
                      <Checkbox value="WE">Mi</Checkbox>
                      <Checkbox value="TH">Ju</Checkbox>
                      <Checkbox value="FR">Vi</Checkbox>
                      <Checkbox value="SA">Sa</Checkbox>
                      <Checkbox value="SU">Do</Checkbox>
                    </CheckboxGroup>

                    <TextField>
                      <Label>Repetir hasta (inclusive)</Label>
                      <Input
                        type="date"
                        value={untilDate}
                        onChange={(e) => setUntilDate(e.target.value)}
                      />
                    </TextField>
                  </div>
                )}
              </div>
            )}

            {mode === "edit" && initialData?.seriesId && (
              <div className="border-t pt-4 mb-4">
                <h4 className="font-semibold mb-2">Este evento pertenece a una serie</h4>
                <TextField>
                  <Label>Aplicar cambios a:</Label>
                  <Select
                    selectedKey={editScope}
                    onSelectionChange={(key) => setEditScope(key as any)}
                  >
                    <Select.Trigger />
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item id="single" textValue="Solo este evento">
                          Solo este evento
                        </ListBox.Item>
                        <ListBox.Item id="following" textValue="Este y los siguientes">
                          Este y los siguientes
                        </ListBox.Item>
                        <ListBox.Item id="all" textValue="Toda la serie">
                          Toda la serie
                        </ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </TextField>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onPress={() => state.setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onPress={() => handleSubmit()}
              isPending={loading}
              isDisabled={loadingData}
            >
              Guardar
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  );
};
