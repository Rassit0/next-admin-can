"use client";

import React, { useState } from "react";
import {
  Modal,
  Button,
  Input,
  InputGroup,
  TextArea,
  Form,
  TextField,
  FieldError,
  Label,
} from "@heroui/react";
import { FinancialAccount } from "@/modules/financial-accounts/interfaces/financial-account.interface";
import { createCashClosure } from "../actions/create";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  account: FinancialAccount | null;
  onSuccess: () => void;
}

export const CashClosureFormModal = ({
  isOpen,
  onOpenChange,
  account,
  onSuccess,
}: Props) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [difference, setDifference] = useState<number | null>(null);

  const [actualBalanceStr, setActualBalanceStr] = useState<string>("");
  const [observations, setObservations] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    setActualBalanceStr("");
    setObservations("");
    setErrors({});
    setStep(1);
    setDifference(null);
    onOpenChange(false);
  };

  const handleRemoveError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const onNextStep = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account) return;
    
    const actualBalance = Number(actualBalanceStr);
    if (isNaN(actualBalance) || actualBalanceStr.trim() === "") {
      setErrors({ actualBalance: "Monto requerido" });
      return;
    }

    const expected = Number(account.cachedBalance);
    const diff = actualBalance - expected;
    setDifference(diff);
    setStep(2);
  };

  const onSubmitFinal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!account) return;
    
    if (difference !== 0 && (!observations || observations.trim() === "")) {
      setErrors({ observations: "Debe proporcionar una observación para justificar la diferencia." });
      return;
    }

    setIsSubmitting(true);
    const res = await createCashClosure({
      financialAccountId: account.id,
      actualBalance: Number(actualBalanceStr),
      observations: observations,
    });
    setIsSubmitting(false);

    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      onSuccess();
      handleClose();
    }
  };

  if (!account) return null;

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={handleClose}
        isDismissable={false}
      >
        <Modal.Container placement="center" scroll="outside">
          <Modal.Dialog className="sm:max-w-2xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex items-center gap-2">
                <Modal.Heading>
                  {step === 1
                    ? "Arqueo de Caja (Conteo Físico)"
                    : "Resumen del Arqueo"}
                </Modal.Heading>
              </div>
            </Modal.Header>
            <Modal.Body className="p-4 md:p-6">
              {step === 1 ? (
                <Form
                  id="cash-closure-step1"
                  onSubmit={onNextStep}
                  className="flex flex-col gap-4 w-full"
                >
                  <p className="text-sm text-on-surface-variant">
                    Realice el conteo físico del dinero en caja (monedas y billetes)
                    y registre el monto total.
                  </p>
                  <TextField
                    isRequired
                    className="w-full"
                    name="actualBalance"
                    type="number"
                    isInvalid={!!errors.actualBalance || undefined}
                  >
                    <Label>Dinero físico en caja</Label>
                    <InputGroup>
                      <InputGroup.Prefix>
                        <span className="text-on-surface-variant text-sm pr-2">
                          {account.currency}
                        </span>
                      </InputGroup.Prefix>
                      <InputGroup.Input
                        value={actualBalanceStr}
                        onChange={(e: any) => {
                          setActualBalanceStr(e.target.value);
                          handleRemoveError("actualBalance");
                        }}
                        placeholder="Ej. 1500.50"
                        autoFocus
                      />
                    </InputGroup>
                    <FieldError
                      children={
                        errors.actualBalance && <> {errors.actualBalance}</>
                      }
                    />
                  </TextField>
                </Form>
              ) : (
                <Form
                  id="cash-closure-step2"
                  onSubmit={onSubmitFinal}
                  className="flex flex-col gap-4 w-full"
                >
                  <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-on-surface-variant uppercase tracking-wide">
                        Saldo Esperado
                      </span>
                      <span className="text-lg font-semibold">
                        {account.currency}{" "}
                        {Number(account.cachedBalance).toLocaleString("es-BO", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-on-surface-variant uppercase tracking-wide">
                        Saldo Contado
                      </span>
                      <span className="text-lg font-semibold">
                        {account.currency}{" "}
                        {Number(actualBalanceStr).toLocaleString("es-BO", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl flex justify-between items-center ${
                      difference! < 0
                        ? "bg-danger-50 text-danger-600"
                        : difference! > 0
                        ? "bg-warning-50 text-warning-600"
                        : "bg-success-50 text-success-600"
                    }`}
                  >
                    <span className="font-bold">Diferencia:</span>
                    <span className="font-bold text-lg">
                      {account.currency}{" "}
                      {difference!.toLocaleString("es-BO", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <TextField
                    isRequired={difference !== 0}
                    className="w-full"
                    name="observations"
                    type="text"
                    isInvalid={!!errors.observations || undefined}
                  >
                    <Label>
                      {difference !== 0
                        ? "Observaciones (Obligatorio si hay diferencia)"
                        : "Observaciones (Opcional)"}
                    </Label>
                    <TextArea
                      variant="secondary"
                      value={observations}
                      onChange={(e) => {
                        setObservations(e.target.value);
                        handleRemoveError("observations");
                      }}
                      placeholder={
                        difference !== 0
                          ? "Justifique la diferencia de dinero..."
                          : "Algún comentario adicional..."
                      }
                    />
                    <FieldError
                      children={
                        errors.observations && <> {errors.observations}</>
                      }
                    />
                  </TextField>
                </Form>
              )}
            </Modal.Body>
            <Modal.Footer>
              {step === 1 ? (
                <>
                  <Button variant="secondary" onPress={handleClose}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    form="cash-closure-step1"
                    variant="primary"
                  >
                    Siguiente
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onPress={() => setStep(1)}
                    isDisabled={isSubmitting}
                  >
                    Atrás
                  </Button>
                  <Button
                    type="submit"
                    form="cash-closure-step2"
                    variant="primary"
                    isPending={isSubmitting}
                  >
                    Confirmar Arqueo
                  </Button>
                </>
              )}
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
