"use client";
import {
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Surface,
  TextField,
  Select,
  TextArea,
  Switch,
} from "@heroui/react";
import { addPlayer, editPlayer, PostPlayerInterface } from "@/modules/players";
import { IPlayer } from "@/modules/players";
import { useEffect, useState } from "react";
import { SelectOrCreatePerson } from "./SelectOrCreatePerson";
import { toast } from "sonner";

interface Props {
  player?: IPlayer;
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormPlayer = ({
  player,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [personId, setPersonId] = useState<string | null>(
    player?.person.id || null,
  );
  const [isActive, setIsActive] = useState(() => {
    if (!player) return true;
    if (player.isActive === true) return true;
    return false;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRemoveError = (fieldName: string) => {
    // Limpiar solo el error de este campo específico
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Evitar que el submit de un formulario anidado (como el de Person) dispare este submit
    if ((e.target as HTMLFormElement).id !== formId) {
      return;
    }
    const newErrors: Record<string, string> = {};
    if (!personId) {
      newErrors.personId = "Debe seleccionar una persona";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    let res;
    const data: PostPlayerInterface = {
      personId: personId!,
      isActive,
    };
    if (player) {
      res = await editPlayer({ id: player.id, data });
    } else {
      res = await addPlayer({
        data,
      });
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
      toast.error(res.message, {
        description: errorDescription,
      });
      if (res.errors) {
        setErrors(res.errors);
      }
      return;
    }
    toast.success(res.message, {
      description: player
        ? "El jugador se ha editado exitosamente"
        : "El jugador se ha agregado exitosamente",
    });
    onSubmited?.();
  };
  return (
    <Surface variant="transparent">
      <Form
        id={formId}
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4"
      >
        {/* <!-- Basic Information: Bento Layout --> */}
        <div className="flex flex-col gap-8">
          {/* SecdocumentNumberón de Foto (Compacta pero llamativa) */}
          {/* <div className="flex flex-col sm:flex-row items-center gap-6 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full bg-background border-4 border-background shadow-inner flex items-center justify-center overflow-hidden">
                <HugeiconsIcon
                  icon={UserIcon}
                  className="h-12 w-12 text-on-surface-variant"
                />
              </div>
              <button
                className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
                type="button"
              >
                <HugeiconsIcon icon={CameraAdd01Icon} className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-headline font-bold text-lg">
                Foto de Perfil
              </h3>
              <p className="text-sm text-on-surface-variant">
                Sube una foto profesional para la identificadocumentNumberón
                institudocumentNumberonal. Tamaño máximo: 5 MB.
              </p>
            </div>
          </div> */}

          {/* Formulario (Grid optimizado) */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h2 className="font-headline text-xl font-bold">
                InformadocumentNumberón Básica
              </h2>
            </div>

            <div className="flex flex-col gap-5">
              <SelectOrCreatePerson
                isRequired
                label="Seleccione o cree una persona"
                personId={personId}
                setPersonId={setPersonId}
                errors={errors}
                handleRemoveError={handleRemoveError}
              />

              <div>
                <Switch isSelected={isActive} onChange={setIsActive}>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  <Switch.Content>
                    <Label className="text-sm">Activo</Label>
                  </Switch.Content>
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Surface>
  );
};
