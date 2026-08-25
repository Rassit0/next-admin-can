import { Dispatch, SetStateAction } from "react";
import {
  Card,
  FieldError,
  Label,
  TextArea,
  TextField,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar04Icon } from "@hugeicons/core-free-icons";
import { ISeasonOption } from "@/modules/team-seasons";
import { SelectSeason } from "./SelectSeason";

interface Props {
  seasonsOptions: ISeasonOption[];
  seasonId: string | null;
  setSeasonId: Dispatch<SetStateAction<string | null>>;
  description: string | null;
  setDescription: Dispatch<SetStateAction<string | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
  isStructuralDisabled?: boolean;
}

export const BasicInfoCard = ({
  seasonsOptions,
  seasonId,
  setSeasonId,
  description,
  setDescription,
  errors,
  handleRemoveError,
  isStructuralDisabled = false,
}: Props) => {
  return (
    <Card className="lg:p-8 shadow-[0px_12px_32px_rgba(25,28,29,0.06)]  border border-l-4 border-l-accent">
      <Card.Header className="flex flex-row items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
          <HugeiconsIcon icon={Calendar04Icon} className="text-accent" />
        </div>
        <Card.Title className="font-headline font-bold text-lg">
          Información Básica
        </Card.Title>
      </Card.Header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectSeason
          label="Temporada"
          seasonsOptions={seasonsOptions}
          seasonId={seasonId}
          setSeasonId={setSeasonId}
          errors={errors}
          handleRemoveError={handleRemoveError}
          isRequired
          isDisabled={isStructuralDisabled}
        />
        <TextField
          className="w-full col-span-full"
          name="description"
          isInvalid={!!errors.description || undefined}
        >
          <Label>Descripción</Label>
          <TextArea
            variant="secondary"
            placeholder="Ingrese la descripción de la oferta"
            rows={4}
            value={description || ""}
            onChange={(e) => {
              setDescription(e.target.value || null);
              handleRemoveError("description");
            }}
          />
          <FieldError
            children={errors.description && <> {errors.description}</>}
          />
        </TextField>
      </div>
    </Card>
  );
};
