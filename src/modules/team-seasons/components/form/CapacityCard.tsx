import {
  Card,
  FieldError,
  Input,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  maxMembers: number | null;
  setMaxMembers: Dispatch<SetStateAction<number | null>>;
  minMembers: number | null;
  setMinMembers: Dispatch<SetStateAction<number | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}

export const CapacityCard = ({
  maxMembers,
  setMaxMembers,
  minMembers,
  setMinMembers,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <Card className="lg:p-8 shadow-[0px_12px_32px_rgba(25,28,29,0.06)] relative overflow-hidden border border-l-4 border-l-accent">
      <Card.Header className="flex flex-row items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
          <HugeiconsIcon icon={UserGroupIcon} className="text-accent" />
        </div>
        <Card.Title className="font-headline font-bold text-lg">
          Capacidad de Cupos
        </Card.Title>
      </Card.Header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TextField
          isRequired
          variant="secondary"
          className="w-full"
          name="maxMemebers"
          type="text"
          isInvalid={!!errors.maxYear || undefined}
        >
          <Label>Max. Miembros</Label>
          <Input
            min={2}
            placeholder="12"
            type="number"
            value={maxMembers || ""}
            onChange={(e) => {
              setMaxMembers(Number(e.target.value));
              handleRemoveError("maxYear");
            }}
          />
          <FieldError children={errors.maxYear && <> {errors.maxYear}</>} />
        </TextField>
        <TextField
          isRequired
          variant="secondary"
          className="w-full"
          name="minMembers"
          type="text"
          isInvalid={!!errors.minYear || undefined}
        >
          <Label>Min. Miembros</Label>
          <Input
            min={2}
            placeholder="12"
            type="number"
            value={minMembers || ""}
            onChange={(e) => {
              setMinMembers(Number(e.target.value));
              handleRemoveError("minYear");
            }}
          />
          <FieldError children={errors.minYear && <> {errors.minYear}</>} />
        </TextField>
      </div>
    </Card>
  );
};
