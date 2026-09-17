"use client";

import { useEffect, useState, useMemo } from "react";
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
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { createMatch } from "../actions/create-match.action";
import { updateMatch } from "../actions/update-match.action";
import { getTeamsOptions, ITeamOption } from "@/modules/teams";
import { getLocations } from "@/modules/locations";
import { ILocation } from "@/modules/locations/interfaces/location.interface";
import { getTeamSeasons } from "@/modules/team-seasons";

interface MatchInitialData {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  teamSeasonCategoryId: string;
  locationId?: string | null;
  startDate: string;
  endDate: string;
  type: string;
  homeScore?: number | null;
  awayScore?: number | null;
}

interface Props {
  state: {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    close: () => void;
  };
  mode?: "create" | "edit";
  initialData?: MatchInitialData | null;
  onSuccess?: () => void;
}

export const MatchFormModal = ({
  state,
  mode = "create",
  initialData,
  onSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [teams, setTeams] = useState<ITeamOption[]>([]);
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [categories, setCategories] = useState<
    {
      id: string;
      name: string;
      seasonName: string;
      gender: string;
      teamId: string;
    }[]
  >([]);

  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [teamSeasonCategoryId, setTeamSeasonCategoryId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("LEAGUE");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  const [apiError, setApiError] = useState<string | null>(null);

  // Filtro de disciplina
  const [disciplineFilter, setDisciplineFilter] = useState<string>("");

  // Memoize the derived arrays to prevent unnecessary recalculations
  const disciplines = useMemo(() => {
    const unique = new Map<string, string>();
    teams.forEach((t) => {
      if (t.club?.discipline?.name) {
        unique.set(t.club.discipline.name, t.club.discipline.name);
      }
    });
    return Array.from(unique.values()).sort();
  }, [teams]);

  const filteredTeams = useMemo(() => {
    if (!disciplineFilter) return [];
    return teams.filter(
      (t) => t.club?.discipline?.name === disciplineFilter
    );
  }, [teams, disciplineFilter]);

  const filteredCategories = useMemo(() => {
    if (!disciplineFilter) return [];
    
    let result = categories;

    result = result.filter((c) => {
      const team = teams.find((t) => t.id === c.teamId);
      return team?.club?.discipline?.name === disciplineFilter;
    });

    if (homeTeamId || awayTeamId) {
      result = result.filter(
        (c) => c.teamId === homeTeamId || c.teamId === awayTeamId
      );
    }

    return result;
  }, [categories, teams, disciplineFilter, homeTeamId, awayTeamId]);

  useEffect(() => {
    if (
      state.isOpen &&
      mode === "edit" &&
      initialData &&
      teams.length > 0 &&
      !disciplineFilter
    ) {
      const homeTeam = teams.find((t) => t.id === initialData.homeTeamId);
      if (homeTeam?.club?.discipline?.name) {
        setDisciplineFilter(homeTeam.club.discipline.name);
      }
    }
  }, [state.isOpen, mode, initialData, teams, disciplineFilter]);

  useEffect(() => {
    if (state.isOpen) {
      loadData();
      if (mode === "edit" && initialData) {
        setHomeTeamId(initialData.homeTeamId);
        setAwayTeamId(initialData.awayTeamId);
        setTeamSeasonCategoryId(initialData.teamSeasonCategoryId);
        setLocationId(initialData.locationId || "");
        setStartDate(initialData.startDate.slice(0, 16));
        setEndDate(initialData.endDate.slice(0, 16));
        setType(initialData.type);
        setHomeScore(
          initialData.homeScore !== null && initialData.homeScore !== undefined
            ? String(initialData.homeScore)
            : "",
        );
        setAwayScore(
          initialData.awayScore !== null && initialData.awayScore !== undefined
            ? String(initialData.awayScore)
            : "",
        );
      } else {
        resetForm();
      }
    }
  }, [state.isOpen, mode, initialData]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [teamsRes, locsRes, seasonsRes] = await Promise.all([
        getTeamsOptions(),
        getLocations({ per_page: "100" }),
        getTeamSeasons({ per_page: "100" }),
      ]);

      if (!teamsRes.error) setTeams(teamsRes.data);
      if (!locsRes.error) setLocations(locsRes.data.data);
      if (!seasonsRes.error) {
        const cats = seasonsRes.data.data.flatMap((ts) =>
          ts.categories.map((c) => ({
            id: c.id,
            name: c.category.name,
            gender: c.gender,
            seasonName: ts.season.name + " - " + ts.team.name,
            teamId: ts.team.id,
          })),
        );
        setCategories(cats);
      }
    } catch (e) {
      toast.error("Error cargando dependencias");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !homeTeamId ||
      !awayTeamId ||
      !teamSeasonCategoryId ||
      !startDate ||
      !endDate
    ) {
      setApiError("Por favor complete los campos obligatorios.");
      return;
    }

    if (homeTeamId === awayTeamId) {
      setApiError("El equipo local no puede ser igual al visitante.");
      return;
    }

    if (startDate > endDate) {
      setApiError("La fecha de fin no puede ser anterior a la de inicio.");
      return;
    }

    setLoading(true);
    setApiError(null);

    const payload = {
      teamSeasonCategoryId,
      homeTeamId,
      awayTeamId,
      locationId: locationId || null,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      type,
      homeScore: homeScore !== "" ? Number(homeScore) : null,
      awayScore: awayScore !== "" ? Number(awayScore) : null,
    };

    let res;
    if (mode === "create") {
      res = await createMatch(payload);
    } else {
      res = await updateMatch(initialData!.id, payload);
    }

    setLoading(false);

    if (res.error) {
      setApiError(res.message);
    } else {
      toast.success(
        mode === "create"
          ? "Partido creado con éxito"
          : "Partido actualizado con éxito",
      );
      resetForm();
      state.close();
      if (onSuccess) onSuccess();
    }
  };

  const resetForm = () => {
    setHomeTeamId("");
    setAwayTeamId("");
    setTeamSeasonCategoryId("");
    setLocationId("");
    setStartDate("");
    setEndDate("");
    setType("LEAGUE");
    setHomeScore("");
    setAwayScore("");
    setApiError(null);
    setDisciplineFilter("");
  };

  // UX Mejora: Indicar qué equipo corresponde a la categoría CAN
  const selectedCategory = categories.find(
    (c) => c.id === teamSeasonCategoryId,
  );
  const selectedCategoryTeamId = selectedCategory?.teamId;

  console.log("DEBUG STATE:", {
    homeTeamId,
    typeOfHomeTeamId: typeof homeTeamId,
    awayTeamId,
    teamSeasonCategoryId,
    selectedCategoryTeamId,
  });

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={state.isOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          state.setOpen(open);
        }}
      >
        <Modal.Container placement="auto" scroll="inside">
          <Modal.Dialog className="sm:max-w-xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {mode === "create" ? "Registrar Partido" : "Editar Partido"}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-4 md:p-6 overflow-y-auto">
              <div className="flex flex-col gap-5">
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

                <Select
                  variant="secondary"
                  value={disciplineFilter}
                  onChange={(value) => {
                    setDisciplineFilter(value as string);
                    // Reiniciar selecciones si cambia la disciplina
                    setHomeTeamId("");
                    setAwayTeamId("");
                    setTeamSeasonCategoryId("");
                  }}
                  isDisabled={loadingData}
                >
                  <Label className="font-semibold text-sm text-primary">
                    Filtrar por Disciplina
                  </Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {disciplines.map((d) => (
                        <ListBox.Item key={d} id={d} textValue={d}>
                          {d}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    variant="secondary"
                    value={homeTeamId}
                    onChange={(value) => setHomeTeamId(value as string)}
                    isDisabled={loadingData || !disciplineFilter}
                  >
                    <Label className="font-semibold text-sm">
                      Equipo Local *
                    </Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox items={filteredTeams}>
                        {(t) => (
                          <ListBox.Item id={t.id} textValue={`${t.name} (${t.club?.name || ''})`}>
                            <div className="flex justify-between items-center w-full">
                              <span>
                                {t.name}{" "}
                                {t.club?.name && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    ({t.club.name} {t.club.discipline?.name ? `- ${t.club.discipline.name}` : ''})
                                  </span>
                                )}
                              </span>
                              {selectedCategoryTeamId === t.id && (
                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                  CAN
                                </span>
                              )}
                            </div>
                          </ListBox.Item>
                        )}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <Select
                    variant="secondary"
                    value={awayTeamId}
                    onChange={(value) => setAwayTeamId(value as string)}
                    isDisabled={loadingData || !disciplineFilter}
                  >
                    <Label className="font-semibold text-sm">
                      Equipo Visitante *
                    </Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox items={filteredTeams}>
                        {(t) => (
                          <ListBox.Item id={t.id} textValue={`${t.name} (${t.club?.name || ''})`}>
                            <div className="flex justify-between items-center w-full">
                              <span>
                                {t.name}{" "}
                                {t.club?.name && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    ({t.club.name} {t.club.discipline?.name ? `- ${t.club.discipline.name}` : ''})
                                  </span>
                                )}
                              </span>
                              {selectedCategoryTeamId === t.id && (
                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                  CAN
                                </span>
                              )}
                            </div>
                          </ListBox.Item>
                        )}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField>
                    <Label className="font-semibold text-sm">
                      Fecha Inicio *
                    </Label>
                    <Input
                      type="datetime-local"
                      variant="secondary"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </TextField>

                  <TextField>
                    <Label className="font-semibold text-sm">Fecha Fin *</Label>
                    <Input
                      type="datetime-local"
                      variant="secondary"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </TextField>
                </div>

                <Select
                  variant="secondary"
                  value={teamSeasonCategoryId}
                  onChange={(value) => setTeamSeasonCategoryId(value as string)}
                  isDisabled={loadingData || !disciplineFilter}
                >
                  <Label className="font-semibold text-sm">
                    Categoría de Temporada CAN *
                  </Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox items={filteredCategories}>
                      {(c) => (
                        <ListBox.Item
                          id={c.id}
                          textValue={`${c.name} (${c.gender})`}
                        >
                          <div className="flex flex-col">
                            <span>
                              {c.name} ({c.gender})
                            </span>
                            <span className="text-xs text-muted">
                              {c.seasonName}
                            </span>
                          </div>
                        </ListBox.Item>
                      )}
                    </ListBox>
                  </Select.Popover>
                </Select>

                {selectedCategoryTeamId &&
                  selectedCategoryTeamId !== homeTeamId &&
                  selectedCategoryTeamId !== awayTeamId && (
                    <p className="text-xs text-danger -mt-3">
                      El equipo de la categoría CAN seleccionada debe participar
                      como Local o Visitante.
                    </p>
                  )}

                <Select
                  variant="secondary"
                  value={locationId}
                  onChange={(value) => setLocationId(value as string)}
                  isDisabled={loadingData}
                >
                  <Label className="font-semibold text-sm">Ubicación</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
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

                <Select
                  variant="secondary"
                  value={type}
                  onChange={(value) => setType(value as string)}
                >
                  <Label className="font-semibold text-sm">
                    Tipo de Partido *
                  </Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="FRIENDLY" textValue="Amistoso">
                        Amistoso
                      </ListBox.Item>
                      <ListBox.Item id="LEAGUE" textValue="Liga">
                        Liga
                      </ListBox.Item>
                      <ListBox.Item id="TOURNAMENT" textValue="Torneo">
                        Torneo
                      </ListBox.Item>
                      <ListBox.Item id="CUP" textValue="Copa">
                        Copa
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField>
                    <Label className="font-semibold text-sm">
                      Puntuación Local
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      variant="secondary"
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                    />
                  </TextField>
                  <TextField>
                    <Label className="font-semibold text-sm">
                      Puntuación Visitante
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      variant="secondary"
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                    />
                  </TextField>
                </div>
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
                  (selectedCategoryTeamId !== undefined &&
                    selectedCategoryTeamId !== homeTeamId &&
                    selectedCategoryTeamId !== awayTeamId)
                }
              >
                <HugeiconsIcon
                  icon={mode === "create" ? Add01Icon : Edit02Icon}
                  size={18}
                />
                {mode === "create" ? "Guardar Partido" : "Actualizar Partido"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
