"use client";
import { iconMap } from "@/utils/iconMap";
import {
  Description,
  ErrorMessage,
  FieldError,
  Form,
  Input,
  Label,
  Surface,
  Tag,
  TagGroup,
  TextArea,
  TextField,
  toast,
  ToggleButton,
  Select,
  ListBox,
  CheckboxGroup,
  Checkbox,
} from "@heroui/react";
import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ILocation } from "../../interfaces/location.interface";
import { editLocation } from "../../actions/edit";
import { addLocation } from "../../actions/add";

interface Props {
  location?: ILocation;
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormLocation = ({
  location,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [name, setName] = useState(location?.name || "");
  const [address, setAddress] = useState(location?.address || "");
  const [description, setDescription] = useState(location?.description || "");
  // const [isActive, setIsActive] = useState(location?.isActive || true);
  const [isRentable, setIsRentable] = useState(
    location?.isRentable === true ? true : false,
  );
  const [isInternal, setIsInternal] = useState(
    location?.isInternal === true ? true : false,
  );
  const [latitude, setLatitude] = useState<string>(location?.latitude?.toString() || "");
  const [longitude, setLongitude] = useState<string>(location?.longitude?.toString() || "");
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>(location?.googleMapsUrl || "");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!name) {
      newErrors.name = "Debe ingresar un nombre";
    }
    if (!address) {
      newErrors.address = "Debe ingresar una dirección";
    }
    const latNum = latitude ? parseFloat(latitude) : null;
    const lngNum = longitude ? parseFloat(longitude) : null;

    if ((latNum !== null && lngNum === null) || (latNum === null && lngNum !== null)) {
      newErrors.latitude = "Debes ingresar tanto la latitud como la longitud juntas, o dejar ambas en blanco.";
      newErrors.longitude = "Debes ingresar tanto la latitud como la longitud juntas, o dejar ambas en blanco.";
    }

    if (googleMapsUrl && !/^https?:\/\/.+/i.test(googleMapsUrl)) {
      newErrors.googleMapsUrl = "Debe ser un enlace válido que comience con http:// o https://";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    let res;
    const data = {
      name,
      address,
      description,
      isRentable,
      isInternal,
      latitude: latNum,
      longitude: lngNum,
      googleMapsUrl: googleMapsUrl || null,
    };
    if (location) {
      res = await editLocation({ id: location.id, data });
    } else {
      res = await addLocation({ data });
    }
    setIsLoading?.(false);
    if (res.error) {
      toast.danger(res.message, {
        description: res.message,
      });
      if (res.errors) {
        setErrors(res.errors);
      }
      return;
    }
    toast.success(res.message, {
      description: location
        ? "La instalación se ha editado exitosamente"
        : "La instalación se ha agregado exitosamente",
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
            variant="secondary"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({});
            }}
            placeholder="Ingrese el nombre de la instalación"
          />
          <FieldError children={errors.name && <> {errors.name}</>} />
        </TextField>
        <TextField
          isRequired
          className="w-full"
          name="address"
          isInvalid={!!errors.address || undefined}
        >
          <Label>Dirección</Label>
          <TextArea
            variant="secondary"
            placeholder="Ingrese la dirección de la instalación"
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
          name="description"
          isInvalid={!!errors.description || undefined}
        >
          <Label>Descripción</Label>
          <TextArea
            variant="secondary"
            placeholder="Ingrese la descripción de la categorí­a"
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

        <div className="flex flex-col gap-2 mt-4 p-4 border border-border/50 rounded-lg bg-muted/10">
          <h3 className="font-heading text-primary font-bold uppercase tracking-wider text-sm mb-2">Ubicación geográfica</h3>
          <span className="text-xs text-muted-foreground mb-4">Latitud y longitud deben completarse juntas. (Opcional)</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              className="w-full"
              name="latitude"
              type="number"
              isInvalid={!!errors.latitude || undefined}
            >
              <Label>Latitud (opcional)</Label>
              <Input
                variant="secondary"
                value={latitude}
                onChange={(e) => {
                  setLatitude(e.target.value);
                  setErrors({});
                }}
                placeholder="Ej: -17.9647"
              />
              <FieldError children={errors.latitude && <> {errors.latitude}</>} />
            </TextField>

            <TextField
              className="w-full"
              name="longitude"
              type="number"
              isInvalid={!!errors.longitude || undefined}
            >
              <Label>Longitud (opcional)</Label>
              <Input
                variant="secondary"
                value={longitude}
                onChange={(e) => {
                  setLongitude(e.target.value);
                  setErrors({});
                }}
                placeholder="Ej: -67.1060"
              />
              <FieldError children={errors.longitude && <> {errors.longitude}</>} />
            </TextField>
          </div>

          <TextField
            className="w-full mt-2"
            name="googleMapsUrl"
            type="url"
            isInvalid={!!errors.googleMapsUrl || undefined}
          >
            <Label>Enlace del mapa (opcional)</Label>
            <Input
              variant="secondary"
              value={googleMapsUrl}
              onChange={(e) => {
                setGoogleMapsUrl(e.target.value);
                setErrors({});
              }}
              placeholder="Ej: https://maps.google.com/..."
            />
            <FieldError children={errors.googleMapsUrl && <> {errors.googleMapsUrl}</>} />
          </TextField>
        </div>

        <CheckboxGroup
          name="preferences"
          variant="secondary"
          value={[
            ...(isRentable ? ["isRentable"] : []),
            ...(isInternal ? ["isInternal"] : []),
          ]}
          onChange={(value) => {
            setIsRentable(value.includes("isRentable"));
            setIsInternal(value.includes("isInternal"));
          }}
        >
          <Label>Preferencias</Label>
          <Checkbox value="isRentable">
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label>¿Se puede alquilar?</Label>
            </Checkbox.Content>
          </Checkbox>
          <Checkbox value="isInternal">
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label>¿Es interno?</Label>
            </Checkbox.Content>
          </Checkbox>
        </CheckboxGroup>
      </Form>
    </Surface>
  );
};
