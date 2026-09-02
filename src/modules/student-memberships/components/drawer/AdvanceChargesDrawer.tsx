"use client";

import {
  Drawer,
  Button,
  Label,
  Alert,
  CheckboxGroup,
  Checkbox,
  DatePicker,
  DateField,
  Calendar,
  Card,
  Chip,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Money01Icon, Alert01Icon } from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";
import {
  DateValue,
  getLocalTimeZone,
  today,
  CalendarDate,
} from "@internationalized/date";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { previewAdvanceCharges } from "../../actions/preview-advance-charges";
import { generateAdvanceCharges } from "../../actions/generate-advance-charges";
import {
  getAvailableCycles,
  AvailableCycle,
} from "../../actions/get-available-cycles";
import { getStudentMembershipById } from "../../actions/get-by-id";
import {
  getCycleCapacity,
  CycleCapacity,
} from "@/modules/course-seasons/actions/get-cycle-capacity";
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

  const [availableCycles, setAvailableCycles] = useState<AvailableCycle[]>([]);
  const [selectedCycles, setSelectedCycles] = useState<string[]>([]);
  const [debouncedSelectedCycles] = useDebounce(selectedCycles, 500);

  const [enrollmentDates, setEnrollmentDates] = useState<
    Record<string, DateValue>
  >({});
  const [debouncedEnrollmentDates] = useDebounce(enrollmentDates, 500);

  const [isLoadingCycles, setIsLoadingCycles] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const [previewData, setPreviewData] = useState<
    IPreviewChargesResponse["data"] | null
  >(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [cycleCapacities, setCycleCapacities] = useState<CycleCapacity[]>([]);
  const [isLoadingCapacity, setIsLoadingCapacity] = useState(false);
  const [capacityError, setCapacityError] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCycles();
    } else {
      setAvailableCycles([]);
      setSelectedCycles([]);
      setEnrollmentDates({});
      setPreviewData(null);
      setPreviewError(null);
      setCycleCapacities([]);
      setCapacityError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadCycles = async () => {
    setIsLoadingCycles(true);
    setIsLoadingCapacity(true);
    setCapacityError(null);
    try {
      // 1. Fetch available cycles
      const res = await getAvailableCycles(studentMembershipId);
      if (!res.error && res.data) {
        setAvailableCycles(res.data);
      }

      // 2. Fetch membership to get courseSeasonId and courseSeasonShiftId
      const membershipRes = await getStudentMembershipById({
        id: studentMembershipId,
      });
      if (!membershipRes.error && membershipRes.data) {
        const { courseSeasonId, courseSeasonShiftId } = membershipRes.data;
        if (courseSeasonId && courseSeasonShiftId) {
          // 3. Fetch cycle capacities
          const capacityRes = await getCycleCapacity(
            courseSeasonId,
            courseSeasonShiftId,
          );
          if (!capacityRes.error && capacityRes.data) {
            setCycleCapacities(capacityRes.data);
          } else if (capacityRes.error) {
            setCapacityError(
              "No se pudo consultar la disponibilidad de cupos.",
            );
          }
        }
      } else {
        setCapacityError("No se pudo consultar la disponibilidad de cupos.");
      }
    } catch (err) {
      setCapacityError("No se pudo consultar la disponibilidad de cupos.");
    } finally {
      setIsLoadingCycles(false);
      setIsLoadingCapacity(false);
    }
  };

  useEffect(() => {
    if (isOpen && debouncedSelectedCycles.length > 0) {
      loadPreview(debouncedSelectedCycles, debouncedEnrollmentDates);
    } else if (debouncedSelectedCycles.length === 0) {
      setPreviewData(null);
      setPreviewError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSelectedCycles, debouncedEnrollmentDates, isOpen]);

  const getDefaultDateForCycle = (cycle: AvailableCycle) => {
    const t = today(getLocalTimeZone());
    const now = new Date(t.toString());
    const start = new Date(cycle.cycleStartDate);
    const end = new Date(cycle.cycleEndDate);

    if (now >= start && now <= end) {
      return t;
    }

    return new CalendarDate(
      start.getUTCFullYear(),
      start.getUTCMonth() + 1,
      start.getUTCDate(),
    );
  };

  const loadPreview = async (
    cycles: string[],
    dates: Record<string, DateValue>,
  ) => {
    setIsLoadingPreview(true);
    setPreviewError(null);
    try {
      const res = await previewAdvanceCharges(studentMembershipId, {
        cycles: cycles.map((c) => {
          const cycleObj = availableCycles.find(
            (ac) => ac.cycleStartDate.toString() === c,
          );
          const defaultDate = cycleObj
            ? getDefaultDateForCycle(cycleObj)
            : today(getLocalTimeZone());
          return {
            cycleStartDate: new Date(c).toISOString(),
            enrollmentDate: (dates[c]
              ? new Date(dates[c].toString())
              : new Date(defaultDate.toString())
            ).toISOString(),
          };
        }),
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
        cycles: debouncedSelectedCycles.map((c) => {
          const cycleObj = availableCycles.find(
            (ac) => ac.cycleStartDate.toString() === c,
          );
          const defaultDate = cycleObj
            ? getDefaultDateForCycle(cycleObj)
            : today(getLocalTimeZone());
          return {
            cycleStartDate: new Date(c).toISOString(),
            enrollmentDate: (enrollmentDates[c]
              ? new Date(enrollmentDates[c].toString())
              : new Date(defaultDate.toString())
            ).toISOString(),
          };
        }),
      });

      if (res.error) {
        toast.error(res.message);
        setShowConfirm(false);
        // If the backend rejects (e.g. because of capacity), refresh cycles and capacities
        loadCycles();
      } else {
        toast.success(res.message);
        router.refresh();
        setSelectedCycles([]);
        setShowConfirm(false);
        // Refresh cycles and capacities after successful purchase
        loadCycles();
        // Return without closing if we want to stay open, or we can close it
        // The original logic closed it, we will keep it closing:
        onOpenChange(false);
      }
    } catch (error) {
      toast.error(
        "Ocurrió un error inesperado al realizar la compra de los ciclos.",
      );
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
                Inscribe al estudiante en el siguiente ciclo (mes) de esta
                colegiatura.
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
                      {previewData &&
                        formatCurrency(previewData.breakdown.totalNetAmount)}
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
                      Esta acción buscará el siguiente mes (ciclo) disponible de
                      la temporada al que aún no estás inscrito y te generará la
                      cuota correspondiente. Úsalo para continuar en el curso.
                    </Alert.Description>
                  </Alert.Content>
                </Alert>

                {isLoadingCycles ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : availableCycles.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">
                      Selecciona los ciclos (meses)
                    </Label>

                    {capacityError && (
                      <Alert status="danger" className="mb-2">
                        <Alert.Indicator />
                        <Alert.Content>
                          <Alert.Description>
                            {capacityError}
                            <Button
                              size="sm"
                              variant="secondary"
                              className="ml-2 mt-1"
                              onPress={loadCycles}
                            >
                              Reintentar
                            </Button>
                          </Alert.Description>
                        </Alert.Content>
                      </Alert>
                    )}

                    {isLoadingCapacity && !capacityError && (
                      <p className="text-xs text-muted-foreground animate-pulse mb-2">
                        Cargando cupos...
                      </p>
                    )}

                    <CheckboxGroup
                      value={selectedCycles}
                      onChange={(val) => setSelectedCycles(val as string[])}
                      className="w-full flex flex-col gap-2"
                    >
                      {availableCycles.map((cycle) => {
                        const isSelected = selectedCycles.includes(
                          cycle.cycleStartDate.toString(),
                        );

                        const normalizeUtc = (dateValue: string | Date) => {
                          try {
                            return new Date(dateValue).toISOString();
                          } catch (e) {
                            return dateValue.toString();
                          }
                        };

                        // Cross-reference capacity by matching both startDate and endDate normalized
                        const capacityMatch = cycleCapacities.find(
                          (c) =>
                            normalizeUtc(c.cycleStartDate) ===
                              normalizeUtc(cycle.cycleStartDate) &&
                            normalizeUtc(c.cycleEndDate) ===
                              normalizeUtc(cycle.cycleEndDate),
                        );

                        const isFull = capacityMatch?.status === "FULL";
                        // If capacityError is present, or capacity is loading, or we couldn't find a capacity match
                        // for this specific cycle, we disable it.
                        const isUnknownCapacity =
                          !isLoadingCapacity &&
                          !capacityError &&
                          !capacityMatch;
                        
                        const isEnrolled = !!cycle.isEnrolled;

                        const isDisabled =
                          isFull ||
                          isLoadingCapacity ||
                          !!capacityError ||
                          isUnknownCapacity ||
                          isEnrolled;

                        return (
                          <Card key={cycle.cycleStartDate} variant="secondary">
                            <Card.Content className="flex flex-col gap-2 p-0">
                              <Checkbox
                                value={cycle.cycleStartDate.toString()}
                                isDisabled={isDisabled}
                              >
                                <Checkbox.Content className="w-full flex justify-between items-center pr-4">
                                  <div className="flex items-center">
                                    <Checkbox.Control>
                                      <Checkbox.Indicator />
                                    </Checkbox.Control>
                                    <Label className="font-semibold ml-2">
                                      {new Date(cycle.cycleStartDate)
                                        .toLocaleDateString("es-BO", {
                                          month: "long",
                                          year: "numeric",
                                          timeZone: "UTC",
                                        })
                                        .replace(/^\w/, (c) => c.toUpperCase())}
                                    </Label>
                                  </div>

                                  {isFull && (
                                    <Chip
                                      size="sm"
                                      color="danger"
                                      variant="soft"
                                      className="font-bold"
                                    >
                                      Lleno
                                    </Chip>
                                  )}
                                  {capacityMatch?.status === "AVAILABLE" && !isEnrolled && (
                                    <Chip
                                      size="sm"
                                      color="success"
                                      variant="soft"
                                      className="font-bold"
                                    >
                                      Disponible
                                    </Chip>
                                  )}
                                  {isEnrolled && (
                                    <Chip
                                      size="sm"
                                      color="warning"
                                      variant="soft"
                                      className="font-bold"
                                    >
                                      Ya inscrito
                                    </Chip>
                                  )}
                                  {isUnknownCapacity && (
                                    <Chip
                                      size="sm"
                                      color="default"
                                      variant="soft"
                                      className="font-bold"
                                    >
                                      Sin info
                                    </Chip>
                                  )}
                                </Checkbox.Content>
                              </Checkbox>

                              {isSelected && (
                                <div className="pl-7 mt-1">
                                  <Label className="text-xs mb-1">
                                    Fecha de Inscripción (Prorrateo)
                                  </Label>
                                  <DatePicker
                                    value={
                                      enrollmentDates[
                                        cycle.cycleStartDate.toString()
                                      ] || getDefaultDateForCycle(cycle)
                                    }
                                    onChange={(date) => {
                                      if (date) {
                                        setEnrollmentDates((prev) => ({
                                          ...prev,
                                          [cycle.cycleStartDate.toString()]:
                                            date,
                                        }));
                                      }
                                    }}
                                    className="w-full max-w-xs"
                                  >
                                    <DateField.Group>
                                      <DateField.Input className="text-sm">
                                        {(segment) => (
                                          <DateField.Segment
                                            segment={segment}
                                          />
                                        )}
                                      </DateField.Input>
                                      <DateField.Suffix>
                                        <DatePicker.Trigger>
                                          <DatePicker.TriggerIndicator />
                                        </DatePicker.Trigger>
                                      </DateField.Suffix>
                                    </DateField.Group>
                                    <DatePicker.Popover>
                                      <Calendar aria-label="Seleccionar fecha">
                                        <Calendar.Header>
                                          <Calendar.YearPickerTrigger>
                                            <Calendar.YearPickerTriggerHeading />
                                            <Calendar.YearPickerTriggerIndicator />
                                          </Calendar.YearPickerTrigger>
                                          <Calendar.NavButton slot="previous" />
                                          <Calendar.NavButton slot="next" />
                                        </Calendar.Header>
                                        <Calendar.Grid>
                                          <Calendar.GridHeader>
                                            {(day) => (
                                              <Calendar.HeaderCell>
                                                {day}
                                              </Calendar.HeaderCell>
                                            )}
                                          </Calendar.GridHeader>
                                          <Calendar.GridBody>
                                            {(date) => (
                                              <Calendar.Cell date={date} />
                                            )}
                                          </Calendar.GridBody>
                                        </Calendar.Grid>
                                        <Calendar.YearPickerGrid>
                                          <Calendar.YearPickerGridBody>
                                            {({ year }) => (
                                              <Calendar.YearPickerCell
                                                year={year}
                                              />
                                            )}
                                          </Calendar.YearPickerGridBody>
                                        </Calendar.YearPickerGrid>
                                      </Calendar>
                                    </DatePicker.Popover>
                                  </DatePicker>
                                </div>
                              )}
                            </Card.Content>
                          </Card>
                        );
                      })}
                    </CheckboxGroup>
                  </div>
                ) : (
                  <Alert status="warning" className="mb-2">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Title>Sin ciclos disponibles</Alert.Title>
                      <Alert.Description>
                        No hay más ciclos futuros disponibles en esta temporada
                        para inscribirse por adelantado.
                      </Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}

                <div className="flex flex-col gap-3 mt-4">
                  <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                    Previsualización
                  </h4>

                  {isLoadingPreview ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : previewError ? (
                    <div className="bg-danger/10 text-danger p-4 rounded-xl text-sm flex gap-3">
                      <HugeiconsIcon
                        icon={Alert01Icon}
                        size={18}
                        className="shrink-0 mt-0.5"
                      />
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
                              <span className="font-medium">
                                {charge.description}
                              </span>
                              <span className="text-xs text-muted">
                                Vence:{" "}
                                {new Date(charge.dueDate).toLocaleDateString()}
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
                            {formatCurrency(
                              previewData.breakdown.totalBaseAmount,
                            )}
                          </span>
                        </div>
                        {previewData.breakdown.totalDiscount > 0 && (
                          <div className="flex justify-between items-center text-sm text-success">
                            <span>Descuentos:</span>
                            <span className="font-medium">
                              -
                              {formatCurrency(
                                previewData.breakdown.totalDiscount,
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-border/50">
                          <span className="font-bold text-foreground">
                            Total:
                          </span>
                          <span className="font-bold text-primary">
                            {formatCurrency(
                              previewData.breakdown.totalNetAmount,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted text-center py-4">
                      Selecciona al menos un ciclo para ver la previsualización.
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
