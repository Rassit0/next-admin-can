"use client";

import {
  Drawer,
  Button,
  TextField,
  InputGroup,
  Label,
  Select,
  ListBox,
  Alert,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Note01Icon as HistoryIcon,
  Money01Icon,
  Calendar02Icon,
} from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/shared/providers/PermissionsProvider";
import {
  getRegularizableCycles,
  RegularizableCycle,
} from "../../actions/get-regularizable-cycles";
import { regularizeHistoricalCharge } from "../../actions/regularize-historical-charge";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  membershipId: string;
  type: "membership" | "student";
}

export const RegularizeHistoricalChargeDrawer = ({
  isOpen,
  onOpenChange,
  membershipId,
  type,
}: Props) => {
  const router = useRouter();
  const permissions = usePermissions();

  const [isLoadingCycles, setIsLoadingCycles] = useState(false);
  const [cycles, setCycles] = useState<RegularizableCycle[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Override amount handling
  const [useOverride, setUseOverride] = useState(false);
  const [overrideAmount, setOverrideAmount] = useState<string>("");

  const hasOverridePermission =
    type === "membership"
      ? permissions.includes("OVERRIDE_MEMBERSHIP_CHARGES")
      : permissions.includes("OVERRIDE_STUDENT_CHARGES");

  useEffect(() => {
    if (isOpen) {
      loadCycles();
      // Reset state on open
      setSelectedCycleId("");
      setUseOverride(false);
      setOverrideAmount("");
    }
  }, [isOpen]);

  const loadCycles = async () => {
    setIsLoadingCycles(true);
    try {
      const res = await getRegularizableCycles(type, membershipId);
      if (res.error) {
        toast.error(res.message);
        setCycles([]);
      } else {
        setCycles(res.data || []);
      }
    } catch (e) {
      toast.error("Ocurrió un error al cargar los ciclos regularizables.");
      setCycles([]);
    } finally {
      setIsLoadingCycles(false);
    }
  };

  const selectedCycle = cycles.find((c) => c.cycleId === selectedCycleId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCycleId) {
      toast.error("Selecciona un ciclo para regularizar.");
      return;
    }
    
    let parsedOverrideAmount: number | undefined = undefined;
    if (hasOverridePermission && useOverride && overrideAmount !== "") {
      parsedOverrideAmount = Number(overrideAmount);
      if (isNaN(parsedOverrideAmount) || parsedOverrideAmount < 0) {
        toast.error("El monto modificado no es válido.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await regularizeHistoricalCharge({
        type,
        membershipId,
        cycleId: selectedCycleId,
        overrideAmount: parsedOverrideAmount,
      });

      if (res.error) {
        if (res.statusCode === 409) {
          toast.error("Este ciclo ya fue regularizado por otro usuario o sistema. Por favor actualiza la vista.");
          loadCycles();
          router.refresh();
        } else if (res.statusCode === 403) {
          toast.error("No tienes autorización para modificar el importe histórico.");
        } else {
          toast.error(res.message || "Error al regularizar el cargo.");
        }
      } else {
        toast.success(res.message || "Regularización histórica creada exitosamente.");
        router.refresh();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado al regularizar el cargo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="w-full sm:max-w-md">
          <Drawer.CloseTrigger />
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <Drawer.Header className="border-b border-border">
              <div>
                <Drawer.Heading className="text-lg font-bold flex items-center gap-2">
                  <HugeiconsIcon icon={HistoryIcon} />
                  Regularizar Cuota Histórica
                </Drawer.Heading>
                <p className="mt-1 text-xs font-medium text-muted">
                  Registra un cargo oficial atrasado o histórico.
                </p>
              </div>
            </Drawer.Header>

            <Drawer.Body className="flex flex-col gap-5 pt-6">
              {isLoadingCycles ? (
                <div className="flex justify-center p-4">
                  <p className="text-sm text-muted">Cargando ciclos disponibles...</p>
                </div>
              ) : cycles.length === 0 ? (
                <Alert color="warning">
                  No existen cuotas históricas pendientes de regularización para esta membresía.
                </Alert>
              ) : (
                <>
                  <Select
                    name="cycleId"
                    placeholder="Selecciona un ciclo"
                    selectedKey={selectedCycleId || undefined}
                    onSelectionChange={(key) => setSelectedCycleId(key as string)}
                    isRequired
                    className="w-full"
                  >
                    <Label>Ciclo a regularizar</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {cycles.map((cycle) => (
                          <ListBox.Item
                            key={cycle.cycleId}
                            id={cycle.cycleId}
                            textValue={`${cycle.title} (Bs ${cycle.amount})`}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {cycle.title}
                              </span>
                              <span className="text-xs text-muted">
                                Importe oficial: Bs {Number(cycle.amount).toFixed(2)}
                              </span>
                            </div>
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  {selectedCycle && (
                    <div className="bg-default-100 p-4 rounded-lg flex justify-between items-center">
                      <span className="text-sm font-medium">Importe oficial:</span>
                      <span className="text-lg font-bold">
                        Bs {Number(selectedCycle.amount).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {selectedCycle && hasOverridePermission && (
                    <div className="flex flex-col gap-3 mt-4">
                      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useOverride}
                          onChange={(e) => setUseOverride(e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        Modificar importe histórico (Excepción administrativa)
                      </label>
                      
                      {useOverride && (
                        <div className="pl-6 flex flex-col gap-2">
                          <Alert color="warning" className="text-xs mb-2">
                            Estás a punto de alterar el importe oficial de esta cuota. Esta acción quedará registrada en auditoría.
                          </Alert>
                          <TextField
                            name="overrideAmount"
                            isRequired={useOverride}
                            className="w-full"
                          >
                            <Label className="text-sm font-semibold">
                              Nuevo Importe (Bs)
                            </Label>
                            <InputGroup>
                              <InputGroup.Prefix>
                                <span className="text-muted-foreground font-bold text-sm">Bs</span>
                              </InputGroup.Prefix>
                              <InputGroup.Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={overrideAmount}
                                onChange={(e) => setOverrideAmount(e.target.value)}
                                placeholder="Ej. 150.00"
                              />
                            </InputGroup>
                          </TextField>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {selectedCycle && (
                    <div className="mt-4 border-t border-border pt-4 text-sm">
                      <p className="font-semibold mb-2">Resumen de la acción:</p>
                      <p className="text-muted">
                        Se generará un cargo PENDIENTE correspondiente al ciclo{" "}
                        <strong className="text-foreground">{selectedCycle.year} - Mes {selectedCycle.month}</strong>{" "}
                        por el importe de{" "}
                        <strong className="text-foreground">
                          Bs {hasOverridePermission && useOverride && overrideAmount !== "" ? Number(overrideAmount).toFixed(2) : Number(selectedCycle.amount).toFixed(2)}
                        </strong>.
                      </p>
                    </div>
                  )}
                </>
              )}
            </Drawer.Body>

            <Drawer.Footer className="border-t border-border flex justify-end gap-2">
              <Button
                variant="outline"
                onPress={() => onOpenChange(false)}
                isDisabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isDisabled={isSubmitting || isLoadingCycles || cycles.length === 0 || !selectedCycleId}
                isPending={isSubmitting}
              >
                Regularizar Cargo
              </Button>
            </Drawer.Footer>
          </form>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
