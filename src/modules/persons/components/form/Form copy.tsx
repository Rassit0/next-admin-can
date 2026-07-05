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
  TextField,
  toast,
  ToggleButton,
} from "@heroui/react";
import React, { useState } from "react";
import {
  addDiscipline,
  editDiscipline,
  IDiscipline,
} from "@/modules/disciplines";
import { HugeiconsIcon } from "@hugeicons/react";
import { CameraAdd01Icon } from "@hugeicons/core-free-icons";
import { SectionInfo } from "./SectionInfo";
import { SectionProfiles } from "./SectionProfiles";

interface Props {
  discipline?: IDiscipline;
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormMember = ({
  discipline,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [name, setName] = useState(discipline?.name || "");
  const [icon, setIcon] = useState(discipline?.icon || "");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!icon) {
      newErrors.icon = "Debe seleccionar un icono";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    let res;
    if (discipline) {
      res = await editDiscipline({ id: discipline.id, data: { name, icon } });
    } else {
      res = await addDiscipline({ data: { name, icon } });
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
      //   actionProps: {
      //     children: "Ver",
      //     className: "bg-success text-success-foreground",
      //     onPress: noop,
      //   },
      description: discipline
        ? "La disciplina se ha agregado exitosamente"
        : "La disciplina se ha agregado exitosamente",
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
        {/* <!-- Left Column: Personal Info (Asymmetric Layout) --> */}

        {/* <!-- Right Column: Profile Assignments (Bento Grid Style) --> */}
        <SectionInfo />
        <SectionProfiles />
      </Form>
    </Surface>
  );
};
