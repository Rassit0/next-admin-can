"use client";
import React from "react";
import { Button, Modal } from "@heroui/react";
import { IPaymentPlan } from "@/modules/payment-plans";

interface ExampleProps {
  name: string;
  description: string;
  details: { label: string; value: string }[];
  planData: Partial<IPaymentPlan>;
  supportedBillingTypes: string[];
}

export const PAYMENT_PLAN_EXAMPLES: ExampleProps[] = [
  {
    name: 'Plan Regular (Sin Descuentos)',
    description: "El atleta paga ciclo a ciclo de forma normal sin ningún tipo de descuento ni cuotas adelantadas.",
    details: [
      { label: "Agrupar Cuotas", value: "1" },
      { label: "Descuentos", value: "Ninguno" },
    ],
    planData: {
      name: 'Plan Regular',
      advanceCycles: 1,
      promotionalCycles: 1,
      advanceCyclesDiscountPercent: '0',
      registrationDiscountPercent: '0',
      recurringDiscountPercent: '0',
      seasonFeeDiscountPercent: '0',
      isSinglePayment: false,
    },
    supportedBillingTypes: ["MONTHLY_ONLY", "BOTH"],
  },
  {
    name: 'Promo: "Inicia gratis y adelanta el próximo mes" (o 2x1)',
    description: "El atleta entra gratis el primer mes, pero se le obliga a pagar el segundo mes por adelantado.",
    details: [
      { label: "Agrupar Cuotas", value: "2" },
      { label: "Ciclos con descuento", value: "1" },
      { label: "Descuento en Cuotas Adelantadas", value: "100%" },
    ],
    planData: {
      name: 'Promo 2x1 (1er mes gratis)',
      advanceCycles: 2,
      promotionalCycles: 1,
      advanceCyclesDiscountPercent: '100',
      registrationDiscountPercent: '0',
      recurringDiscountPercent: '0',
      isSinglePayment: false,
    },
    supportedBillingTypes: ["MONTHLY_ONLY", "BOTH"],
  },
  {
    name: 'Promo: "Paga 3 meses con 10% de descuento"',
    description: "El atleta adelanta 3 meses (trimestre) recibiendo un 10% de descuento sobre ese total. Luego pagará normal.",
    details: [
      { label: "Agrupar Cuotas", value: "3" },
      { label: "Ciclos con descuento", value: "3" },
      { label: "Descuento en Cuotas Adelantadas", value: "10%" },
    ],
    planData: {
      name: 'Pago Trimestral (10% descuento)',
      advanceCycles: 3,
      promotionalCycles: 3,
      advanceCyclesDiscountPercent: '10',
      registrationDiscountPercent: '0',
      recurringDiscountPercent: '0',
      isSinglePayment: false,
    },
    supportedBillingTypes: ["MONTHLY_ONLY", "BOTH"],
  },
  {
    name: 'Beca Completa (100% Gratis Mensual)',
    description: "El atleta no pagará nunca la mensualidad, pero el sistema registrará los ciclos a $0.",
    details: [
      { label: "Descuento Cuota Recurrente", value: "100%" },
    ],
    planData: {
      name: 'Beca Completa',
      recurringDiscountPercent: '100',
      registrationDiscountPercent: '100',
      advanceCycles: 1,
      advanceCyclesDiscountPercent: '0',
      isSinglePayment: false,
    },
    supportedBillingTypes: ["MONTHLY_ONLY", "BOTH"],
  },
  {
    name: 'Pago Anual / Temporada Completa',
    description: "El atleta paga todo el año/temporada en su primer día con un descuento por pronto pago.",
    details: [
      { label: "Obligar Pago Único", value: "Activo" },
      { label: "Descuento Tarifa de Temporada", value: "15%" },
    ],
    planData: {
      name: 'Temporada Completa',
      isSinglePayment: true,
      seasonFeeDiscountPercent: '15',
      advanceCycles: 1,
      advanceCyclesDiscountPercent: '0',
    },
    supportedBillingTypes: ["SINGLE_ONLY", "BOTH"],
  }
];

interface ExamplesModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  onApplyExample: (example: Partial<IPaymentPlan>) => void;
  billingType?: string;
}

export const ExamplesModal = ({
  isOpen,
  onOpenChange,
  onClose,
  onApplyExample,
  billingType,
}: ExamplesModalProps) => {
  const filteredExamples = PAYMENT_PLAN_EXAMPLES.filter((example) =>
    billingType
      ? example.supportedBillingTypes.includes(billingType) || example.supportedBillingTypes.includes("BOTH")
      : true
  );
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container placement="auto" scroll="outside">
        <Modal.Dialog className="sm:max-w-xl bg-background-tertiary">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Ejemplos de Planes de Pago</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="p-0 md:p-6 text-sm flex flex-col gap-4">
            {filteredExamples.map((example, index) => (
              <div
                key={index}
                className="p-3 bg-background-secondary rounded-lg border border-border"
              >
                <h4 className="font-semibold text-foreground mb-1">
                  {example.name}
                </h4>
                <p className="text-muted-foreground text-xs mb-2">
                  {example.description}
                </p>
                <div className="flex justify-between items-end mt-2">
                  <ul className="list-disc list-inside text-xs text-foreground font-medium">
                    {example.details.map((detail, idx) => (
                      <li key={idx}>
                        {detail.label}:{" "}
                        <span className="text-accent-foreground">
                          {detail.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 px-3"
                    onPress={() => onApplyExample(example.planData)}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onPress={onClose}>
              Entendido
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
