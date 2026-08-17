"use client";

import {
  Drawer,
  Button,
  Select,
  Label,
  DatePicker,
  DateField,
  Calendar,
  Alert,
  ListBox,
  Spinner,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getLocalTimeZone, today } from "@internationalized/date";
import { transferShift } from "../../actions/transfer-shift";
import { getCourseSeasons, ICourseSeason } from "@/modules/course-seasons";
import { IStudentMembership } from "../../interfaces/student-membership.interface";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  membership: IStudentMembership;
}

export const TransferShiftDrawer = ({
  isOpen,
  onOpenChange,
  membership,
}: Props) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseSeasons, setCourseSeasons] = useState<ICourseSeason[]>([]);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(false);

  // Form state
  const [targetCourseSeasonId, setTargetCourseSeasonId] = useState<
    string | null
  >(null);
  const [effectiveDate, setEffectiveDate] = useState<any>(
    today(getLocalTimeZone()),
  );

  useEffect(() => {
    if (isOpen) {
      loadCourseSeasons();
      setTargetCourseSeasonId(null);
      setEffectiveDate(today(getLocalTimeZone()));
    }
  }, [isOpen]);

  const loadCourseSeasons = async () => {
    setIsLoadingSeasons(true);
    try {
      // Filtrar por el mismo curso en base a la membresía actual para simplificar la selección
      // NOTA: La validación final recae en el backend
      const res = await getCourseSeasons({
        per_page: "100",
      });

      if (!res.error) {
        // Filtrar los que pertenecen al mismo nombre de curso (asumiendo courseSeason.course.name)
        // El backend realiza validación estricta, pero esto ayuda a UX
        const sameCourseSeasons = res.data.data.filter(
          (cs) =>
            cs.course.name === membership.courseSeason.course.name &&
            cs.id !== membership.courseSeasonId &&
            cs.status === "ACTIVE" &&
            cs.isRegistrationOpen === true,
        );
        setCourseSeasons(sameCourseSeasons);
      }
    } catch (error) {
      toast.error("Error al cargar los turnos disponibles");
    } finally {
      setIsLoadingSeasons(false);
    }
  };

  const handleSubmit = async () => {
    if (!targetCourseSeasonId) {
      toast.error("Debe seleccionar un turno de destino");
      return;
    }

    if (!effectiveDate) {
      toast.error("Debe seleccionar una fecha efectiva");
      return;
    }

    setIsSubmitting(true);
    try {
      const isoDate = new Date(effectiveDate.toString()).toISOString();

      const res = await transferShift(membership.id, {
        targetCourseSeasonId,
        effectiveDate: isoDate,
      });

      if (res.error) {
        toast.error(res.message || "Error al transferir turno");
      } else {
        toast.success(res.message || "Transferencia exitosa");
        onOpenChange(false);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Error inesperado al transferir turno");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="w-full sm:max-w-md">
          <Drawer.CloseTrigger />
          <Drawer.Header className="border-b border-border">
            <Drawer.Heading className="text-lg font-bold">Transferir Turno</Drawer.Heading>
          </Drawer.Header>
          
          <Drawer.Body className="gap-6 py-5">
            <Alert status="accent">
              <Alert.Indicator>
                <HugeiconsIcon icon={InformationCircleIcon} />
              </Alert.Indicator>
              <Alert.Content>
                <Alert.Title>Información de Transferencia</Alert.Title>
                <Alert.Description>
                  <p className="mb-2">
                    Estás a punto de transferir a{" "}
                    <strong>
                      {membership.student?.person.name}{" "}
                      {membership.student?.person.lastName}
                    </strong>{" "}
                    hacia un nuevo turno.
                  </p>
                  <ul className="list-disc pl-5">
                    <li>
                      Los ciclos futuros serán trasladados al nuevo turno.
                    </li>
                    <li>
                      Los cargos y pagos existentes{" "}
                      <strong>no serán modificados</strong>.
                    </li>
                    <li>La capacidad será evaluada por el sistema.</li>
                  </ul>
                </Alert.Description>
              </Alert.Content>
            </Alert>

            <div className="flex flex-col gap-2 p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-semibold text-muted">Turno Actual</p>
              <p className="text-md font-medium">
                {membership.courseSeason.shift.name} -{" "}
                {membership.courseSeason.season.name}
              </p>
              <p className="text-sm text-muted">
                {membership.courseSeason.course.name}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Select
                value={targetCourseSeasonId}
                onChange={(key) =>
                  setTargetCourseSeasonId(key ? String(key) : null)
                }
                isDisabled={isLoadingSeasons}
                placeholder={
                  isLoadingSeasons ? "Cargando..." : "Selecciona un turno"
                }
                variant="secondary"
                className="w-full"
              >
                <Label className="text-sm font-semibold">Turno Destino</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {courseSeasons.map((cs) => (
                      <ListBox.Item
                        key={cs.id}
                        id={cs.id}
                        textValue={`${cs.shift.name} - ${cs.season.name}`}
                      >
                        {cs.shift.name} - {cs.season.name} ({cs.category?.name})
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <DatePicker
                value={effectiveDate}
                onChange={setEffectiveDate}
                isRequired
                className="w-full"
              >
                <Label className="text-sm font-semibold">Fecha Efectiva</Label>
                <DateField.Group variant="secondary">
                  <DateField.Input>
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                  <DateField.Suffix>
                    <DatePicker.Trigger>
                      <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                  </DateField.Suffix>
                </DateField.Group>
                <DatePicker.Popover>
                  <Calendar />
                </DatePicker.Popover>
              </DatePicker>
              <p className="text-xs text-muted">
                ¿Desde qué fecha el alumno ocupará un cupo en el turno destino?
              </p>
            </div>
          </Drawer.Body>

          <Drawer.Footer className="border-t border-border">
            <Button
              slot="close"
              variant="secondary"
              onPress={() => onOpenChange(false)}
              isDisabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onPress={handleSubmit} isDisabled={isSubmitting}>
              {isSubmitting && <Spinner size="sm" className="text-current" />}
              {isSubmitting ? "Transfiriendo..." : "Confirmar Transferencia"}
            </Button>
          </Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
