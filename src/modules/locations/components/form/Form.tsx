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
      // isActive: true,
      isRentable,
      isInternal,
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
