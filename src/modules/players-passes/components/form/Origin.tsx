import { TTypeOriginPass, TypeOriginPass } from "./TypeOriginPass";
import {
  IClubOptionsByDiscipline,
  IPlayerPassActiveOptions,
  ITeamsByClubOptions,
  PlayerPassOriginType,
} from "@/modules/players-passes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  FieldError,
  Input,
  Label,
  Radio,
  RadioGroup,
  Separator,
  TextField,
} from "@heroui/react";
import { SelectCurrentPass } from "./SelectCurrentPass";
import { SelectDiscipline } from "./SelectDiscipline";
import { SelectClub } from "./SelectClub";
import { SelectTeam } from "./SelectTeam";
import {
  ArrowDataTransferDiagonalIcon,
  ArrowDataTransferHorizontalIcon,
  GeometricShapes01Icon,
  Home01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";

interface Props {
  activePassesOptions: IPlayerPassActiveOptions[];
  originType: PlayerPassOriginType;
  setOriginType: Dispatch<SetStateAction<PlayerPassOriginType>>;
  expandedKeys: Set<string | number>;
  setExpandedKeys: Dispatch<SetStateAction<Set<string | number>>>;
  currentPassId: string | null;
  setCurrentPassId: Dispatch<SetStateAction<string | null>>;
  clubsOptions: IClubOptionsByDiscipline[];
  previousClubId: string | null;
  setPreviousClubId: Dispatch<SetStateAction<string | null>>;
  previousTeamsOptions: ITeamsByClubOptions[];
  previousTeamId: string | null;
  setPreviousTeamId: Dispatch<SetStateAction<string | null>>;
  externalPreviousTeamName: string | null;
  setExternalPreviousTeamName: Dispatch<SetStateAction<string | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}
export const Origin = ({
  activePassesOptions,
  originType,
  setOriginType,
  expandedKeys,
  setExpandedKeys,
  currentPassId,
  setCurrentPassId,
  clubsOptions,
  previousClubId,
  setPreviousClubId,
  previousTeamId,
  setPreviousTeamId,
  externalPreviousTeamName,
  setExternalPreviousTeamName,
  previousTeamsOptions,
  errors,
  handleRemoveError,
}: Props) => {
  const [originTeam, setOriginTeam] = useState<string>("selected");

  useEffect(() => {
    setPreviousClubId(null);
    setPreviousTeamId(null);
    setExternalPreviousTeamName(null);
  }, [originTeam]);

  const freeAgentOption = {
    value: "FREE_AGENT",
    icon: UserCircleIcon,
    label: "Agente Libre",
    description: "El jugador no pertenece a ningún club.",
  } satisfies TTypeOriginPass;

  const ownOption = {
    value: "OWN",
    icon: Home01Icon,
    label: "Propio",
    description: "El jugador es propio del club.",
  } satisfies TTypeOriginPass;

  const typeActivities: TTypeOriginPass[] = [
    {
      value: "INTERNAL",
      icon: ArrowDataTransferHorizontalIcon,
      label: "Interno",
      description: "El jugador viene de un club interno.",
    },
    {
      value: "EXTERNAL",
      icon: ArrowDataTransferDiagonalIcon,
      label: "Externo",
      description: "El jugador viene de un club externo.",
    },
    ...(activePassesOptions.length === 0 ? [freeAgentOption, ownOption] : []),
  ];

  return (
    <div className="flex flex-col gap-6 p-2">
      <TypeOriginPass
        tipeActivities={typeActivities}
        originType={originType}
        setOriginType={setOriginType}
        errors={errors}
        handleRemoveError={handleRemoveError}
      />
      {activePassesOptions.length > 0 ? (
        <SelectCurrentPass
          isRequired={expandedKeys.has("1")}
          activePassesOptions={activePassesOptions}
          currentPassId={currentPassId}
          setCurrentPassId={setCurrentPassId}
          errors={errors}
          handleRemoveError={handleRemoveError}
        />
      ) : (
        originType === "EXTERNAL" && (
          <RadioGroup
            name="plan-controlled"
            value={originTeam}
            onChange={setOriginTeam}
          >
            <Radio value="selected">
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content>
                <Label>Seleccionar Equipo Registrado</Label>
              </Radio.Content>
            </Radio>
            <Radio value="manual">
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <Radio.Content>
                <Label>Ingresar Equipo Manualmente</Label>
              </Radio.Content>
            </Radio>
          </RadioGroup>
        )
      )}

      {originType !== "FREE_AGENT" &&
        originType !== "OWN" &&
        activePassesOptions.length === 0 &&
        (originTeam === "selected" || originType === "INTERNAL" ? (
          <>
            <SelectClub
              isRequired={expandedKeys.has("2")}
              label="CLUB ANTERIOR"
              clubOptions={clubsOptions}
              clubId={previousClubId}
              setClubId={setPreviousClubId}
              errors={errors}
              handleRemoveError={handleRemoveError}
            />
            <SelectTeam
              isRequired={expandedKeys.has("2")}
              isDisabled={previousClubId === null || previousClubId === ""}
              label="EQUIPO ANTERIOR"
              teamsOptions={previousTeamsOptions}
              currentTeamId={previousTeamId}
              setCurrentTeamId={setPreviousTeamId}
              errors={errors}
              handleRemoveError={handleRemoveError}
            />
          </>
        ) : (
          <TextField
            isRequired
            className="w-full"
            name="externalPreviousTeamName"
            type="text"
            isInvalid={!!errors.nexternalPreviousTeamNameame || undefined}
          >
            <Label>NOMBRE DEL EQUIPO EXTERNO</Label>
            <Input
              variant="secondary"
              value={externalPreviousTeamName || ""}
              onChange={(e) => {
                setExternalPreviousTeamName(e.target.value || null);
                handleRemoveError("externalPreviousTeamName");
              }}
              placeholder="Ingrese el nombre del equipo"
            />
            <FieldError
              children={
                errors.externalPreviousTeamName && (
                  <> {errors.externalPreviousTeamName}</>
                )
              }
            />
          </TextField>
        ))}
    </div>
  );
};
