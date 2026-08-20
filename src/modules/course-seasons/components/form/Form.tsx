"use client";
import { HeaderPage } from "@/ui";
import { BasicInfoCard } from "./BasicInfoCard";
import { CapacityCard } from "./CapacityCard";
import { DelayPoliciesCard } from "./DelayPoliciesCard";
import { FinancialStructureCard } from "./FinancialStructureCard";
import { ShiftConfigBlock, IShiftConfigForm } from "./ShiftConfigBlock";
import { ICourse } from "@/modules/courses";
import { useCallback, useRef, useState } from "react";

import { Alert, Button, Form, toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  addCourseSeason,
  editCourseSeason,
  Gender,
  ICategoryOption,
  ISeasonOption,
  ICourseSeason,
  StatusCourseSeason,
  IPostCourseSeason,
  SeasonBillingType,
  BillingFrequency,
  IShiftOption,
} from "@/modules/course-seasons";
import { addShiftAction } from "@/modules/course-seasons/actions/add-shift";
import { STATUS_TEXT_MAP } from "../../constants/course-seasons.constants";

interface Props {
  formId: string;
  course: ICourse;
  courseSeason?: ICourseSeason;
  categoriesOptions: ICategoryOption[];
  seasonsOptions: ISeasonOption[];
  shiftsOptions: IShiftOption[];
  urlRedirect: string;
  isClone?: boolean;
}

export const FormCourseSeason = ({
  formId,
  course,
  courseSeason,
  categoriesOptions,
  seasonsOptions,
  shiftsOptions,
  urlRedirect,
  isClone = false,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formRef = useRef<HTMLFormElement | null>(null);

  // form params
  const [name, setName] = useState<string>(
    courseSeason?.name || "Regular"
  );
  const [description, setDescription] = useState<string | null>(
    courseSeason?.description || null,
  );
  // === SHIFTS CONFIGURATION (Only for Creation Mode) ===
  const generateId = () => Math.random().toString(36).substring(2, 9);
  
  const [shifts, setShifts] = useState<IShiftConfigForm[]>([
    {
      key: generateId(),
      shiftId: "",
      categoryId: "",
      gender: null,
      validateAge: true,
      minBirthYear: null,
      maxBirthYear: null,
      minMembers: 5,
      maxMembers: 20
    }
  ]);

  const handleShiftChange = useCallback((index: number, field: keyof IShiftConfigForm, value: any) => {
    setShifts((prev) => {
      const newShifts = [...prev];
      newShifts[index] = { ...newShifts[index], [field]: value };
      return newShifts;
    });
    handleRemoveError(`shift_${index}_${field}`);
  }, []);

  const handleAddShift = () => {
    setShifts((prev) => [
      ...prev,
      {
        key: generateId(),
        shiftId: "",
        categoryId: "",
        gender: null,
        validateAge: true,
        minBirthYear: null,
        maxBirthYear: null,
        minMembers: 5,
        maxMembers: 20
      }
    ]);
  };

  const handleRemoveShift = (index: number) => {
    setShifts((prev) => prev.filter((_, i) => i !== index));
    // Clean up errors related to this shift
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith(`shift_${index}_`)) {
          delete newErrors[key];
        }
      });
      return newErrors;
    });
  };
  // ====================================================

  const [seasonId, setSeasonId] = useState<string | null>(
    courseSeason?.season.id || null,
  );

  const [registrationFee, setRegistrationFee] = useState<string | null>(
    courseSeason?.billingConfig?.registrationFee || null,
  );
  const [recurringFee, setRecurringFee] = useState<string | null>(
    courseSeason?.billingConfig?.recurringFee || null,
  );
  const [seasonFee, setSeasonFee] = useState<string | null>(
    courseSeason?.billingConfig?.seasonFee || null,
  );
  const [billingType, setBillingType] = useState<SeasonBillingType>(
    courseSeason?.billingConfig?.billingType || "MONTHLY_ONLY",
  );
  const [billingFrequency, setBillingFrequency] = useState<BillingFrequency>(
    courseSeason?.billingConfig?.billingFrequency || "MONTHLY",
  );
  const [billingDay, setBillingDay] = useState<number | null>(
    courseSeason?.billingConfig?.billingDay || null,
  );

  const [prorateFirstRecurringFee, setProrateFirstRecurringFee] =
    useState<boolean>(
      courseSeason?.billingConfig?.prorateFirstRecurringFee ?? true,
    );
  const [prorateLastRecurringFee, setProrateLastRecurringFee] =
    useState<boolean>(
      courseSeason?.billingConfig?.prorateLastRecurringFee ?? true,
    );
  const [prorateRegistrationFee, setProrateRegistrationFee] = useState<boolean>(
    courseSeason?.billingConfig?.prorateRegistrationFee ?? false,
  );
  const [prorateSeasonFee, setProrateSeasonFee] = useState<boolean>(
    courseSeason?.billingConfig?.prorateSeasonFee ?? false,
  );

  const [lateFeeEnabled, setLateFeeEnabled] = useState<boolean>(
    courseSeason?.billingConfig?.lateFeeEnabled === true ? true : false,
  );
  const [lateFeePerDay, setLateFeePerDay] = useState<string | null>(
    courseSeason?.billingConfig?.lateFeePerDay || null,
  );
  const [graceDays, setGraceDays] = useState<number | null>(
    courseSeason?.billingConfig?.graceDays !== undefined
      ? courseSeason?.billingConfig?.graceDays
      : null,
  );
  const [status, setStatus] = useState<StatusCourseSeason>(
    courseSeason?.status || "DRAFT",
  );
  // fin form params

  const isEditMode = !!courseSeason && !isClone;
  const isStructuralDisabled = isEditMode && courseSeason.status === "ACTIVE";
  const isFinancialDisabled = isEditMode && courseSeason.status === "ACTIVE";

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRemoveError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const { [fieldName]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | null) => {
    if (e) e.preventDefault();
    console.log("submit", course.id);
    // setErrors({});
    const newErrors: Record<string, string> = {};
    if (seasonId === null) {
      newErrors.seasonId = "Debe ingresar la temporada";
    }
    
    if (!isEditMode) {
      if (shifts.length === 0) {
        newErrors.shifts = "Debe agregar al menos un turno";
      } else {
        shifts.forEach((shift, index) => {
          if (!shift.shiftId) newErrors[`shift_${index}_shiftId`] = "Debe seleccionar un turno";
          if (!shift.categoryId) newErrors[`shift_${index}_categoryId`] = "Debe seleccionar una categoría";
          if (!shift.gender) newErrors[`shift_${index}_gender`] = "Debe seleccionar el género";
          if (!shift.minMembers) newErrors[`shift_${index}_minMembers`] = "Debe ingresar cupo mínimo";
          if (!shift.maxMembers) newErrors[`shift_${index}_maxMembers`] = "Debe ingresar cupo máximo";
          if (shift.validateAge && shift.minBirthYear && shift.maxBirthYear && shift.minBirthYear > shift.maxBirthYear) {
             newErrors[`shift_${index}_minBirthYear`] = "Año min > max";
             newErrors[`shift_${index}_maxBirthYear`] = "Año max < min";
          }
          
          // Prevenir turnos duplicados
          const isDuplicate = shifts.some((s, i) => i !== index && s.shiftId === shift.shiftId && s.shiftId !== "");
          if (isDuplicate) {
            newErrors[`shift_${index}_shiftId`] = "Este turno ya fue agregado en otro bloque";
          }
        });
      }
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
    if (billingType !== "SINGLE_ONLY") {
      if (!billingFrequency) {
        newErrors.billingFrequency =
          "Debe ingresar la frecuencia de facturación";
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
    const baseData = {
      name,
      description: description!,
      courseId: course.id,
      seasonId: seasonId!,
      billingConfig: {
        billingDay: 1,
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
        prorateFirstRecurringFee,
        prorateLastRecurringFee,
        prorateRegistrationFee,
        prorateSeasonFee,
        lateFeeEnabled,
        lateFeePerDay: lateFeeEnabled ? lateFeePerDay! : "0",
        graceDays: lateFeeEnabled ? graceDays! : 0,
        debtToleranceMonths: 0,
      },
      status,
    };

    if (courseSeason && !isClone) {
      // Modo edición: omitimos los turnos y capacidades
      const res = await editCourseSeason({ id: courseSeason.id, data: baseData });
      setIsLoading?.(false);
      
      if (res.error) {
        let errorDescription = res.message;
        if (res.errors) {
          errorDescription = Object.entries(res.errors)
            .map(([field, messages]) => {
              const msgList = Array.isArray(messages) ? messages.join(", ") : messages;
              return `${field}: ${msgList}`;
            }).join("\n");
        }
        toast.danger("Error", { description: errorDescription });
        if (res.errors) setErrors(res.errors);
        return;
      }
      
      toast.success("¡Cambios guardados!", { description: "La temporada se ha actualizado correctamente." });
      router.push(urlRedirect);
      
    } else {
      // Modo creación: la Oferta se crea con el primer turno, los demás se agregan como turnos adicionales
      const firstShift = shifts[0];
      const res = await addCourseSeason({ 
        ...baseData, 
        shiftId: firstShift.shiftId,
        categoryId: firstShift.categoryId,
        gender: firstShift.gender!,
        validateAge: firstShift.validateAge,
        minBirthYear: firstShift.minBirthYear,
        maxBirthYear: firstShift.maxBirthYear,
        maxMembers: firstShift.maxMembers,
        minMembers: firstShift.minMembers
      } as any);
      
      if (res.error) {
        let errorDescription = res.message;
        if (res.errors) {
          errorDescription = Object.entries(res.errors)
            .map(([field, messages]) => {
              const msgList = Array.isArray(messages) ? messages.join(", ") : messages;
              return `${field}: ${msgList}`;
            }).join("\n");
        }
        toast.danger("Error", { description: errorDescription });
        if (res.errors) setErrors(res.errors);
        setIsLoading?.(false);
        return;
      }

      const newSeasonId = res.data.id;
      const additionalShifts = shifts.slice(1);
      
      let successes = 1; // El primer turno
      let failures = 0;
      let lastErrorMessage = "";

      if (additionalShifts.length > 0) {
        const results = await Promise.allSettled(
          additionalShifts.map(shift => addShiftAction(newSeasonId, { 
            shiftId: shift.shiftId, 
            categoryId: shift.categoryId,
            gender: shift.gender!,
            validateAge: shift.validateAge,
            minBirthYear: shift.minBirthYear,
            maxBirthYear: shift.maxBirthYear,
            maxMembers: shift.maxMembers, 
            minMembers: shift.minMembers 
          }))
        );
        
        results.forEach((r) => {
          if (r.status === 'fulfilled' && !r.value.error) {
            successes++;
          } else {
            failures++;
            if (r.status === 'fulfilled') {
              if (r.value.error && r.value.errors) {
                const details = Object.values(r.value.errors).flat().join(", ");
                lastErrorMessage = `${r.value.message}: ${details}`;
              } else if (r.value.message) {
                lastErrorMessage = r.value.message;
              }
            }
          }
        });
      }
      
      setIsLoading?.(false);
      
      if (failures > 0) {
        toast.danger("Error parcial", { 
          description: `La Oferta se creó, pero ${failures} turnos adicionales fallaron. ${lastErrorMessage}` 
        });
        router.push(urlRedirect);
      } else {
        toast.success("¡Oferta Comercial Creada!", { 
          description: `Se creó exitosamente la oferta con ${successes} turno(s).` 
        });
        router.push(urlRedirect);
      }
    }
  };

  return (
    <>
      <Form
        id={formId}
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        <div className="lg:col-span-12 bg-surface-container rounded-2xl p-6 border border-border/50">
          <label className="text-sm font-bold mb-2 block">Nombre de la Oferta Comercial</label>
          <input
            className="w-full bg-surface border border-border/50 rounded-lg p-3 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Regular, Premium, Intensivo..."
          />
        </div>
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
            seasonsOptions={seasonsOptions}
            seasonId={seasonId}
            setSeasonId={setSeasonId}
            description={description}
            setDescription={setDescription}
            errors={errors}
            handleRemoveError={handleRemoveError}
            isStructuralDisabled={isStructuralDisabled}
            isEditMode={isEditMode}
          />
          <DelayPoliciesCard
            billingFrequency={billingFrequency}
            lateFeePerDay={lateFeePerDay}
            setLateFeePerDay={setLateFeePerDay}
            graceDays={graceDays}
            setGraceDays={setGraceDays}
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
        
        {/* <!-- Section 3: Configuración de Turnos (Solo en Creación) --> */}
        {!isEditMode && (
          <div className="lg:col-span-12 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">Turnos de la Oferta</h3>
            </div>
            
            {shifts.map((shift, index) => (
              <ShiftConfigBlock
                key={shift.key}
                index={index}
                shift={shift}
                categoriesOptions={categoriesOptions}
                shiftsOptions={shiftsOptions}
                onChange={handleShiftChange}
                onRemove={handleRemoveShift}
                errors={errors}
                canRemove={shifts.length > 1}
              />
            ))}
            
            <Button
              className="w-full bg-surface-container border border-dashed border-border/50 text-muted"
              variant="secondary"
              onPress={handleAddShift}
            >
              + Añadir Otro Turno
            </Button>
          </div>
        )}

        {/* <!-- Section 4: Políticas de Mora (Full Width Bottom) --> */}
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
        <Button
            size="lg"
            variant="secondary"
            className="w-full md:w-auto font-bold bg-primary-100 text-primary-800"
            isDisabled={isLoading}
            onPress={() => handleSubmit(null)}
          >
            {isEditMode ? "Guardar Cambios" : "Guardar Temporada"}
        </Button>
      </Form>
    </>
  );
};
