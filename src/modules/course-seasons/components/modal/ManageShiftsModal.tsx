"use client";

import {
  Button,
  Modal,
  Select,
  useOverlayState,
  ListBox,
  Label
} from "@heroui/react";
import { Add01Icon, Time02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useEffect, useState } from "react";
import { ICourseSeason, IShiftOption } from "@/modules/course-seasons";
import { getShiftsOptions } from "@/modules/course-seasons/actions/get-shifts-options";
import { addShiftAction } from "@/modules/course-seasons/actions/add-shift";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  courseSeason: ICourseSeason;
}

export const ManageShiftsModal = ({ courseSeason }: Props) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);
  const [shiftsOptions, setShiftsOptions] = useState<IShiftOption[]>([]);
  const [selectedShiftId, setSelectedShiftId] = useState<string>("");

  const [maxMembers, setMaxMembers] = useState<number>(20);
  const [minMembers, setMinMembers] = useState<number>(5);
  useEffect(() => {
    if (state.isOpen) {
      getShiftsOptions().then((res) => {
        if (!res.error && res.data) {
          setShiftsOptions(res.data.data);
        }
      });
    }
  }, [state.isOpen]);

  // Filtrar los turnos que ya están asignados a esta temporada
  const assignedShiftIds = courseSeason.shifts?.map((s) => s.shift?.id).filter(Boolean) || [];
  const availableShifts = shiftsOptions.filter((opt) => !assignedShiftIds.includes(opt.id));

  const handleAddShift = async () => {
    if (!selectedShiftId) {
      toast.error("Seleccione un turno");
      return;
    }

    setLoading(true);
    const res = await addShiftAction(courseSeason.id, { shiftId: selectedShiftId, maxMembers, minMembers });
    setLoading(false);

    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      state.close();
      setSelectedShiftId("");
    }
  };

  return (
    <Modal>
      <Button
        size="sm"
        variant="secondary"
        className="font-bold text-xs w-full"
        onPress={() => state.open()}
      >
        <HugeiconsIcon icon={Add01Icon} size={14} />
        Agregar Turno
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <HugeiconsIcon icon={Time02Icon} />
              </Modal.Icon>
              <Modal.Heading>Agregar Turno Adicional</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Agrega una nueva opción logística (horario) para esta oferta.
              </p>
            </Modal.Header>
            <Modal.Body className="p-0 md:p-6">
              <div className="flex flex-col gap-4 mt-2 mb-4">
                <Select
                  placeholder="Elija un turno disponible..."
                  variant="secondary"
                  className="w-full"
                  selectedKey={selectedShiftId}
                  onSelectionChange={(key) => setSelectedShiftId(key as string)}
                  isDisabled={loading || availableShifts.length === 0}
                >
                  <Label className="text-sm font-bold mb-1 block">Seleccionar Turno</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {availableShifts.map((shift) => (
                        <ListBox.Item
                        key={shift.id}
                        id={shift.id}
                        textValue={shift.name}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold">{shift.name}</span>
                        </div>
                        <ListBox.ItemIndicator />
                      </ListBox.Item>))}
                      {availableShifts.length === 0 && (
                        <ListBox.Item key="empty" id="empty" textValue="No hay turnos disponibles" isDisabled>
                          No hay turnos adicionales disponibles
                        </ListBox.Item>
                      )}
                    </ListBox>
                  </Select.Popover>
                </Select>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold mb-1 block">Cupo Máximo</label>
                    <input
                      type="number"
                      className="w-full bg-surface-container border border-border/50 rounded-md p-2 text-sm"
                      value={maxMembers}
                      onChange={(e) => setMaxMembers(Number(e.target.value))}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block">Cupo Mínimo</label>
                    <input
                      type="number"
                      className="w-full bg-surface-container border border-border/50 rounded-md p-2 text-sm"
                      value={minMembers}
                      onChange={(e) => setMinMembers(Number(e.target.value))}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onPress={() => state.close()}
                isDisabled={loading}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onPress={handleAddShift}
                isPending={loading}
                isDisabled={!selectedShiftId}
              >
                Agregar Turno
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
