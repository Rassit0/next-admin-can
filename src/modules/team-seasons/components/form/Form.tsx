"use client";
import { HeaderPage } from "@/ui";
import { BasicInfoCard } from "./BasicInfoCard";
import { DelayPoliciesCard } from "./DelayPoliciesCard";
import { FinancialStructureCard } from "./FinancialStructureCard";
import { CategoryConfigBlock, ICategoryConfigForm } from "./CategoryConfigBlock";
import { useCallback, useRef, useState } from "react";

import { Alert, Button, Form, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  addTeamSeason,
  editTeamSeason,
  ISeasonOption,
  ICategoryOption,
  ITeamSeason,
  StatusTeamSeason,
  IPostTeamSeason,
  SeasonBillingType,
  BillingFrequency,
  Team,
} from "@/modules/team-seasons";
import { STATUS_TEXT_MAP } from "../../constants/team-seasons.constants";

interface Props {
  formId: string;
  team: Team;
  teamSeason?: ITeamSeason;
  seasonsOptions: ISeasonOption[];
  categoriesOptions?: ICategoryOption[];
  urlRedirect: string;
}

export const FormTeamSeason = ({
  formId,
  team,
  teamSeason,
  seasonsOptions,
  categoriesOptions = [],
  urlRedirect,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formRef = useRef<HTMLFormElement | null>(null);

  // form params
  const [description, setDescription] = useState<string | null>(
    teamSeason?.description || null,
  );
  const [seasonId, setSeasonId] = useState<string | null>(
    teamSeason?.season.id || null,
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

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const [categories, setCategories] = useState<ICategoryConfigForm[]>(
    teamSeason && teamSeason.status === "DRAFT" && teamSeason.categories?.length
      ? teamSeason.categories.map((c) => ({
          key: generateId(),
          categoryId: c.category.id,
          gender: c.gender,
          validateAge: c.validateAge,
          minBirthYear: c.minBirthYear ?? null,
          maxBirthYear: c.maxBirthYear ?? null,
          minMembers: c.minMembers ?? 5,
          maxMembers: c.maxMembers ?? 20,
        }))
      : [
          {
            key: generateId(),
            categoryId: "",
            gender: null,
            validateAge: true,
            minBirthYear: null,
            maxBirthYear: null,
            minMembers: 5,
            maxMembers: 20,
          },
        ]
  );
  // fin form params

  const handleCategoryChange = useCallback((index: number, field: keyof ICategoryConfigForm, value: any) => {
    setCategories((prev) => {
      const newCategories = [...prev];
      newCategories[index] = { ...newCategories[index], [field]: value };
      return newCategories;
    });
  }, []);

  const handleRemoveCategory = useCallback((index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddCategory = useCallback(() => {
    setCategories((prev) => [
      ...prev,
      {
        key: generateId(),
        categoryId: "",
        gender: null,
        validateAge: true,
        minBirthYear: null,
        maxBirthYear: null,
        minMembers: 5,
        maxMembers: 20,
      },
    ]);
  }, []);

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
    if (seasonId === null) {
      newErrors.seasonId = "Debe ingresar la temporada";
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

    if (!teamSeason || teamSeason.status === "DRAFT") {
      if (categories.length === 0) {
        newErrors.categories = "Debe agregar al menos una categoría";
      } else {
        categories.forEach((cat, index) => {
          if (!cat.categoryId)
            newErrors[`category_${index}_categoryId`] =
              "Debe seleccionar una categoría";
          if (!cat.gender)
            newErrors[`category_${index}_gender`] =
              "Debe seleccionar el género";
          if (!cat.minMembers)
            newErrors[`category_${index}_minMembers`] =
              "Debe ingresar cupo mínimo";
          if (!cat.maxMembers)
            newErrors[`category_${index}_maxMembers`] =
              "Debe ingresar cupo máximo";
          if (
            cat.validateAge &&
            cat.minBirthYear &&
            cat.maxBirthYear &&
            cat.minBirthYear > cat.maxBirthYear
          ) {
            newErrors[`category_${index}_minBirthYear`] = "Año min > max";
            newErrors[`category_${index}_maxBirthYear`] = "Año max < min";
          }

          // Prevenir categorías duplicadas (misma categoría y mismo género)
          const isDuplicate = categories.some(
            (c, i) =>
              i !== index &&
              c.categoryId === cat.categoryId &&
              c.gender === cat.gender &&
              c.categoryId !== "",
          );
          if (isDuplicate) {
            newErrors[`category_${index}_categoryId`] =
              "Esta categoría con este género ya fue agregada";
          }
        });
      }
    }

    setErrors(newErrors);
    console.log(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    let res;
    const baseData = {
      description: description || null,
      teamId: team.id,
      seasonId: seasonId!,
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
    };

    if (teamSeason) {
      // Modo edición
      const { teamId, seasonId, ...restBaseData } = baseData;
      const baseEditData = {
        ...restBaseData,
        status,
      };

      if (teamSeason.status === "DRAFT") {
        (baseEditData as any).categories = categories.map((c) => ({
          categoryId: c.categoryId,
          gender: c.gender!,
          validateAge: c.validateAge,
          minBirthYear: c.minBirthYear,
          maxBirthYear: c.maxBirthYear,
          minMembers: c.minMembers,
          maxMembers: c.maxMembers,
        }));
      }

      res = await editTeamSeason({ id: teamSeason.id, data: baseEditData as IPostTeamSeason });
    } else {
      const data: IPostTeamSeason = {
        ...baseData,
        status,
        categories: categories.map((c) => ({
          categoryId: c.categoryId,
          gender: c.gender!,
          minBirthYear: c.minBirthYear,
          maxBirthYear: c.maxBirthYear,
          minMembers: c.minMembers,
          maxMembers: c.maxMembers,
          validateAge: c.validateAge,
        })),
      };
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
        {/* <!-- Section 1: Información Básica --> */}
        <div className="lg:col-span-7 space-y-6">
          {/* <!-- Basic Info Card --> */}
          <BasicInfoCard
            seasonsOptions={seasonsOptions}
            seasonId={seasonId}
            setSeasonId={setSeasonId}
            description={description}
            setDescription={setDescription}
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
        </div>
        
        {/* <!-- Section 3: Configuraciones de Categoría --> */}
        {(!teamSeason || teamSeason.status === "DRAFT") && (
          <div className="lg:col-span-12">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-surface-container/50">
                <h3 className="text-lg font-bold">Categorías y Cupos</h3>
                <p className="text-on-surface-variant text-sm mt-1">
                  Agregue las categorías que estarán disponibles para esta
                  temporada.
                </p>
              </div>
            
            {categories.map((category, index) => (
              <CategoryConfigBlock
                key={category.key}
                index={index}
                category={category}
                categoriesOptions={categoriesOptions}
                onChange={handleCategoryChange}
                onRemove={handleRemoveCategory}
                errors={errors}
                canRemove={categories.length > 1}
              />
            ))}
            <div className="p-4 bg-surface-container-low border-t border-border">
              <Button
                className="w-full bg-surface-container border border-dashed border-border/50 text-muted"
                size="lg"
                onPress={handleAddCategory}
              >
                + Agregar Categoría
              </Button>
            </div>
            </div>
          </div>
        )}

        {/* <!-- Section 4: Políticas de Mora (Full Width Bottom) --> */}
        <div className="lg:col-span-12"></div>
        {/* <!-- Section 5: Estado Final (Floating Sticky-ish bottom or separate block) --> */}
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
