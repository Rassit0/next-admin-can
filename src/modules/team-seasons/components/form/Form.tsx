"use client";
import { HeaderPage } from "@/ui";
import { BasicInfoCard } from "./BasicInfoCard";
import { CapacityCard } from "./CapacityCard";
import { DelayPoliciesCard } from "./DelayPoliciesCard";
import { FinancialStructureCard } from "./FinancialStructureCard";
import { ITeam } from "@/modules/teams";
import { useCallback, useRef, useState } from "react";

import { Alert, Button, Form, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  addTeamSeason,
  editTeamSeason,
  Gender,
  ICategoryOption,
  ISeasonOption,
  ITeamSeason,
  StatusTeamSeason,
  IPostTeamSeason,
  SeasonBillingType,
  BillingFrequency,
} from "@/modules/team-seasons";
import { STATUS_TEXT_MAP } from "../../constants/team-seasons.constants";

interface Props {
  formId: string;
  team: ITeam;
  teamSeason?: ITeamSeason;
  categoriesOptions: ICategoryOption[];
  seasonsOptions: ISeasonOption[];
  urlRedirect: string;
}

export const FormTeamSeason = ({
  formId,
  team,
  teamSeason,
  categoriesOptions,
  seasonsOptions,
  urlRedirect,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formRef = useRef<HTMLFormElement | null>(null);

  // form params
  const [description, setDescription] = useState<string | null>(
    teamSeason?.description || null,
  );
  const [maxMembers, setMaxMembers] = useState<number | null>(
    teamSeason?.maxMembers || null,
  );
  const [minMembers, setMinMembers] = useState<number | null>(
    teamSeason?.minMembers || null,
  );
  const [minBirthYear, setMinBirthYear] = useState<number | null>(
    teamSeason?.minBirthYear || null,
  );
  const [maxBirthYear, setMaxBirthYear] = useState<number | null>(
    teamSeason?.maxBirthYear || null,
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    teamSeason?.category.id || null,
  );
  const [seasonId, setSeasonId] = useState<string | null>(
    teamSeason?.season.id || null,
  );
  const [gender, setGender] = useState<Gender | null>(
    teamSeason?.gender || null,
  );
  const [billingDay, setBillingDay] = useState<number | null>(
    teamSeason?.billingConfig?.billingDay || null,
  );
  const [registrationFee, setRegistrationFee] = useState<string | null>(
    teamSeason?.billingConfig?.registrationFee || null,
  );
  const [recurringFee, setRecurringFee] = useState<string | null>(
    teamSeason?.billingConfig?.recurringFee || null,
  );
  const [seasonFee, setSeasonFee] = useState<string | null>(
    teamSeason?.billingConfig?.seasonFee || null,
  );
  const [billingType, setBillingType] = useState<SeasonBillingType>(
    teamSeason?.billingConfig?.billingType || "MONTHLY_ONLY",
  );
  const [billingFrequency, setBillingFrequency] = useState<BillingFrequency>(
    teamSeason?.billingConfig?.billingFrequency || "MONTHLY",
  );
  const [debtToleranceMonths, setDebtToleranceMonths] = useState<number | null>(
    teamSeason?.billingConfig?.debtToleranceMonths !== undefined
      ? teamSeason?.billingConfig?.debtToleranceMonths
      : null,
  );

  const [prorateFirstRecurringFee, setProrateFirstRecurringFee] =
    useState<boolean>(
      teamSeason?.billingConfig?.prorateFirstRecurringFee ?? true,
    );
  const [prorateLastRecurringFee, setProrateLastRecurringFee] =
    useState<boolean>(
      teamSeason?.billingConfig?.prorateLastRecurringFee ?? true,
    );
  const [prorateRegistrationFee, setProrateRegistrationFee] = useState<boolean>(
    teamSeason?.billingConfig?.prorateRegistrationFee ?? false,
  );
  const [prorateSeasonFee, setProrateSeasonFee] = useState<boolean>(
    teamSeason?.billingConfig?.prorateSeasonFee ?? false,
  );

  const [lateFeeEnabled, setLateFeeEnabled] = useState<boolean>(
    teamSeason?.billingConfig?.lateFeeEnabled === true ? true : false,
  );
  const [lateFeePerDay, setLateFeePerDay] = useState<string | null>(
    teamSeason?.billingConfig?.lateFeePerDay || null,
  );
  const [graceDays, setGraceDays] = useState<number | null>(
    teamSeason?.billingConfig?.graceDays !== undefined
      ? teamSeason?.billingConfig?.graceDays
      : null,
  );
  const [status, setStatus] = useState<StatusTeamSeason>(
    teamSeason?.status || "DRAFT",
  );
  // fin form params

  const isEditMode = !!teamSeason;
  const isStructuralDisabled = isEditMode && teamSeason.status === "ACTIVE";
  const isFinancialDisabled = isEditMode && teamSeason.status === "ACTIVE";

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRemoveError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const { [fieldName]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit", team.id);
    // setErrors({});
    const newErrors: Record<string, string> = {};
    if (maxMembers === null) {
      newErrors.maxMembers = "Debe ingresar el número máximo de miembros";
    }
    if (minMembers === null) {
      newErrors.minMembers = "Debe ingresar el número mínimo de miembros";
    }
    if (categoryId === null) {
      newErrors.categoryId = "Debe ingresar la categoría";
    }
    if (minBirthYear && maxBirthYear && minBirthYear > maxBirthYear) {
      newErrors.minBirthYear = "El año mínimo no puede ser mayor al máximo";
      newErrors.maxBirthYear = "El año máximo no puede ser menor al mínimo";
    }
    if (seasonId === null) {
      newErrors.seasonId = "Debe ingresar la temporada";
    }
    if (gender === null) {
      newErrors.gender = "Debe ingresar el género";
    }
    if (billingType !== "SINGLE_ONLY") {
      if (!recurringFee) {
        newErrors.recurringFee = "Debe ingresar el valor de la cuota mensual";
      }
      if (!registrationFee) {
        newErrors.registrationFee = "Debe ingresar el valor de la inscripción";
      }
    }
    if (
      (billingType === "SINGLE_ONLY" || billingType === "BOTH") &&
      seasonFee === null
    ) {
      newErrors.seasonFee =
        "Debe ingresar el valor para la tarifa de la temporada";
    }
    if (lateFeePerDay === null) {
      newErrors.lateFeePerDay = "Debe ingresar el valor de la multa por día";
    }
    console.log({ graceDays });
    if (graceDays === null) {
      newErrors.graceDays = "Debe ingresar el número de días de gracia";
    }
    if (debtToleranceMonths === null) {
      newErrors.debtToleranceMonths =
        "Debe ingresar el número de meses de tolerancia de deuda para la suspensión";
    }
    if (billingType !== "SINGLE_ONLY") {
      if (!billingFrequency) {
        newErrors.billingFrequency =
          "Debe ingresar la frecuencia de facturación";
      }

      if (billingDay === null) {
        newErrors.billingDay = "Debe ingresar el día de facturación";
      } else {
        if (
          billingFrequency === "MONTHLY" &&
          (billingDay < 1 || billingDay > 28)
        ) {
          newErrors.billingDay = "Para mensual, el día debe ser entre 1 y 28";
        } else if (
          billingFrequency === "WEEKLY" &&
          (billingDay < 1 || billingDay > 7)
        ) {
          newErrors.billingDay = "Para semanal, el día debe ser entre 1 y 7";
        } else if (
          billingFrequency === "BIWEEKLY" &&
          (billingDay < 1 || billingDay > 14)
        ) {
          newErrors.billingDay = "Para quincenal, el día debe ser entre 1 y 14";
        }
      }
    }
    if (status === null) {
      newErrors.status = "Debe ingresar el estado";
    }
    setErrors(newErrors);
    console.log(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    let res;
    const data: IPostTeamSeason = {
      description: description!,
      maxMembers: maxMembers!,
      minMembers: minMembers!,
      minBirthYear: minBirthYear,
      maxBirthYear: maxBirthYear,
      teamId: team.id,
      categoryId: categoryId!,
      seasonId: seasonId!,
      gender: gender!,
      billingConfig: {
        billingDay:
          billingType === "SINGLE_ONLY" || billingFrequency !== "MONTHLY"
            ? 1
            : billingDay!,
        registrationFee:
          billingType === "SINGLE_ONLY" ? null : registrationFee!,
        recurringFee: billingType === "SINGLE_ONLY" ? null : recurringFee!,
        seasonFee:
          billingType === "SINGLE_ONLY" || billingType === "BOTH"
            ? seasonFee!
            : null,
        billingType: billingType,
        billingFrequency:
          billingType === "SINGLE_ONLY" ? "SINGLE" : billingFrequency,
        debtToleranceMonths: debtToleranceMonths!,
        prorateFirstRecurringFee,
        prorateLastRecurringFee,
        prorateRegistrationFee,
        prorateSeasonFee,
        lateFeeEnabled,
        lateFeePerDay: lateFeeEnabled ? lateFeePerDay! : "0",
        graceDays: lateFeeEnabled ? graceDays! : 0,
      },
      status,
    };
    if (teamSeason) {
      res = await editTeamSeason({ id: teamSeason.id, data });
    } else {
      res = await addTeamSeason(data);
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
      description: res.message,
    });

    router.push(urlRedirect);
  };
  return (
    <>
      <Form
        id={formId}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {(isStructuralDisabled || isFinancialDisabled) && (
          <div className="lg:col-span-12 mb-2">
            <Alert status="warning">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>
                  Modo de Edición Restringido (Temporada Activa)
                </Alert.Title>
                <Alert.Description>
                  Esta temporada se encuentra actualmente{" "}
                  <strong>Activa</strong>. Por seguridad e integridad de los
                  registros financieros y de membresías, los datos estructurales
                  (Categoría, Temporada, Género) y la configuración base de
                  facturación están <strong>bloqueados</strong>. <br />
                  Aún puedes ajustar los <strong>montos de cobro</strong>{" "}
                  (Matrícula, Cuotas), cupos y límites de edades, pero estos
                  cambios afectarán{" "}
                  <strong>únicamente a las nuevas inscripciones</strong>.
                </Alert.Description>
              </Alert.Content>
            </Alert>
          </div>
        )}
        {/* <!-- Section 1: Información Básica & Capacidad --> */}
        <div className="lg:col-span-7 space-y-6">
          {/* <!-- Basic Info Card --> */}
          <BasicInfoCard
            categoriesOptions={categoriesOptions}
            seasonsOptions={seasonsOptions}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            seasonId={seasonId}
            setSeasonId={setSeasonId}
            gender={gender}
            setGender={setGender}
            description={description}
            setDescription={setDescription}
            minBirthYear={minBirthYear}
            setMinBirthYear={setMinBirthYear}
            maxBirthYear={maxBirthYear}
            setMaxBirthYear={setMaxBirthYear}
            errors={errors}
            handleRemoveError={handleRemoveError}
            isStructuralDisabled={isStructuralDisabled}
          />
          <DelayPoliciesCard
            billingFrequency={billingFrequency}
            lateFeePerDay={lateFeePerDay}
            setLateFeePerDay={setLateFeePerDay}
            graceDays={graceDays}
            setGraceDays={setGraceDays}
            debtToleranceMonths={debtToleranceMonths}
            setDebtToleranceMonths={setDebtToleranceMonths}
            lateFeeEnabled={lateFeeEnabled}
            setLateFeeEnabled={setLateFeeEnabled}
            errors={errors}
            handleRemoveError={handleRemoveError}
          />
        </div>
        {/* <!-- Section 2: Estructura Financiera --> */}
        <div className="lg:col-span-5 space-y-6">
          <FinancialStructureCard
            registrationFee={registrationFee}
            setRegistrationFee={setRegistrationFee}
            recurringFee={recurringFee}
            setRecurringFee={setRecurringFee}
            seasonFee={seasonFee}
            setSeasonFee={setSeasonFee}
            billingType={billingType}
            setBillingType={setBillingType}
            billingFrequency={billingFrequency}
            setBillingFrequency={setBillingFrequency}
            billingDay={billingDay}
            setBillingDay={setBillingDay}
            prorateFirstRecurringFee={prorateFirstRecurringFee}
            setProrateFirstRecurringFee={setProrateFirstRecurringFee}
            prorateLastRecurringFee={prorateLastRecurringFee}
            setProrateLastRecurringFee={setProrateLastRecurringFee}
            prorateRegistrationFee={prorateRegistrationFee}
            setProrateRegistrationFee={setProrateRegistrationFee}
            prorateSeasonFee={prorateSeasonFee}
            setProrateSeasonFee={setProrateSeasonFee}
            errors={errors}
            handleRemoveError={handleRemoveError}
            isFinancialDisabled={isFinancialDisabled}
          />
          {/* <!-- Capacity Card --> */}
          <CapacityCard
            maxMembers={maxMembers}
            setMaxMembers={setMaxMembers}
            minMembers={minMembers}
            setMinMembers={setMinMembers}
            errors={errors}
            handleRemoveError={handleRemoveError}
          />
        </div>
        {/* <!-- Section 3: Políticas de Mora (Full Width Bottom) --> */}
        <div className="lg:col-span-12"></div>
        {/* <!-- Section 4: Estado Final (Floating Sticky-ish bottom or separate block) --> */}
        <div className="lg:col-span-12 flex justify-end items-center gap-8 p-4 lg:p-8 bg-surface-container-low rounded-full">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-on-surface-variant">
              Estado de la Oferta:
            </span>
            <div className="flex p-1 bg-surface-container-high rounded-xl">
              <button
                className={clsx(
                  "px-6 py-2 rounded-lg text-sm font-bold transition-all hover:cursor-pointer",
                  {
                    "bg-warning": status === "DRAFT",
                  },
                )}
                type="button"
                id="draftBtn"
                onClick={() => setStatus("DRAFT")}
              >
                {STATUS_TEXT_MAP.DRAFT}
              </button>
              <button
                className={clsx(
                  "px-6 py-2 rounded-lg text-sm font-bold transition-all hover:cursor-pointer",
                  {
                    "bg-accent": status === "ACTIVE",
                  },
                )}
                type="button"
                id="activeBtn"
                onClick={() => setStatus("ACTIVE")}
              >
                {STATUS_TEXT_MAP.ACTIVE}
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Section 5: Errores Globales --> */}
        {Object.keys(errors).length > 0 && (
          <div className="lg:col-span-12">
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Existen campos con errores</Alert.Title>
                <Alert.Description>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {Object.entries(errors).map(([field, msg]) => (
                      <li key={field} className="text-sm font-medium">
                        {msg}
                      </li>
                    ))}
                  </ul>
                </Alert.Description>
              </Alert.Content>
            </Alert>
          </div>
        )}
      </Form>
    </>
  );
};
