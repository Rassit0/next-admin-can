"use client";
import { HeaderPage } from "@/ui";
import { BasicInfoCard } from "./BasicInfoCard";
import { CapacityCard } from "./CapacityCard";
import { DelayPoliciesCard } from "./DelayPoliciesCard";
import { FinancialStructureCard } from "./FinancialStructureCard";
import { ITeam } from "@/modules/teams";
import { useCallback, useRef, useState } from "react";
import {
  addTeamSeason,
  editTeamSeason,
  ITeamSeason,
  PostOfferingInterface,
  STATUS_TEXT_MAP,
  StatusTeamSeason,
} from "@/modules/team-membership-offerings";
import { Button, Form, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  DateValue,
  getLocalTimeZone,
  parseDate,
} from "@internationalized/date";

interface Props {
  team: ITeam;
  teamSeason?: ITeamSeason;
  urlRedirect: string;
}

export const FormTeamOffering = ({ team, teamSeason, urlRedirect }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formRef = useRef<HTMLFormElement | null>(null);

  // form params
  const [name, setName] = useState<string | null>(teamSeason?.name || null);
  const [startDate, setStartDate] = useState<DateValue | null>(
    teamSeason?.startDate
      ? parseDate(
          `${teamSeason.startDate.getFullYear()}-${(teamSeason.startDate.getMonth() + 1).toString().padStart(2, "0")}-${teamSeason.startDate.getDate().toString().padStart(2, "0")}`,
        )
      : null,
  );
  const [endDate, setEndDate] = useState<DateValue | null>(
    teamSeason?.endDate
      ? parseDate(
          `${teamSeason.endDate.getFullYear()}-${(teamSeason.endDate.getMonth() + 1).toString().padStart(2, "0")}-${teamSeason.endDate.getDate().toString().padStart(2, "0")}`,
        )
      : null,
  );
  const [maxMembers, setMaxMembers] = useState<number | null>(
    teamSeason?.maxMembers || null,
  );
  const [minMembers, setMinMembers] = useState<number | null>(
    teamSeason?.minMembers || null,
  );
  const [minYear, setMinYear] = useState<number | null>(
    teamSeason?.minYear || null,
  );
  const [maxYear, setMaxYear] = useState<number | null>(
    teamSeason?.maxYear || null,
  );
  const [recurringFee, setRecurringFee] = useState<string | null>(
    teamSeason?.recurringFee || null,
  );
  const [registrationFee, setRegistrationFee] = useState<string | null>(
    teamSeason?.registrationFee || null,
  );
  const [fullPaymentDiscountPercent, setFullPaymentDiscountPercent] = useState<
    string | null
  >(teamSeason?.fullPaymentDiscountPercent || null);
  const [lateFeeEnabled, setLateFeeEnabled] = useState<boolean>(
    teamSeason?.lateFeeEnabled === true ? true : false,
  );
  const [lateFeePerDay, setLateFeePerDay] = useState<string | null>(
    teamSeason?.lateFeePerDay || null,
  );
  const [graceDays, setGraceDays] = useState<number | null>(
    teamSeason?.graceDays !== undefined ? teamSeason?.graceDays : null,
  );
  const [suspensionAfterMonthsDue, setSuspensionAfterMonthsDue] = useState<
    number | null
  >(
    teamSeason?.suspensionAfterMonthsDue !== undefined
      ? teamSeason?.suspensionAfterMonthsDue
      : null,
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
    
    // Evitar que el submit de un formulario anidado dispare este submit
    if ((e.target as HTMLFormElement).id !== "form-team-offering") {
      return;
    }
    const newErrors: Record<string, string> = {};
    if (name === null) {
      newErrors.name = "Debe ingresar un nombre";
    }
    if (startDate === null) {
      newErrors.startDate = "Debe ingresar una fecha de inicio";
    }
    if (endDate === null) {
      newErrors.seasonId = "Debe ingresar una fecha de fin";
    }
    if (maxMembers === null) {
      newErrors.maxMembers = "Debe ingresar el número máximo de miembros";
    }
    if (minMembers === null) {
      newErrors.minMembers = "Debe ingresar el número mínimo de miembros";
    }
    if (minYear === null) {
      newErrors.minYear = "Debe ingresar el año mínimo";
    }
    if (maxYear === null) {
      newErrors.maxYear = "Debe ingresar el año máximo";
    }
    if (recurringFee === null) {
      newErrors.recurringFee = "Debe ingresar el valor de la cuota mensual";
    }
    if (registrationFee === null) {
      newErrors.registrationFee = "Debe ingresar el valor de la inscripción";
    }
    if (fullPaymentDiscountPercent === null) {
      newErrors.fullPaymentDiscountPercent =
        "Debe ingresar el porcentaje de descuento por pago completo";
    }
    if (lateFeePerDay === null) {
      newErrors.lateFeePerDay = "Debe ingresar el valor de la multa por día";
    }
    console.log({ graceDays });
    if (graceDays === null) {
      newErrors.graceDays = "Debe ingresar el número de días de gracia";
    }
    if (suspensionAfterMonthsDue === null) {
      newErrors.suspensionAfterMonthsDue =
        "Debe ingresar el número de meses de mora para la suspensión";
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
    const data: PostOfferingInterface = {
      teamId: team.id,
      name: name!,
      startDate: startDate!.toDate(getLocalTimeZone()),
      endDate: endDate!.toDate(getLocalTimeZone()),
      maxMembers: maxMembers!,
      minMembers: minMembers!,
      minYear: minYear!,
      maxYear: maxYear!,
      recurringFee: recurringFee!,
      registrationFee: registrationFee!,
      fullPaymentDiscountPercent: fullPaymentDiscountPercent!,
      lateFeeEnabled,
      lateFeePerDay: lateFeePerDay!,
      graceDays: graceDays!,
      suspensionAfterMonthsDue: suspensionAfterMonthsDue!,
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
        id="form-team-offering"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* <!-- Section 1: Información Básica & Capacidad --> */}
        <div className="lg:col-span-7 space-y-6">
          {/* <!-- Basic Info Card --> */}
          <BasicInfoCard
            name={name}
            setName={setName}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            maxYear={maxYear}
            setMaxYearId={setMaxYear}
            minYear={minYear}
            setMinYearId={setMinYear}
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
        {/* <!-- Section 2: Estructura Financiera --> */}
        <div className="lg:col-span-5 space-y-6">
          <FinancialStructureCard
            registrationFee={registrationFee}
            setRegistrationFee={setRegistrationFee}
            recurringFee={recurringFee}
            setRecurringFee={setRecurringFee}
            fullPaymentDiscountPercent={fullPaymentDiscountPercent}
            setFullPaymentDiscountPercent={setFullPaymentDiscountPercent}
            errors={errors}
            handleRemoveError={handleRemoveError}
          />
        </div>
        {/* <!-- Section 3: Políticas de Mora (Full Width Bottom) --> */}
        <div className="lg:col-span-12">
          <DelayPoliciesCard
            lateFeePerDay={lateFeePerDay}
            setLateFeePerDay={setLateFeePerDay}
            graceDays={graceDays}
            setGraceDays={setGraceDays}
            suspensionAfterMonthsDue={suspensionAfterMonthsDue}
            setSuspensionAfterMonthsDue={setSuspensionAfterMonthsDue}
            lateFeeEnabled={lateFeeEnabled}
            setLateFeeEnabled={setLateFeeEnabled}
            errors={errors}
            handleRemoveError={handleRemoveError}
          />
        </div>
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
