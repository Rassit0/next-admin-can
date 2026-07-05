"use client";
import { HeaderPage } from "@/ui";
import { BasicInfoCard } from "./BasicInfoCard";
import { CapacityCard } from "./CapacityCard";
import { DelayPoliciesCard } from "./DelayPoliciesCard";
import { FinancialStructureCard } from "./FinancialStructureCard";
import { ITeam } from "@/modules/teams";
import { useCallback, useRef, useState } from "react";

import { Button, Form, toast } from "@heroui/react";
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
    teamSeason?.billingDay || null,
  );
  const [registrationFee, setRegistrationFee] = useState<string | null>(
    teamSeason?.registrationFee || null,
  );
  const [monthlyFee, setMonthlyFee] = useState<string | null>(
    teamSeason?.monthlyFee || null,
  );
  const [debtToleranceMonths, setDebtToleranceMonths] = useState<number | null>(
    teamSeason?.debtToleranceMonths !== undefined
      ? teamSeason?.debtToleranceMonths
      : null,
  );
  const [lateFeeEnabled, setLateFeeEnabled] = useState<boolean>(
    teamSeason?.lateFeeEnabled === true ? true : false,
  );
  const [lateFeePerDay, setLateFeePerDay] = useState<string | null>(
    teamSeason?.lateFeePerDay || null,
  );
  const [graceDays, setGraceDays] = useState<number | null>(
    teamSeason?.graceDays !== undefined ? teamSeason?.graceDays : null,
  );
  const [status, setStatus] = useState<StatusTeamSeason>(
    teamSeason?.status || "DRAFT",
  );
  // fin form params

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
    if (seasonId === null) {
      newErrors.seasonId = "Debe ingresar la temporada";
    }
    if (gender === null) {
      newErrors.gender = "Debe ingresar el género";
    }
    if (monthlyFee === null) {
      newErrors.monthlyFee = "Debe ingresar el valor de la cuota mensual";
    }
    if (registrationFee === null) {
      newErrors.registrationFee = "Debe ingresar el valor de la inscripción";
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
    if (billingDay === null) {
      newErrors.billingDay = "Debe ingresar el día de facturación";
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
      teamId: team.id,
      categoryId: categoryId!,
      seasonId: seasonId!,
      gender: gender!,
      billingDay: billingDay!,
      registrationFee: registrationFee!,
      monthlyFee: monthlyFee!,
      debtToleranceMonths: debtToleranceMonths!,
      lateFeeEnabled,
      lateFeePerDay: lateFeeEnabled ? lateFeePerDay! : "0",
      graceDays: lateFeeEnabled ? graceDays! : 0,
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
            errors={errors}
            handleRemoveError={handleRemoveError}
          />
          <DelayPoliciesCard
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
            monthlyFee={monthlyFee}
            setMonthlyFee={setMonthlyFee}
            billingDay={billingDay}
            setBillingDay={setBillingDay}
            errors={errors}
            handleRemoveError={handleRemoveError}
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
        <div className="lg:col-span-12 flex justify-end items-center gap-8 p-8 bg-surface-container-low rounded-full">
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
      </Form>
    </>
  );
};
