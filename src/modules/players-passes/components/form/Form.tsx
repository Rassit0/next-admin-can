"use client";
import {
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Surface,
  TextField,
  toast,
  Select,
  TextArea,
  ProgressCircle,
} from "@heroui/react";
import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import {
  IPlayerPass,
  IPlayer,
  PlayerPassOriginType,
  PlayerPassStatus,
  PostPlayerPassInterface,
  addPlayerPass,
  IPlayerPassActiveOptions,
  IDisciplineOptions,
  IClubOptionsByDiscipline,
  getClubOptionsByDisciplineOptions,
  getTeamsByClubOptions,
  ITeamsByClubOptions,
  getActivePassesByPlayerByDisciplineOptions,
} from "@/modules/players-passes";
import { useEffect, useState } from "react";
import { SelectClub } from "./SelectClub";
import { SelectTeam } from "./SelectTeam";
import { SelectDiscipline } from "./SelectDiscipline";
import { Origin } from "./Origin";

interface Props {
  playerPass?: IPlayerPass;
  player: IPlayer;
  disciplineOptions: IDisciplineOptions[];
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormPlayerPass = ({
  playerPass,
  player,
  disciplineOptions,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);
  //========== FORM ==============
  // Solo si es pase INTERNO
  const [previousTeamId, setPreviousTeamId] = useState(
    playerPass?.previousTeam?.id || null,
  );
  // Solo si es pase EXTERNO
  const [externalPreviousTeamName, setExternalPreviousTeamName] = useState(
    playerPass?.externalPreviousTeamName || null,
  );
  // Obligatorio
  const [currentTeamId, setCurrentTeamId] = useState(
    playerPass?.currentTeam.id || null,
  );
  const [originType, setOriginType] = useState<PlayerPassOriginType>(
    playerPass?.originType || "INTERNAL",
  );

  const [startDate, setStartDate] = useState<DateValue | null>(
    playerPass?.startDate
      ? parseDate(
          `${playerPass.startDate.getFullYear()}-${(playerPass.startDate.getMonth() + 1).toString().padStart(2, "0")}-${playerPass.startDate.getDate().toString().padStart(2, "0")}`,
        )
      : null,
  );
  const [status, setStatus] = useState<PlayerPassStatus>(
    playerPass?.status || "ACTIVE",
  );
  const [notes, setNotes] = useState(playerPass?.notes || null);

  //============== DISCLOSURE =============================
  const [expandedKeys, setExpandedKeys] = useState(
    new Set<string | number>([]),
  );

  // ============== FIN FORM =============================

  // UseState para opciones
  const [currentPassId, setCurrentPassId] = useState<string | null>(null);
  const [disciplineId, setDisciplineId] = useState<string | null>(null);
  const [previousClubId, setPreviousClubId] = useState<string | null>(null);
  const [currentClubId, setCurrentClubId] = useState<string | null>(null);
  const [clubsOptions, setClubsOptions] = useState<IClubOptionsByDiscipline[]>(
    [],
  );
  const [passOptions, setPassOptions] = useState<IPlayerPassActiveOptions[]>(
    [],
  );
  const [previousTeamsOptions, setPreviousTeamsOptions] = useState<
    ITeamsByClubOptions[]
  >([]);
  const [currentTeamsOptions, setCurrentTeamsOptions] = useState<
    ITeamsByClubOptions[]
  >([]);

  const loadPassess = async () => {
    if (!disciplineId) {
      return;
    }
    setIsOptionsLoading(true);
    const res = await getActivePassesByPlayerByDisciplineOptions(
      player.id,
      disciplineId,
    );
    setIsOptionsLoading(false);

    if (res.error) {
      toast.danger(res.message);
      return;
    }

    setPassOptions(res.data.data);
  };

  // Cargar los clubes en funcion de la disciplina
  const loadClubs = async () => {
    if (!disciplineId) {
      return;
    }
    setIsOptionsLoading(true);
    const res = await getClubOptionsByDisciplineOptions(disciplineId);
    setIsOptionsLoading(false);
    if (res.error) {
      toast.danger(res.message);
      return;
    }

    setClubsOptions(res.data.data);
  };

  // Cargar los equipos previos en funcion de el club previo
  const loadPreviousTeams = async () => {
    if (!previousClubId) {
      return;
    }
    setIsOptionsLoading(true);
    const res = await getTeamsByClubOptions(
      previousClubId,
      player.person.gender,
    );
    setIsOptionsLoading(false);

    if (res.error) {
      toast.danger(res.message);
      return;
    }

    setPreviousTeamsOptions(res.data.data);
  };

  // Cargar los equipos actuales en funcion de el club actual
  const loadCurrentTeams = async () => {
    if (!currentClubId) {
      return;
    }
    setIsOptionsLoading(true);
    const res = await getTeamsByClubOptions(
      currentClubId,
      player.person.gender,
    );
    setIsOptionsLoading(false);

    if (res.error) {
      toast.danger(res.message);
      return;
    }

    setCurrentTeamsOptions(res.data.data);
  };

  useEffect(() => {
    setCurrentPassId(null);
    setPreviousClubId(null);
    setPreviousTeamId(null);
    setCurrentClubId(null);
    setCurrentTeamId(null);
    loadClubs();
    loadPreviousTeams();
    loadPassess();
  }, [disciplineId]);

  useEffect(() => {
    if (currentPassId) {
      const currentPass = passOptions.find((pass) => pass.id === currentPassId);
      if (currentPass) {
        setPreviousTeamId(currentPass.currentTeam.id);
        setPreviousClubId(currentPass.currentTeam.club.id);
      }
    }
  }, [currentPassId]);

  useEffect(() => {
    setCurrentPassId(null);
    setPreviousClubId(null);
    setPreviousTeamId(null);
    setCurrentClubId(null);
    setCurrentTeamId(null);
    setStartDate(null);
    setStatus("ACTIVE");
    setNotes(null);
    setExternalPreviousTeamName(null);
  }, [expandedKeys]);

  useEffect(() => {
    if (originType === "INTERNAL") {
      setCurrentClubId(previousClubId);
    }
    if (currentPassId) {
      return;
    }
    setPreviousTeamId(null);
    loadPreviousTeams();
  }, [previousClubId]);

  useEffect(() => {
    setCurrentTeamId(null);
    loadCurrentTeams();
  }, [currentClubId]);

  useEffect(() => {
    setCurrentClubId(null);
    if (currentPassId) return;
    setCurrentTeamId(null);
    setPreviousClubId(null);
    setPreviousTeamId(null);
    setExternalPreviousTeamName(null);
  }, [originType]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRemoveError = (fieldName: string) => {
    // Limpiar solo el error de este campo específico
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("entro");
    e.preventDefault();
    e.stopPropagation();
    
    // Evitar que el submit de un formulario anidado dispare este submit
    if ((e.target as HTMLFormElement).id !== formId) {
      return;
    }
    const newErrors: Record<string, string> = {};
    if (originType === "INTERNAL" && !previousTeamId) {
      newErrors.previousTeamId = "Debe seleccionar un equipo anterior";
    }
    if (
      originType === "EXTERNAL" &&
      !externalPreviousTeamName &&
      !currentPassId
    ) {
      newErrors.externalPreviousTeamName = "Debe ingresar un equipo anterior";
    }
    if (!currentTeamId) {
      newErrors.currentTeamId = "Debe seleccionar un equipo actual";
    }
    if (!startDate) {
      newErrors.startDate = "Debe ingresar una fecha de inicio";
    }
    if (!status) {
      newErrors.status = "Debe ingresar un estado";
    }
    console.log(newErrors);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const errorDescription = Object.entries(newErrors)
        .map(([field, messages]) => {
          const msgList = Array.isArray(messages)
            ? messages.join(", ")
            : messages;
          return `${field}: ${msgList}`;
        })
        .join("\n");
      toast.danger("Error al guardar el pase", {
        description: errorDescription,
      });
      return;
    }
    setIsLoading?.(true);
    let res;
    const data: PostPlayerPassInterface = {
      playerId: player.id,
      previousTeamId: previousTeamId || undefined,
      externalPreviousTeamName: externalPreviousTeamName || undefined,
      currentTeamId: currentTeamId!,
      originType,
      startDate: startDate!.toDate(getLocalTimeZone()),
      status,
      notes,
    };
    if (playerPass) {
      // res = await editPerson({ id: player.id, data });
      return;
    } else {
      res = await addPlayerPass({
        data,
      });
    }
    setIsLoading?.(false);
    if (res.error) {
      let errorDescription = res.message;

      if (res.errors) {
        // Convertimos el objeto { type: ["msg"] } en una lista de strings limpia
        errorDescription = Object.entries(res.errors)
          .map(([field, messages]) => {
            const msgList = Array.isArray(messages)
              ? messages.join(", ")
              : messages;
            return `${field}: ${msgList}`;
          })
          .join("\n"); // Los separamos por saltos de línea para el toast
      }

      // 2. Pasamos la descripción formateada al componente de notificaciones
      toast.danger(res.message, {
        description: errorDescription,
      });
      if (res.errors) {
        setErrors(res.errors);
      }
      return;
    }
    toast.success(res.message, {
      description: player
        ? "El pase del jugador se ha editado exitosamente"
        : "El pase del jugador se ha agregado exitosamente",
    });
    onSubmited?.();
  };
  return (
    <Surface variant="transparent">
      <Form
        id={formId}
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4"
      >
        {/* <!-- Basic Information: Bento Layout --> */}
        <div className="flex flex-col gap-8 w-full">
          {/* Formulario (Grid optimizado) */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="col-span-full gap-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">1. DISCIPLINA</h2>
                </div>
                <SelectDiscipline
                  disciplineOptions={disciplineOptions}
                  disciplineId={disciplineId}
                  setDisciplineId={setDisciplineId}
                  errors={errors}
                  handleRemoveError={handleRemoveError}
                />
              </div>

              {disciplineId && (
                <div className="col-span-full gap-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      2. MODALIDAD / ORIGEN DEL PASE
                    </h2>
                  </div>
                  <Origin
                    expandedKeys={expandedKeys}
                    setExpandedKeys={setExpandedKeys}
                    activePassesOptions={passOptions}
                    currentPassId={currentPassId}
                    setCurrentPassId={setCurrentPassId}
                    originType={originType}
                    setOriginType={setOriginType}
                    clubsOptions={clubsOptions}
                    previousClubId={previousClubId}
                    setPreviousClubId={setPreviousClubId}
                    previousTeamId={previousTeamId}
                    setPreviousTeamId={setPreviousTeamId}
                    externalPreviousTeamName={externalPreviousTeamName}
                    setExternalPreviousTeamName={setExternalPreviousTeamName}
                    previousTeamsOptions={previousTeamsOptions}
                    errors={errors}
                    handleRemoveError={handleRemoveError}
                  />
                </div>
              )}

              {(previousTeamId !== null ||
                externalPreviousTeamName !== null ||
                originType === "FREE_AGENT" ||
                originType === "OWN") && (
                <div className="col-span-full gap-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      3. CONFIGURACIÓN DESTINO
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
                    <>
                      <SelectClub
                        label="CLUB DESTINO"
                        // isDisabled={
                        //   previousTeamId === null ||
                        //   externalPreviousTeamName === null
                        // }
                        clubOptions={clubsOptions.filter(
                          (club) =>
                            (originType === "INTERNAL" &&
                              club.id === previousClubId) ||
                            (originType === "EXTERNAL" &&
                              club.id !== previousClubId) ||
                            originType === "FREE_AGENT" ||
                            originType === "OWN",
                        )}
                        clubId={currentClubId}
                        setClubId={setCurrentClubId}
                        errors={errors}
                        handleRemoveError={handleRemoveError}
                      />
                      {currentTeamsOptions.filter(
                        (team) =>
                          (originType !== "FREE_AGENT" &&
                            team.id !== previousTeamId) ||
                          originType === "FREE_AGENT",
                      ).length > 0 ? (
                        <SelectTeam
                          label="EQUIPO DESTINO"
                          teamsOptions={currentTeamsOptions.filter(
                            (team) =>
                              (originType !== "FREE_AGENT" &&
                                team.id !== previousTeamId) ||
                              originType === "FREE_AGENT" ||
                              originType === "OWN",
                          )}
                          currentTeamId={currentTeamId}
                          setCurrentTeamId={setCurrentTeamId}
                          errors={errors}
                          handleRemoveError={handleRemoveError}
                        />
                      ) : (
                        currentClubId &&
                        (isOptionsLoading ? (
                          <ProgressCircle isIndeterminate aria-label="Loading">
                            <ProgressCircle.Track>
                              <ProgressCircle.TrackCircle />
                              <ProgressCircle.FillCircle />
                            </ProgressCircle.Track>
                          </ProgressCircle>
                        ) : (
                          <span className="text-red-500 col-span-full">
                            No se encontraron equipos disponibles para el club
                            seleccionado
                          </span>
                        ))
                      )}
                    </>

                    {/* Fecha de NadocumentNumbermiento */}
                    <DatePicker
                      className="col-span-full"
                      isRequired
                      isInvalid={!!errors.startDate || undefined}
                      name="startDate"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e);
                        handleRemoveError("startDate");
                      }}
                    >
                      <Label>Fecha de Inicio</Label>
                      <DateField.Group fullWidth variant="secondary">
                        <DateField.Input>
                          {(segment) => <DateField.Segment segment={segment} />}
                        </DateField.Input>
                        <DateField.Suffix>
                          <DatePicker.Trigger>
                            <DatePicker.TriggerIndicator />
                          </DatePicker.Trigger>
                        </DateField.Suffix>
                      </DateField.Group>
                      <FieldError
                        children={errors.startDate && <> {errors.startDate}</>}
                      />
                      <DatePicker.Popover>
                        <Calendar aria-label="Event date">
                          <Calendar.Header>
                            <Calendar.YearPickerTrigger>
                              <Calendar.YearPickerTriggerHeading />
                              <Calendar.YearPickerTriggerIndicator />
                            </Calendar.YearPickerTrigger>
                            <Calendar.NavButton slot="previous" />
                            <Calendar.NavButton slot="next" />
                          </Calendar.Header>
                          <Calendar.Grid>
                            <Calendar.GridHeader>
                              {(day) => (
                                <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                              )}
                            </Calendar.GridHeader>
                            <Calendar.GridBody>
                              {(date) => <Calendar.Cell date={date} />}
                            </Calendar.GridBody>
                          </Calendar.Grid>
                          <Calendar.YearPickerGrid>
                            <Calendar.YearPickerGridBody>
                              {({ year }) => (
                                <Calendar.YearPickerCell year={year} />
                              )}
                            </Calendar.YearPickerGridBody>
                          </Calendar.YearPickerGrid>
                        </Calendar>
                      </DatePicker.Popover>
                    </DatePicker>

                    {/* Notas */}
                    <TextField
                      isRequired
                      className="w-full col-span-full"
                      name="notes"
                      type="text"
                      isInvalid={!!errors.notes || undefined}
                      variant="secondary"
                      value={notes || ""}
                      onChange={(e) => {
                        setNotes(e || null);
                        handleRemoveError("notes");
                      }}
                    >
                      <Label>Notas</Label>
                      <TextArea placeholder="Nota..." />
                      <FieldError
                        children={errors.notes && <> {errors.notes}</>}
                      />
                    </TextField>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Form>
    </Surface>
  );
};
