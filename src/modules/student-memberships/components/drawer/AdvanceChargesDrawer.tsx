"use client";

import {
  Drawer,
  Button,
  TextField,
  Label,
  InputGroup,
  NumberField,
  Alert,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Money01Icon,
  Alert01Icon,
} from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { previewAdvanceCharges } from "../../actions/preview-advance-charges";
import { generateAdvanceCharges } from "../../actions/generate-advance-charges";
import { useDebounce } from "use-debounce";
import { IPreviewChargesResponse } from "@/modules/player-memberships";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  studentMembershipId: string;
}

export const AdvanceChargesDrawer = ({
  isOpen,
  onOpenChange,
  studentMembershipId,
}: Props) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [debouncedQuantity] = useDebounce(quantity, 500);

  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewData, setPreviewData] =
    useState<IPreviewChargesResponse["data"] | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && debouncedQuantity > 0) {
      loadPreview(debouncedQuantity);
    } else {
      setPreviewData(null);
      setPreviewError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuantity, isOpen]);

  const loadPreview = async (qty: number) => {
    setIsLoadingPreview(true);
    setPreviewError(null);
    try {
      const res = await previewAdvanceCharges(studentMembershipId, {
        quantity: qty,
      });
      if (res.error) {
        setPreviewError(res.message);
        setPreviewData(null);
      } else {
        setPreviewData(res.data!);
        if (res.data!.charges.length === 0) {
          setPreviewError("No hay cuotas disponibles para adelantar.");
        }
      }
    } catch (error) {
      setPreviewError("Ocurrió un error al obtener la previsualización.");
      setPreviewData(null);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateAdvanceCharges(studentMembershipId, {
        quantity: debouncedQuantity,
      });

      if (res.error) {
        toast.error(res.message);
        setShowConfirm(false);
      } else {
        toast.success(res.message);
        router.refresh();
        setQuantity(1);
        setShowConfirm(false);
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado al realizar la compra de los ciclos.");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Drawer.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) setShowConfirm(false);
        onOpenChange(open);
      }}
    >
      <Drawer.Content placement="right">
        <Drawer.Dialog className="w-full sm:max-w-md flex flex-col">
          <Drawer.CloseTrigger />
          <Drawer.Header className="border-b border-border">
            <div>
              <Drawer.Heading className="text-lg font-bold flex items-center gap-2">
                <HugeiconsIcon icon={Money01Icon} />
                Inscripción a Ciclo
              </Drawer.Heading>
              <p className="mt-1 text-xs font-medium text-muted">
                Inscribe al estudiante en el siguiente ciclo (mes) de esta colegiatura.
              </p>
            </div>
          </Drawer.Header>

          <Drawer.Body className="flex flex-col gap-6 pt-6 overflow-y-auto">
            {showConfirm ? (
              <div className="flex flex-col gap-4 items-center text-center justify-center h-full">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <HugeiconsIcon icon={Alert01Icon} size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    ¿Confirmar inscripción?
                  </h3>
                  <p className="text-sm text-muted mt-2">
                    Estás a punto de inscribir{" "}
                    <strong>{previewData?.charges.length} ciclos</strong> por un
                    total de{" "}
                    <strong>
                      {previewData && formatCurrency(previewData.breakdown.totalNetAmount)}
                    </strong>
                    .
                  </p>
                  <p className="text-xs text-muted mt-2">
                    Esta acción creará los cargos en el sistema y no se puede
                    deshacer automáticamente.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Alert status="accent" className="mb-2">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Acerca de la Inscripción</Alert.Title>
                    <Alert.Description>
                      Esta acción buscará el siguiente mes (ciclo) disponible de la temporada al que aún no estás inscrito y te generará la cuota correspondiente. Úsalo para continuar en el curso.
                    </Alert.Description>
                  </Alert.Content>
                </Alert>

                <NumberField
                  name="quantity"
                  isRequired
                  className="w-full"
                  variant="secondary"
                  value={quantity}
                  onChange={(val) => setQuantity(Number(val) || 0)}
                  minValue={1}
                >
                  <Label className="text-sm font-semibold">
                    Cantidad de ciclos a comprar
                  </Label>
                  <InputGroup>
                    <InputGroup.Input
                      className="h-10 border border-border/50 text-sm focus:border-primary/50"
                      placeholder="Ej. 3"
                    />
                  </InputGroup>
                </NumberField>

                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                    Previsualización
                  </h4>

                  {isLoadingPreview ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : previewError ? (
                    <div className="bg-danger/10 text-danger p-4 rounded-xl text-sm flex gap-3">
                      <HugeiconsIcon icon={Alert01Icon} size={18} className="shrink-0 mt-0.5" />
                      <p>{previewError}</p>
                    </div>
                  ) : previewData?.charges.length ? (
                    <div className="flex flex-col gap-4">
                      <div className="bg-secondary/30 rounded-xl p-4 flex flex-col gap-3">
                        {previewData.charges.map((charge: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{charge.description}</span>
                              <span className="text-xs text-muted">
                                Vence: {new Date(charge.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="font-semibold text-foreground">
                              {formatCurrency(charge.amount)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-primary/5 rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted">Subtotal:</span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(previewData.breakdown.totalBaseAmount)}
                          </span>
                        </div>
                        {previewData.breakdown.totalDiscount > 0 && (
                          <div className="flex justify-between items-center text-sm text-success">
                            <span>Descuentos:</span>
                            <span className="font-medium">
                              -{formatCurrency(previewData.breakdown.totalDiscount)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-border/50">
                          <span className="font-bold text-foreground">Total:</span>
                          <span className="font-bold text-primary">
                            {formatCurrency(previewData.breakdown.totalNetAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted text-center py-4">
                      Ingresa una cantidad para ver la previsualización.
                    </p>
                  )}
                </div>
              </>
            )}
          </Drawer.Body>

          <Drawer.Footer className="border-t border-border mt-auto pt-4 flex gap-3 pb-6">
            <Button
              variant="secondary"
              className="w-full flex-1"
              onPress={() => {
                if (showConfirm) setShowConfirm(false);
                else onOpenChange(false);
              }}
              isDisabled={isGenerating}
            >
              Cancelar
            </Button>

            {showConfirm ? (
              <Button
                variant="primary"
                className="w-full flex-1"
                onPress={handleGenerate}
                isPending={isGenerating}
              >
                Confirmar
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-full flex-1"
                onPress={() => setShowConfirm(true)}
                isDisabled={
                  isLoadingPreview ||
                  !!previewError ||
                  !previewData?.charges.length
                }
              >
                Inscribir
              </Button>
            )}
          </Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
