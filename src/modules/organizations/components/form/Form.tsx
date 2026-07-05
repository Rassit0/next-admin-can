"use client";
import {
  Alert,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  Surface,
  Switch,
  TextArea,
  TextField,
  toast,
  Select,
  ListBox,
  Checkbox,
} from "@heroui/react";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import {
  addOrganization,
  editOrganization,
  IOrganization,
} from "@/modules/organizations";
import { AutoCompleteDiscipline } from "./AutoCompleteDiscipline";

interface Props {
  organization?: IOrganization;
  formId: string;
  onSubmited?: () => void;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}
export const FormOrganization = ({
  organization,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  // Form
  const [name, setName] = useState(organization?.name || "");
  const [address, setAddress] = useState(organization?.address || "");
  const [email, setEmail] = useState(organization?.email || "");
  const [phone, setPhone] = useState(organization?.phone || "");
  const [logoUrl, setLogoUrl] = useState(organization?.imageUrl || "");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [disciplineIds, setDisciplineIds] = useState<number[]>([]);
  // fin Form

  const [allDisciplines, setAllDisciplines] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRemoveError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const { [fieldName]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name) {
      newErrors.name = "Debe ingresar un nombre";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading(true);
    let res;
    const data = {
      name,
      address,
      description,
      email,
      phone,
      logoUrl,
      isActive,
      disciplineIds: allDisciplines ? [] : disciplineIds,
    };
    if (organization) {
      res = await editOrganization({
        id: organization.id,
        data,
      });
    } else {
      res = await addOrganization(data);
    }
    setIsLoading(false);
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
      toast.danger(res.message, {
        description: errorDescription,
      });
      if (res.errors) {
        setErrors(res.errors);
      }
      return;
    }
    toast.success(res.message, {
      description: organization
        ? "La escuela se ha editado exitosamente"
        : "La escuela se ha agregado exitosamente",
    });
    onSubmited?.();
  };
  return (
    <Surface variant="transparent">
      <Form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          isRequired
          className="w-full"
          name="name"
          type="text"
          isInvalid={!!errors.name || undefined}
        >
          <Label>Nombre</Label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({});
            }}
            placeholder="Ingrese el nombre del rol"
          />
          <FieldError children={errors.name && <> {errors.name}</>} />
        </TextField>

        <Checkbox
          id="all-disciplines"
          isSelected={allDisciplines}
          onChange={setAllDisciplines}
        >
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label htmlFor="email-notifications">Todas las disciplinas</Label>
          </Checkbox.Content>
        </Checkbox>
        {!allDisciplines && (
          <AutoCompleteDiscipline
            isRequired
            disciplineIds={disciplineIds}
            setDisciplineIds={setDisciplineIds}
            errors={errors}
            handleRemoveError={handleRemoveError}
          />
        )}

        <TextField
          className="w-full"
          name="address"
          isInvalid={!!errors.address || undefined}
        >
          <Label>Dirección</Label>
          <TextArea
            placeholder="Ingrese la dirección de la escuela"
            rows={4}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setErrors({});
            }}
          />
          {/* <Description>Maximum 500 characters</Description> */}
          <FieldError children={errors.address && <> {errors.address}</>} />
        </TextField>

        <TextField
          className="w-full"
          name="phone"
          type="text"
          isInvalid={!!errors.phone || undefined}
        >
          <Label>Teléfono</Label>
          <Input
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrors({});
            }}
            placeholder="Ingrese el teléfono de la escuela"
          />
          <FieldError children={errors.phone && <> {errors.phone}</>} />
        </TextField>

        <TextField
          className="w-full"
          name="email"
          type="email"
          isInvalid={!!errors.email || undefined}
        >
          <Label>Correo Electrónico</Label>
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({});
            }}
            placeholder="Ingrese el correo electrónico de la escuela"
          />
          <FieldError children={errors.email && <> {errors.email}</>} />
        </TextField>

        <TextField
          className="w-full"
          name="description"
          isInvalid={!!errors.description || undefined}
        >
          <Label>Descripción</Label>
          <TextArea
            placeholder="Ingrese la descripción de la categoría"
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors({});
            }}
          />
          {/* <Description>Maximum 500 characters</Description> */}
          <FieldError
            children={errors.description && <> {errors.description}</>}
          />
        </TextField>

        <Card variant="default">
          <Switch
            size="lg"
            isSelected={isActive}
            onChange={setIsActive}
            className="w-full flex justify-between"
          >
            <Switch.Content>
              <Label className="text-sm">
                Estado {isActive ? "Activo" : "Inactivo"}
              </Label>
            </Switch.Content>
            <Switch.Control className={isActive ? "bg-success" : "bg-danger"}>
              <Switch.Thumb />
            </Switch.Control>
          </Switch>
          <Alert status="warning" className="bg-warning-soft">
            <Alert.Indicator />
            <Alert.Content>
              {/* <Alert.Title>Scheduled maintenance</Alert.Title> */}
              <Alert.Description>
                Las escuelas inactivas no se mostrarán en los formularios de
                inscripción.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </Card>
      </Form>
    </Surface>
  );
};
