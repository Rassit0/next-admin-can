"use client";
import { iconMap } from "@/utils/iconMap";
import {
  Calendar,
  DateField,
  DatePicker,
  Description,
  ErrorMessage,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Surface,
  Tag,
  TagGroup,
  TextField,
  toast,
  ToggleButton,
  Select,
  Button,
} from "@heroui/react";
import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  CameraAdd01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { SectionInfo } from "./SectionInfo";
import { SectionProfiles } from "./SectionProfiles";
import {
  addPerson,
  editPerson,
  IPerson,
  TDocumentType,
  TGender,
} from "@/modules/persons";
import type { DateValue } from "@internationalized/date";
import {
  fromDate,
  getLocalTimeZone,
  parseAbsolute,
  parseAbsoluteToLocal,
  parseDate,
  today,
} from "@internationalized/date";

interface Props {
  buttonsSubmit?: boolean;
  person?: IPerson;
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormPerson = ({
  buttonsSubmit = false,
  person,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [name, setName] = useState<string | null>(person?.name || null);
  const [lastName, setLastName] = useState<string | null>(
    person?.lastName || null,
  );
  const [secondLastName, setSurName] = useState<string | null>(
    person?.secondLastName || null,
  );
  const initialBirthDate = React.useMemo(
    () =>
      person?.birthDate
        ? parseDate(person.birthDate.toISOString().split("T")[0])
        : null,
    [person?.birthDate],
  );

  const [birthDate, setBirthDate] = useState<DateValue | null>(
    initialBirthDate,
  );
  const [image, setImage] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<TDocumentType | null>(
    person?.documentType || null,
  );
  const [documentNumber, setDocumentNumber] = useState<string | null>(
    person?.documentNumber || null,
  );
  const [phone, setPhone] = useState<string | null>(person?.phone || null);
  const [email, setEmail] = useState<string | null>(person?.email || null);
  const [address, setAddress] = useState<string | null>(
    person?.address || null,
  );
  const [gender, setGender] = useState<TGender | null>(person?.gender || null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDirty =
    name !== (person?.name || null) ||
    lastName !== (person?.lastName || null) ||
    secondLastName !== (person?.secondLastName || null) ||
    birthDate?.toString() !== initialBirthDate?.toString() ||
    image !== null ||
    documentType !== (person?.documentType || null) ||
    documentNumber !== (person?.documentNumber || null) ||
    phone !== (person?.phone || null) ||
    email !== (person?.email || null) ||
    address !== (person?.address || null) ||
    gender !== (person?.gender || null);

  const handleReset = () => {
    setName(person?.name || null);
    setLastName(person?.lastName || null);
    setSurName(person?.secondLastName || null);
    setBirthDate(initialBirthDate);
    setImage(null);
    setDocumentType(person?.documentType || null);
    setDocumentNumber(person?.documentNumber || null);
    setPhone(person?.phone || null);
    setEmail(person?.email || null);
    setAddress(person?.address || null);
    setGender(person?.gender || null);
    setErrors({});
  };

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
    const newErrors: Record<string, string> = {};
    if (!name) {
      newErrors.name = "Debe ingresar un nombre";
    }
    if (!lastName) {
      newErrors.lastName = "Debe ingresar un apellido";
    }
    if (!documentNumber) {
      newErrors.documentNumber = "Debe ingresar un número de documento";
    }
    if (!birthDate) {
      newErrors.birthDate = "Debe ingresar una fecha de nacimiento";
    }
    if (!documentType) {
      newErrors.documentType = "Debe seleccionar un tipo de documento";
    }
    if (!gender) {
      newErrors.gender = "Debe seleccionar un género";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      console.log({ newErrors });
      return;
    }
    setIsLoading?.(true);
    let res;
    const data = {
      name: name!,
      lastName: lastName!,
      secondLastName,
      birthDate: birthDate!.toDate(getLocalTimeZone()),
      image,
      documentType: documentType!,
      documentNumber: documentNumber!,
      phone,
      email,
      address,
      gender: gender!,
    };
    if (person) {
      res = await editPerson({ id: person.id, data });
    } else {
      res = await addPerson({
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
      toast.danger(res.message, {
        description: errorDescription,
      });
      if (res.errors) {
        setErrors(res.errors);
      }
      return;
    }
    toast.success(res.message, {
      description: person
        ? "La persona se ha editado exitosamente"
        : "La persona se ha agregado exitosamente",
    });
    onSubmited?.();
  };
  return (
    <Surface variant="transparent">
      <Form
        id={formId}
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="flex flex-col md:flex-row gap-4"
      >
        {/* <!-- Basic Information: Bento Layout --> */}
        <div className="flex flex-col gap-8 w-full">
          {/* Sección de Foto (Compacta pero llamativa) */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
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
                Sube una foto profesional para la identificación institucional.
                Tamaño máximo: 5 MB.
              </p>
            </div>
          </div>

          {/* Formulario (Grid optimizado) */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h2 className="font-headline text-xl font-bold">
                Información Básica
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nombre */}
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
                  value={name || ""}
                  onChange={(e) => {
                    setName(e.target.value || null);
                    handleRemoveError("name");
                  }}
                  placeholder="Ingrese el nombre"
                />
                <FieldError children={errors.name && <> {errors.name}</>} />
              </TextField>

              {/* Apellido Paterno */}
              <TextField
                isRequired
                className="w-full"
                name="lastName"
                type="text"
                isInvalid={!!errors.lastName || undefined}
              >
                <Label>Apellido Paterno</Label>
                <Input
                  variant="secondary"
                  value={lastName || ""}
                  onChange={(e) => {
                    setLastName(e.target.value || null);
                    handleRemoveError("lastName");
                  }}
                  placeholder="Ingrese el primer apellido"
                />
                <FieldError
                  children={errors.lastName && <> {errors.lastName}</>}
                />
              </TextField>

              {/* Apellido Materno */}
              <TextField
                className="w-full"
                name="secondLastName"
                type="text"
                isInvalid={!!errors.secondLastName || undefined}
              >
                <Label>Apellido Materno</Label>
                <Input
                  variant="secondary"
                  value={secondLastName || ""}
                  onChange={(e) => {
                    setSurName(e.target.value || null);
                    handleRemoveError("secondLastName");
                  }}
                  placeholder="Ingrese el segundo apellido"
                />
                <FieldError
                  children={
                    errors.secondLastName && <> {errors.secondLastName}</>
                  }
                />
              </TextField>

              {/* Talla Estandar */}
              <Select
                className="w-full"
                name="documentType"
                placeholder="Seleccione un documento"
                variant="secondary"
                isInvalid={!!errors.documentType || undefined}
                value={documentType}
                onChange={(e) => {
                  setDocumentType((e?.toString() as TDocumentType) || null);
                  setErrors({});
                }}
              >
                <Label>Tipo de Documento</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item
                      id="CI"
                      textValue="CI"
                      onPress={() => {
                        if (documentType === "CI") {
                          setDocumentType(null);
                        }
                      }}
                    >
                      CI
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item
                      id="NIT"
                      textValue="NIT"
                      onPress={() => {
                        if (documentType === "NIT") {
                          setDocumentType(null);
                        }
                      }}
                    >
                      NIT
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
                <FieldError children={errors.gender && <> {errors.gender}</>} />
              </Select>

              {/* Campo: CI */}
              <TextField
                isRequired
                className="w-full"
                name="documentNumber"
                type="text"
                isInvalid={!!errors.documentNumber || undefined}
              >
                <Label>Documento</Label>
                <Input
                  variant="secondary"
                  value={documentNumber || ""}
                  onChange={(e) => {
                    setDocumentNumber(e.target.value || null);
                    handleRemoveError("documentNumber");
                  }}
                  placeholder="Ingrese el documento"
                />
                <FieldError
                  children={
                    errors.documentNumber && <> {errors.documentNumber}</>
                  }
                />
              </TextField>

              {/* Fecha de Nacimiento */}
              <DatePicker
                // isRequired
                isInvalid={!!errors.birthDate || undefined}
                name="birthDate"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e);
                  handleRemoveError("birthDate");
                }}
              >
                <Label>Fecha de Nacimiento</Label>
                <DateField.Group fullWidth variant="secondary">
                  <DateField.Input>
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                  <DateField.Suffix>
                    <DatePicker.Trigger>
                      <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                  </DateField.Suffix>
                </DateField.Group>
                <FieldError
                  children={errors.birthDate && <> {errors.birthDate}</>}
                />
                <DatePicker.Popover>
                  <Calendar aria-label="Event date">
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
                          <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                        )}
                      </Calendar.GridHeader>
                      <Calendar.GridBody>
                        {(date) => <Calendar.Cell date={date} />}
                      </Calendar.GridBody>
                    </Calendar.Grid>
                    <Calendar.YearPickerGrid>
                      <Calendar.YearPickerGridBody>
                        {({ year }) => <Calendar.YearPickerCell year={year} />}
                      </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                  </Calendar>
                </DatePicker.Popover>
              </DatePicker>

              {/* Phone */}
              <TextField
                className="w-full"
                name="phone"
                type="tel"
                isInvalid={!!errors.phone || undefined}
              >
                <Label>Telefono</Label>
                <Input
                  variant="secondary"
                  value={phone || ""}
                  onChange={(e) => {
                    setPhone(e.target.value || null);
                    handleRemoveError("phone");
                  }}
                  placeholder="Ingrese el telefono"
                />
                <FieldError children={errors.phone && <> {errors.phone}</>} />
              </TextField>

              {/* Email */}
              <TextField
                className="w-full"
                name="email"
                type="email"
                isInvalid={!!errors.email || undefined}
              >
                <Label>Email</Label>
                <Input
                  variant="secondary"
                  value={email || ""}
                  onChange={(e) => {
                    setEmail(e.target.value || null);
                    handleRemoveError("email");
                  }}
                  placeholder="Ingrese el email"
                />
                <FieldError children={errors.email && <> {errors.email}</>} />
              </TextField>

              {/* address */}
              <TextField
                className="w-full"
                name="address"
                type="text"
                isInvalid={!!errors.address || undefined}
              >
                <Label>Direccion</Label>
                <Input
                  variant="secondary"
                  value={address || ""}
                  onChange={(e) => {
                    setAddress(e.target.value || null);
                    handleRemoveError("address");
                  }}
                  placeholder="Ingrese la direccion"
                />
                <FieldError
                  children={errors.address && <> {errors.address}</>}
                />
              </TextField>

              {/* Talla Estandar */}
              <Select
                className="w-full"
                name="gender"
                placeholder="Seleccione un genero"
                variant="secondary"
                isInvalid={!!errors.gender || undefined}
                value={gender}
                onChange={(e) => {
                  setGender((e?.toString() as TGender) || "");
                  setErrors({});
                }}
              >
                <Label>Genero</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item
                      id="MALE"
                      textValue="MALE"
                      onPress={() => {
                        if (gender === "MALE") {
                          setGender(null);
                        }
                      }}
                    >
                      Masculino
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item
                      id="FEMALE"
                      textValue="FEMALE"
                      onPress={() => {
                        if (gender === "FEMALE") {
                          setGender(null);
                        }
                      }}
                    >
                      Femenino
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
                <FieldError children={errors.gender && <> {errors.gender}</>} />
              </Select>
            </div>
          </div>
          {buttonsSubmit && (
            <div className="flex justify-end gap-2">
              <Button type="submit" variant="primary" isDisabled={!isDirty}>
                Guardar
              </Button>
              <Button type="reset" variant="danger" isDisabled={!isDirty}>
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </Form>
    </Surface>
  );
};
