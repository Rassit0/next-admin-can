"use client";
import { Form, Surface, toast, Button } from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";
import { editActivity } from "../../actions/edit";
import {
  addActivity,
  AddActivityProps,
  ActivityStatus,
  ActivityType,
  IActivity,
  ActivitySkillLevel,
} from "@/modules/activities";
import { CardTypeActivity } from "./CardTypeActivity";
import { InfoBasic } from "./CardInfoBasic";
import { CardPayments } from "./CardPayments";
import { CardAssignments } from "./CardAssignments";
import { CardDateRange } from "./CardDateRange";
import { useRouter } from "next/navigation";
import { IOrganization } from "@/modules/organizations";

interface Props {
  activityParent?: IActivity;
  typesPermits: ActivityType[] | "all";
  activity?: IActivity;
  organization: IOrganization;
  formId: string;
  onSubmited?: () => void;
  setIsLoading?: (value: boolean) => void;
}
export const FormActivity = ({
  activityParent,
  typesPermits,
  activity,
  organization,
  formId,
  onSubmited,
  setIsLoading,
}: Props) => {
  const router = useRouter();

  const [name, setName] = useState(activity?.name || "");
  const [type, setType] = useState<ActivityType>(
    // activity?.type ||
    //   (organization.type === "ACADEMY" ? "EDUCATIONAL" : "TRAINING"),
    "EDUCATIONAL",
  );
  const [level, setLevel] = useState<ActivitySkillLevel>(
    activity?.level || "NA",
  );
  const [startDate, setStartDate] = useState<Date | null>(
    activity?.startDate || null,
  );
  const [endDate, setEndDate] = useState<Date | null>(
    activity?.endDate || null,
  );
  const [totalPrice, setTotalPrice] = useState(activity?.totalPrice || "");
  const [monthlyPrice, setMonthlyPrice] = useState(
    activity?.monthlyPrice || "",
  );
  const [registrationFee, setRegistrationFee] = useState(
    activity?.registrationFee || "",
  );
  const [maxMembers, setMaxMembers] = useState<number>(
    activity?.maxMembers || 0,
  );
  const [minMembers, setMinMembers] = useState<number>(
    activity?.minMembers || 0,
  );
  const [staffRequired, setStaffRequired] = useState<number>(
    activity?.staffRequired || 0,
  );
  const [status, setStatus] = useState<ActivityStatus>(
    activity?.status || "DRAFT",
  );
  const [categoryIds, setCategoryIds] = useState<number[]>(
    activity?.activityCategories.map((c) => c.category.id) || [],
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRemoveError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const { [fieldName]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!name) {
      newErrors.name = "Debe ingresar un nombre";
    }
    if (!startDate) {
      newErrors.startDate = "Debe ingresar una fecha de inicio";
    }
    if (!endDate) {
      newErrors.endDate = "Debe ingresar una fecha de fin";
    }

    if (startDate && endDate && startDate >= endDate) {
      // newErrors.startDate =
      //   "La fecha de inicio debe ser menor a la fecha de fin";
      newErrors.endDate = "La fecha de fin debe ser mayor a la fecha de inicio";
    } else {
      if (
        activityParent?.startDate &&
        startDate &&
        startDate < activityParent.startDate
      ) {
        newErrors.startDate = `La fecha de inicio debe ser mayor o igual a la fecha de inicio de la actividad padre ${activityParent.name} (${activityParent.startDate.toLocaleString()})`;
      }
      if (
        activityParent?.endDate &&
        endDate &&
        endDate > activityParent.endDate
      ) {
        newErrors.endDate = `La fecha de fin debe ser menor o igual a la fecha de fin de la actividad padre ${activityParent.name} (${activityParent.endDate.toLocaleString()})`;
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    let res;
    const data: AddActivityProps = {
      name,
      // organizationId: activityParent ? undefined : organization.id,
      type,
      startDate: startDate!,
      endDate: endDate!,
      totalPrice,
      monthlyPrice,
      registrationFee,
      level,
      maxMembers,
      minMembers,
      staffRequired,
      parentId: activityParent?.id || null,
      status,
      categoryIds: activityParent?.parentId ? undefined : categoryIds,
    };
    if (activity) {
      res = await editActivity({ id: activity.id, data });
    } else {
      res = await addActivity(data);
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
      description: activity
        ? "La instalación se ha editado exitosamente"
        : "La instalación se ha agregado exitosamente",
    });
    if (activityParent) {
      router.push(
        `/organizations/${organization.id}/manage/activities/${activityParent.id}/manage/activities`,
      );
    } else {
      router.push(`/organizations/${organization.id}/manage/activities`);
    }
  };
  return (
    <Surface variant="transparent">
      <Form id={formId} onSubmit={handleSubmit} className="space-y-8">
        {/* <!-- Bento Section 1: Core Data & Hierarchy --> */}
        <div className="grid grid-cols-12 gap-6">
          <CardTypeActivity
            typesPermits={typesPermits}
            type={type}
            setType={setType}
            errors={errors}
            setErrors={setErrors}
            handleRemoveError={handleRemoveError}
          />

          {/* <!-- Datos Básicos Card --> */}
          {/* <InfoBasic
            organizationId={organization.id}
            name={name}
            setName={setName}
            level={level}
            setLevel={setLevel}
            maxMembers={maxMembers}
            setMaxMembers={setMaxMembers}
            minMembers={minMembers}
            setMinMembers={setMinMembers}
            staffRequired={staffRequired}
            setStaffRequired={setStaffRequired}
            errors={errors}
            handleRemoveError={handleRemoveError}
          /> */}
          {/* <!-- Lógica Financiera Card --> */}
          <CardPayments
            registrationFee={registrationFee}
            setRegistrationFee={setRegistrationFee}
            monthlyPrice={monthlyPrice}
            setMonthlyPrice={setMonthlyPrice}
            totalPrice={totalPrice}
            setTotalPrice={setTotalPrice}
            errors={errors}
            handleRemoveError={handleRemoveError}
          />

          {/* <!-- Fechas Card --> */}
          <CardDateRange
            activityType={type}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            errors={errors}
            handleRemoveError={handleRemoveError}
          />

          {/* <!-- Asignaciones Card --> */}
          {activityParent?.parentId === null && (
            <CardAssignments
              categoryIds={categoryIds}
              setCategoryIds={setCategoryIds}
              errors={errors}
              handleRemoveError={handleRemoveError}
            />
          )}
        </div>

        {/* <!-- Sticky Footer Actions --> */}
        <div className="flex items-center justify-between pt-10 mt-10 border-t border-outline-variant/20">
          <Button variant="danger-soft" type="button">
            Cancelar
          </Button>
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="outline"
              onPress={() => setStatus("DRAFT")}
            >
              Guardar Borrador
            </Button>
            <Button type="submit" onPress={() => setStatus("PUBLISHED")}>
              Publicar Actividad
            </Button>
          </div>
        </div>
      </Form>
    </Surface>
  );
};
