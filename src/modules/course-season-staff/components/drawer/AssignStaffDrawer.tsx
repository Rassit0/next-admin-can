"use client";
import {
  Button,
  ComboBox,
  Drawer,
  Input,
  Label,
  ListBox,
  Surface,
  Switch,
  TextField,
  toast,
  Alert,
  FieldError,
  CloseButton,
  Popover,
} from "@heroui/react";
import {
  Add01Icon,
  UserAdd01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { ICourseSeason } from "@/modules/course-seasons";
import { addCourseSeasonStaff, IStaffOption } from "@/modules/course-season-staff";
import { SelectOrCreateCourseStaff } from "../form/SelectOrCreateCourseStaff";

interface Props {
  courseSeason: ICourseSeason;
  size?: "lg" | "md" | "sm";
}

const today = () => new Date().toISOString().slice(0, 10);

const toLocalIso = (dateStr: string) => {
  if (!dateStr) return undefined;
  return new Date(`${dateStr}T00:00:00`).toISOString();
};

export const AssignStaffDrawer = ({ courseSeason, size = "md" }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [staffId, setStaffId] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<IStaffOption | null>(null);
  
  const [role, setRole] = useState<string>("HEAD_COACH");
  const [customRole, setCustomRole] = useState<string>("");
  const [startedAt, setStartedAt] = useState<string>(today());
  const [endedAt, setEndedAt] = useState<string>("");
  const [isPrimary, setIsPrimary] = useState(false);

  const [apiError, setApiError] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Validaciones
  const errors = useMemo(() => {
    const err: Record<string, string> = {};

    if (!staffId) err.staffId = "Debe seleccionar a un miembro del personal.";
    if (!role) err.role = "El rol es obligatorio.";
    if (role === "OTHER" && !customRole.trim()) {
      err.customRole = "Debe especificar el rol si seleccionó 'Otro'.";
    }
    if (!startedAt) err.startedAt = "La fecha de inicio es obligatoria.";
    
    if (endedAt && startedAt && endedAt < startedAt) {
      err.endedAt = "La fecha de fin no puede ser anterior a la de inicio.";
    }

    return err;
  }, [staffId, role, customRole, startedAt, endedAt]);

  const reset = () => {
    setStaffId(null);
    setSelectedStaff(null);
    setRole("HEAD_COACH");
    setCustomRole("");
    setStartedAt(today());
    setEndedAt("");
    setIsPrimary(false);
    setApiError(null);
  };

  const handleRemoveError = (fieldName: string) => {
    // In this component, errors are derived from useMemo,
    // so we can't directly remove them from state.
    // However, since the Select component expects this prop, we can provide it.
    // The useMemo hook will automatically clear the error when the value is updated.
  };

  const handleSubmit = async () => {
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const res = await addCourseSeasonStaff({
      courseSeasonId: courseSeason.id,
      staffId: staffId!,
      role,
      customRole: role === "OTHER" ? customRole : undefined,
      startedAt: toLocalIso(startedAt)!,
      endedAt: endedAt ? toLocalIso(endedAt) : undefined,
      isPrimary,
    });
    setLoading(false);

    if (res.error) {
      setApiError({
        title: res.message,
        description: res.errors
          ? Object.values(res.errors).flat().join(", ")
          : res.message,
      });
      return;
    }

    setApiError(null);
    setIsOpen(false);
    toast.success(res.message, {
      description: selectedStaff
        ? `${selectedStaff.fullName} asignado como ${role}.`
        : undefined,
    });
    reset();
  };

  const InfoTooltip = ({ text }: { text: string }) => (
    <Popover>
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        className="h-5 w-5 min-w-5 text-muted-foreground ml-2"
      >
        <HugeiconsIcon icon={InformationCircleIcon} size={14} />
      </Button>
      <Popover.Content placement="top">
        <Popover.Dialog className="max-w-50 px-3 py-2">
          <Popover.Arrow />
          <p className="text-xs font-normal normal-case tracking-normal text-foreground">
            {text}
          </p>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );

  return (
    <>
      <Button
        size={size}
        className="w-full bg-primary text-primary-foreground font-semibold text-sm shadow-md shadow-primary-soft-hover hover:shadow-lg hover:scale-[1.01] active:scale-95 transition-all"
        onPress={() => setIsOpen(true)}
      >
        <HugeiconsIcon icon={UserAdd01Icon} size={18} />
        Asignar Personal
      </Button>

      <Drawer.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Content placement="right">
          <Drawer.Dialog className="w-full sm:max-w-md">
            <Drawer.CloseTrigger />
            <Drawer.Header className="border-b border-border">
              <div>
                <Drawer.Heading className="text-lg font-bold">
                  Asignar personal
                </Drawer.Heading>
                <p className="mt-1 text-xs font-medium text-muted">
                  {courseSeason.course.name} · {courseSeason.season.name}
                </p>
              </div>
            </Drawer.Header>

            <Drawer.Body className="gap-5">
              <Surface variant="transparent" className="flex flex-col gap-5">
                {apiError && (
                  <Alert status="danger" className="mb-2">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Title>{apiError.title}</Alert.Title>
                      <Alert.Description>
                        {apiError.description}
                      </Alert.Description>
                    </Alert.Content>
                    <CloseButton onPress={() => setApiError(null)} />
                  </Alert>
                )}

                <SelectOrCreateCourseStaff
                  label="Personal"
                  courseSeasonId={courseSeason.id}
                  staffId={staffId}
                  setStaffId={setStaffId}
                  errors={errors}
                  handleRemoveError={handleRemoveError}
                />

                <ComboBox
                  className="w-full"
                  variant="secondary"
                  menuTrigger="focus"
                  selectedKey={role}
                  onSelectionChange={(key) => setRole(key ? String(key) : "HEAD_COACH")}
                  isInvalid={!!errors.role || undefined}
                >
                  <Label className="text-sm font-semibold flex items-center">
                    Rol
                  </Label>
                  <ComboBox.InputGroup>
                    <Input variant="secondary" />
                    <ComboBox.Trigger />
                  </ComboBox.InputGroup>
                  <ComboBox.Popover>
                    <ListBox>
                      <ListBox.Item id="HEAD_COACH" textValue="Profesor Principal (Head Coach)">
                        Profesor Principal (Head Coach)
                      </ListBox.Item>
                      <ListBox.Item id="ASSISTANT_COACH" textValue="Profesor Asistente">
                        Profesor Asistente
                      </ListBox.Item>
                      <ListBox.Item id="ASSISTANT" textValue="Auxiliar / Asistente">
                        Auxiliar / Asistente
                      </ListBox.Item>
                      <ListBox.Item id="DELEGATE" textValue="Delegado">
                        Delegado
                      </ListBox.Item>
                      <ListBox.Item id="VOLUNTEER" textValue="Voluntario">
                        Voluntario
                      </ListBox.Item>
                      <ListBox.Item id="OTHER" textValue="Otro (Especificar)">
                        Otro (Especificar)
                      </ListBox.Item>
                    </ListBox>
                  </ComboBox.Popover>
                </ComboBox>

                {role === "OTHER" && (
                  <TextField
                    className="w-full"
                    isInvalid={!!errors.customRole || undefined}
                  >
                    <Label className="text-sm font-semibold">Rol Personalizado</Label>
                    <Input
                      variant="secondary"
                      placeholder="Ej: Preparador Físico"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                    />
                    {errors.customRole && <FieldError>{errors.customRole}</FieldError>}
                  </TextField>
                )}

                <TextField
                  className="w-full"
                  isInvalid={!!errors.startedAt || undefined}
                >
                  <Label className="text-sm font-semibold flex items-center">
                    Fecha de Inicio
                  </Label>
                  <Input
                    variant="secondary"
                    type="date"
                    value={startedAt}
                    onChange={(e) => setStartedAt(e.target.value)}
                  />
                  {errors.startedAt && <FieldError>{errors.startedAt}</FieldError>}
                </TextField>

                <TextField
                  className="w-full"
                  isInvalid={!!errors.endedAt || undefined}
                >
                  <Label className="text-sm font-semibold flex items-center">
                    Fecha de Fin (Opcional)
                  </Label>
                  <Input
                    variant="secondary"
                    type="date"
                    value={endedAt}
                    onChange={(e) => setEndedAt(e.target.value)}
                  />
                  {errors.endedAt && <FieldError>{errors.endedAt}</FieldError>}
                </TextField>

                <div className="flex items-center gap-2 px-1">
                  <Switch isSelected={isPrimary} onChange={setIsPrimary}>
                    <Switch.Content>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      <Label className="text-sm font-semibold flex items-center">
                        Es el profesor principal
                        <InfoTooltip text="El profesor marcado como principal representará a esta clase/curso en la App para funciones oficiales (ej. llamado de asistencia principal)." />
                      </Label>
                    </Switch.Content>
                  </Switch>
                </div>

                {Object.keys(errors).length > 0 && (
                  <Alert status="danger">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Title>Formulario incompleto</Alert.Title>
                      <Alert.Description>
                        <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                          {Object.entries(errors).map(([field, msg]) => (
                            <li key={field}>{msg}</li>
                          ))}
                        </ul>
                      </Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}
              </Surface>
            </Drawer.Body>

            <Drawer.Footer className="border-t border-border">
              <Button
                slot="close"
                variant="secondary"
                isDisabled={loading}
                onPress={() => reset()}
                className="font-medium"
              >
                Cancelar
              </Button>
              <Button
                onPress={handleSubmit}
                isPending={loading}
                isDisabled={loading || Object.keys(errors).length > 0}
                className="font-semibold"
              >
                <HugeiconsIcon icon={Add01Icon} size={18} />
                Confirmar
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
};
