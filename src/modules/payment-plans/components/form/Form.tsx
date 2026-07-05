"use client";
import { iconMap } from "@/utils/iconMap";
import {
  FieldError,
  Form,
  Input,
  Label,
  Surface,
  TextField,
  toast,
  ComboBox,
  Select,
  ListBox,
} from "@heroui/react";
import React, { useCallback, useState } from "react";
import {
  addPaymentPlan,
  editPaymentPlan,
  IPaymentPlan,
} from "@/modules/payment-plans";

interface Props {
  paymentPlan?: IPaymentPlan;
  teamSeasonId: string;
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormPaymentPlan = ({
  paymentPlan,
  teamSeasonId,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [name, setName] = useState(paymentPlan?.name || null);
  const [registrationDiscountPercent, setRegistrationDiscountPercent] =
    useState<string | null>(paymentPlan?.registrationDiscountPercent || null);
  const [monthlyDiscountPercent, setMonthlyDiscountPercent] = useState<
    string | null
  >(paymentPlan?.monthlyDiscountPercent || null);

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
    if (!registrationDiscountPercent) {
      newErrors.registrationDiscountPercent =
        "Debe ingresar un descuento de inscripción";
    }
    if (!monthlyDiscountPercent) {
      newErrors.monthlyDiscountPercent = "Debe ingresar un descuento mensual";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    let res;
    const data = {
      teamSeasonId,
      name: name!,
      registrationDiscountPercent: registrationDiscountPercent!,
      monthlyDiscountPercent: monthlyDiscountPercent!,
    };
    if (paymentPlan) {
      res = await editPaymentPlan({ id: paymentPlan.id, data });
    } else {
      res = await addPaymentPlan(data);
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
    onSubmited?.();
  };

  return (
    <Surface variant="transparent">
      <Form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          isRequired
          className="w-full"
          name="name"
          type="text"
          isInvalid={!!errors.name || undefined}
        >
          <Label>Nombre</Label>
          <Input
            variant="secondary"
            value={name || ""}
            onChange={(e) => {
              setName(e.target.value || null);
              handleRemoveError("name");
            }}
            placeholder="Ingrese el nombre del rol"
          />
          <FieldError children={errors.name && <> {errors.name}</>} />
        </TextField>

        <TextField
          isRequired
          className="w-full"
          name="registrationDiscountPercent"
          type="text"
          isInvalid={!!errors.registrationDiscountPercent || undefined}
        >
          <Label>Descuento Inscripción (%)</Label>
          <Input
            variant="secondary"
            min={0}
            max={100}
            placeholder="12"
            type="number"
            step={0.1} // para que acepte decimales
            value={registrationDiscountPercent || ""}
            onChange={(e) => {
              setRegistrationDiscountPercent(e.target.value || null);
              handleRemoveError("registrationDiscountPercent");
            }}
          />
          <FieldError
            children={
              errors.registrationDiscountPercent && (
                <> {errors.registrationDiscountPercent}</>
              )
            }
          />
        </TextField>
        <TextField
          isRequired
          className="w-full"
          name="monthlyDiscountPercent"
          type="text"
          isInvalid={!!errors.minAge || undefined}
        >
          <Label>Descuento Mensual (%)</Label>
          <Input
            variant="secondary"
            min={0}
            max={100}
            placeholder="12"
            type="number"
            step={0.1} // para que acepte decimales
            value={monthlyDiscountPercent || ""}
            onChange={(e) => {
              setMonthlyDiscountPercent(e.target.value || null);
              handleRemoveError("monthlyDiscountPercent");
            }}
          />
          <FieldError
            children={
              errors.monthlyDiscountPercent && (
                <> {errors.monthlyDiscountPercent}</>
              )
            }
          />
        </TextField>
      </Form>
    </Surface>
  );
};
