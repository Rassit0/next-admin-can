"use client";

import {
  Button,
  Modal,
  useOverlayState,
  Table,
  Spinner,
  Chip,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PieChartIcon,
  Alert01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import React, { useState, useEffect } from "react";
import { getCycleCapacity, CycleCapacity } from "@/modules/course-seasons/actions/get-cycle-capacity";

interface Props {
  courseSeasonId: string;
}

export const CycleCapacityModal = ({ courseSeasonId }: Props) => {
  const state = useOverlayState();
  const [data, setData] = useState<CycleCapacity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getCycleCapacity(courseSeasonId);
      if (res.error) {
        setError(res.message);
      } else if (res.data) {
        // Ordenar por turno y luego por fecha
        const sortedData = [...res.data].sort((a, b) => {
          const shiftCompare = a.shiftName.localeCompare(b.shiftName);
          if (shiftCompare !== 0) return shiftCompare;
          return new Date(a.cycleStartDate).getTime() - new Date(b.cycleStartDate).getTime();
        });
        setData(sortedData);
      }
    } catch (err) {
      setError("Error inesperado al cargar la capacidad.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (state.isOpen) {
      loadData();
    } else {
      setData([]);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isOpen]);

  // Asegurar que la fecha se formatea sin shift de timezone (considerando que vienen en UTC a las 00:00:00)
  const formatCycleDate = (dateString: string) => {
    // Si viene sin Z, asume local, lo forzamos a UTC para mostrar exactamente el mes/año
    const normalized = dateString.endsWith("Z") ? dateString : `${dateString}Z`;
    const date = new Date(normalized);
    const formatter = new Intl.DateTimeFormat("es-ES", {
      timeZone: "UTC",
      month: "long",
      year: "numeric",
    });
    const formatted = formatter.format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <Modal>
      <Button
        size="sm"
        variant="secondary"
        onPress={() => state.open()}
        className="font-bold text-xs"
      >
        <HugeiconsIcon icon={PieChartIcon} size={16} />
        Ver Cupos
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="inside">
          <Modal.Dialog className="sm:max-w-3xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <HugeiconsIcon icon={PieChartIcon} />
              </Modal.Icon>
              <Modal.Heading>Capacidad por Ciclo</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Visualización general de cupos ocupados y disponibles por turno.
              </p>
            </Modal.Header>
            <Modal.Body className="p-0 md:p-6 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-8 gap-4">
                  <Spinner size="lg" />
                  <p className="text-sm text-muted-foreground">Cargando cupos...</p>
                </div>
              ) : error ? (
                <div className="p-6">
                  <div className="flex flex-col items-center justify-center text-center p-6 bg-error-container/20 rounded-xl border border-error/20 gap-4">
                    <HugeiconsIcon icon={Alert01Icon} size={32} className="text-error" />
                    <p className="text-sm text-foreground font-medium">{error}</p>
                    <Button size="sm" variant="secondary" onPress={loadData}>
                      <HugeiconsIcon icon={RefreshIcon} size={16} /> Reintentar
                    </Button>
                  </div>
                </div>
              ) : data.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No se encontraron ciclos ni turnos.
                </div>
              ) : (
                <Table>
                  <Table.ScrollContainer>
                    <Table.Content aria-label="Capacidad de Ciclos" className="min-w-full">
                      <Table.Header className="bg-surface-secondary">
                        <Table.Column id="cycle">
                          <span className="text-xs font-semibold uppercase tracking-wide">Ciclo</span>
                        </Table.Column>
                        <Table.Column id="shift">
                          <span className="text-xs font-semibold uppercase tracking-wide">Turno</span>
                        </Table.Column>
                        <Table.Column id="capacity" className="text-right">
                          <span className="text-xs font-semibold uppercase tracking-wide">Capacidad</span>
                        </Table.Column>
                        <Table.Column id="occupied" className="text-right">
                          <span className="text-xs font-semibold uppercase tracking-wide">Ocupados</span>
                        </Table.Column>
                        <Table.Column id="available" className="text-right">
                          <span className="text-xs font-semibold uppercase tracking-wide">Disponibles</span>
                        </Table.Column>
                        <Table.Column id="status">
                          <span className="text-xs font-semibold uppercase tracking-wide">Estado</span>
                        </Table.Column>
                      </Table.Header>
                      <Table.Body
                        items={data}
                        className="divide-y divide-border/50"
                      >
                        {(item) => {
                          const isUnlimited = item.maxMembers === null;
                          return (
                            <Table.Row key={`${item.shiftId}-${item.cycleStartDate}`}>
                              <Table.Cell>
                                <span className="font-medium text-foreground">
                                  {formatCycleDate(item.cycleStartDate)}
                                </span>
                              </Table.Cell>
                              <Table.Cell>
                                <span className="text-on-surface-variant font-medium">
                                  {item.shiftName}
                                </span>
                              </Table.Cell>
                              <Table.Cell className="text-right">
                                {isUnlimited ? (
                                  <span className="text-muted-foreground italic text-sm">Ilimitada</span>
                                ) : (
                                  <span className="font-semibold">{item.maxMembers}</span>
                                )}
                              </Table.Cell>
                              <Table.Cell className="text-right">
                                <span className="font-semibold text-foreground">{item.occupiedSpots}</span>
                              </Table.Cell>
                              <Table.Cell className="text-right">
                                {isUnlimited ? (
                                  <span className="text-muted-foreground">--</span>
                                ) : (
                                  <span className="font-semibold">{item.availableSpots}</span>
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                <Chip
                                  variant="soft"
                                  color={item.status === "AVAILABLE" ? "success" : "danger"}
                                  size="sm"
                                  className="font-bold"
                                >
                                  {item.status === "AVAILABLE" ? "Disponible" : "Lleno"}
                                </Chip>
                              </Table.Cell>
                            </Table.Row>
                          );
                        }}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
