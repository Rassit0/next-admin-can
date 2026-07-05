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
  toast,
  Select,
  TextArea,
} from "@heroui/react";
import { CameraAdd01Icon, UserIcon } from "@hugeicons/core-free-icons";
import {
  addPlayer,
  DocumentType,
  editPlayer,
  Gender,
  PostPlayerInterface,
} from "@/modules/players";
import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { IPlayer } from "@/modules/players";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SelectOrCreatePerson } from "./SelectOrCreatePerson";

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
  const [name, setName] = useState(player?.person.name || null);
  const [lastName, setLastName] = useState(player?.person.lastName || null);
  const [secondLastName, setSecondLastName] = useState(
    player?.person.secondLastName || null,
  );
  const [birthDate, setBirthDate] = useState<DateValue | null>(
    player?.person.birthDate
      ? parseDate(
          `${player.person.birthDate.getFullYear()}-${(player.person.birthDate.getMonth() + 1).toString().padStart(2, "0")}-${player.person.birthDate.getDate().toString().padStart(2, "0")}`,
        )
      : null,
  );
  const [documentType, setDocumentType] = useState<DocumentType>(
    player?.person.documentType || "CI",
  );
  const [documentNumber, setDocumentNumber] = useState(
    player?.person.documentNumber || null,
  );
  const [email, setEmail] = useState(player?.person.email || null);
  const [phone, setPhone] = useState(player?.person.phone || null);
  const [address, setAddress] = useState(player?.person.address || null);
  const [gender, setGender] = useState<Gender | null>(
    player?.person.gender || null,
  );
  const [isActive, setIsActive] = useState(player?.isActive || true);
  const [image, setImage] = useState<File | null>(null);

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
    if (!documentType) {
      newErrors.documentType = "Debe ingresar un tipo de documento";
    }
    if (!birthDate) {
      newErrors.birthDate = "Debe ingresar una fecha de nacimiento";
    }
    if (!gender) {
      newErrors.gender = "Debe ingresar un género";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    // let res;
    // const data: PostPlayerInterface = {
    //   person: {
    //     name: name!,
    //     lastName: lastName!,
    //     secondLastName,
    //     birthDate: birthDate!.toDate(getLocalTimeZone()),
    //     documentType: documentType!,
    //     documentNumber: documentNumber!,
    //     email,
    //     phone,
    //     address,
    //     imageUrl: image ? image : null,
    //     gender: gender!,
    //   },
    //   isActive,
    // };
    // if (player) {
    //   res = await editPlayer({ id: player.id, data });
    // } else {
    //   res = await addPlayer({
    //     data,
    //   });
    // }
    // setIsLoading?.(false);
    // if (res.error) {
    //   let errorDescription = res.message;

    //   if (res.errors) {
    //     // Convertimos el objeto { type: ["msg"] } en una lista de strings limpia
    //     errorDescription = Object.entries(res.errors)
    //       .map(([field, messages]) => {
    //         const msgList = Array.isArray(messages)
    //           ? messages.join(", ")
    //           : messages;
    //         return `${field}: ${msgList}`;
    //       })
    //       .join("\n"); // Los separamos por saltos de línea para el toast
    //   }

    //   // 2. Pasamos la descripción formateada al componente de notificaciones
    //   toast.danger(res.message, {
    //     description: errorDescription,
    //   });
    //   if (res.errors) {
    //     setErrors(res.errors);
    //   }
    //   return;
    // }
    // toast.success(res.message, {
    //   description: player
    //     ? "El jugador se ha editado exitosamente"
    //     : "El jugador se ha agregado exitosamente",
    // });
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
                Sube una foto profesional para la identificadocumentNumberón
                institudocumentNumberonal. Tamaño máximo: 5 MB.
              </p>
            </div>
          </div>

          {/* Formulario (Grid optimizado) */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h2 className="font-headline text-xl font-bold">
                InformadocumentNumberón Básica
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <SelectOrCreatePerson
                isRequired
                label="Seleccione o cree una persona"
                personId={personId}
                setPersonId={setPersonId}
                errors={errors}
                handleRemoveError={handleRemoveError}
              />

              {/* Nombre */}
              <TextField
                isRequired
                className="w-full"
                name="name"
                type="text"
                isInvalid={!!errors.name || undefined}
                variant="secondary"
                value={name || ""}
                onChange={(e) => {
                  setName(e || null);
                  handleRemoveError("name");
                }}
              >
                <Label>Nombre</Label>
                <Input placeholder="Ingrese el nombre" />
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
                    setSecondLastName(e.target.value || null);
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

              {/* Fecha de NadocumentNumbermiento */}
              <DatePicker
                isRequired
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

              {/* Tipos de documento */}
              <Select
                isRequired
                className="w-full"
                name="documentType"
                placeholder="SelecdocumentNumberone una talla"
                variant="secondary"
                isInvalid={!!errors.documentType || undefined}
                value={documentType}
                onChange={(e) => {
                  setDocumentType((e?.toString() as DocumentType) || null);
                  handleRemoveError("documentType");
                }}
              >
                <Label>Tipo de documento</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="CI" textValue="CI">
                      CI
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="NIT" textValue="NIT">
                      NIT
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
                <FieldError
                  children={errors.documentType && <> {errors.documentType}</>}
                />
              </Select>

              {/* Campo: CI */}
              <TextField
                isRequired
                className="w-full"
                name="documentNumber"
                type="text"
                isInvalid={!!errors.documentNumber || undefined}
                variant="secondary"
                value={documentNumber || ""}
                onChange={(e) => {
                  setDocumentNumber(e || null);
                  handleRemoveError("documentNumber");
                }}
              >
                <Label>CI</Label>
                <Input placeholder="Ingrese el nombre del rol" />
                <FieldError
                  children={
                    errors.documentNumber && <> {errors.documentNumber}</>
                  }
                />
              </TextField>

              {/* Genero */}
              <Select
                isRequired
                className="w-full"
                name="gender"
                placeholder="SelecdocumentNumberone una talla"
                variant="secondary"
                isInvalid={!!errors.gender || undefined}
                value={gender}
                onChange={(e) => {
                  setGender((e?.toString() as Gender) || null);
                  handleRemoveError("gender");
                }}
              >
                <Label>Genero</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="MALE" textValue="MALE">
                      Masculino
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="FEMALE" textValue="FEMALE">
                      Femenino
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
                <FieldError
                  children={errors.documentType && <> {errors.documentType}</>}
                />
              </Select>

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
                value={address || ""}
                onChange={(e) => {
                  setAddress(e || null);
                  handleRemoveError("address");
                }}
                variant="secondary"
              >
                <Label>Dirección</Label>
                <TextArea placeholder="Ingrese la dirección" />
                <FieldError
                  children={errors.address && <> {errors.address}</>}
                />
              </TextField>
            </div>
          </div>
        </div>
      </Form>
    </Surface>
  );
};
