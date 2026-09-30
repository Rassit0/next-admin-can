"use client";

import { SelectOrCreatePerson } from "@/modules/persons";
import { SelectOrCreateCompany } from "@/modules/companies";
import { RadioGroup, Radio, Label } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";
import { IPersonOption } from "@/modules/persons";
import { ICompanyOption } from "@/modules/companies";

export type CounterpartyType = "PERSON" | "COMPANY";

interface Props {
  isRequired?: boolean;
  label: string;
  counterpartyType: CounterpartyType | null;
  setCounterpartyType: Dispatch<SetStateAction<CounterpartyType | null>>;
  personId: string | null;
  setPersonId: Dispatch<SetStateAction<string | null>>;
  companyId: string | null;
  setCompanyId: Dispatch<SetStateAction<string | null>>;
  setSelectedPerson?: Dispatch<SetStateAction<IPersonOption | null>>;
  setSelectedCompany?: Dispatch<SetStateAction<ICompanyOption | null>>;
  defaultPerson?: IPersonOption | null;
  defaultCompany?: ICompanyOption | null;
  errors?: Record<string, string>;
  handleRemoveError?: (fieldName: string) => void;
  allowNone?: boolean;
  isDisabled?: boolean;
}

export const CounterpartySelector = ({
  isRequired = true,
  label,
  counterpartyType,
  setCounterpartyType,
  personId,
  setPersonId,
  companyId,
  setCompanyId,
  setSelectedPerson,
  setSelectedCompany,
  defaultPerson,
  defaultCompany,
  errors,
  handleRemoveError,
  allowNone = false,
  isDisabled = false,
}: Props) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Label className="text-sm font-medium">{label}</Label>
      <RadioGroup
        value={counterpartyType || (allowNone ? "NONE" : "PERSON")}
        isDisabled={isDisabled}
        onChange={(val) => {
          const type = val as CounterpartyType | "NONE";
          setCounterpartyType(type === "NONE" ? null : type);
          if (type === "PERSON") {
            setCompanyId(null);
            setSelectedCompany?.(null);
          } else if (type === "COMPANY") {
            setPersonId(null);
            setSelectedPerson?.(null);
          } else {
            setPersonId(null);
            setSelectedPerson?.(null);
            setCompanyId(null);
            setSelectedCompany?.(null);
          }
        }}
        orientation="horizontal"
      >
        {allowNone && (
          <Radio value="NONE">
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              Ninguno
            </Radio.Content>
          </Radio>
        )}
        <Radio value="PERSON">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            Persona
          </Radio.Content>
        </Radio>
        <Radio value="COMPANY">
          <Radio.Content>
            <Radio.Control>
              <Radio.Indicator />
            </Radio.Control>
            Empresa / Entidad
          </Radio.Content>
        </Radio>
      </RadioGroup>

      {counterpartyType === "PERSON" && (
        <SelectOrCreatePerson
          isRequired={isRequired}
          isDisabled={isDisabled}
          label="Seleccionar Persona"
          personId={personId}
          setPersonId={setPersonId}
          setSelectedPerson={setSelectedPerson}
          defaultPerson={defaultPerson}
          errors={errors}
          handleRemoveError={handleRemoveError}
        />
      )}

      {counterpartyType === "COMPANY" && (
        <SelectOrCreateCompany
          isRequired={isRequired}
          isDisabled={isDisabled}
          label="Seleccionar Empresa"
          companyId={companyId}
          setCompanyId={setCompanyId}
          setSelectedCompany={setSelectedCompany}
          defaultCompany={defaultCompany}
          errors={errors}
          handleRemoveError={handleRemoveError}
        />
      )}
    </div>
  );
};
