"use client";
import { Label, ListBox, Select } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { textTypeActivity } from "../../../constants/map-activity";
import { ActivityType } from "@/modules/activities/interfaces/activity.interface";

interface Props {
  typesPermits: ActivityType[];
}

export const TypeFilter = ({ typesPermits }: Props) => {
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [type, setType] = useState<ActivityType | null>(
    searchParams.get("type") as ActivityType | null,
  );
  const handleUrlUpdate = useDebouncedCallback((value: string | null) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1"); // Reset a página 1

    if (value) {
      params.set("type", value);
    } else {
      params.delete("type");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  // 4. onChange maneja ambos estados
  const handleChange = (value: ActivityType | null) => {
    setType(value); // Actualiza el input inmediatamente
    handleUrlUpdate(value); // Debounce para la URL
  };

  return (
    <>
      <Select
        className="w-[256px]"
        placeholder="Filtrar por tipo"
        value={type}
        onChange={(value) =>
          handleChange(value?.toString() as ActivityType | null)
        }
      >
        <Label>Tipo de Actividad</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {Object.entries(textTypeActivity)
              .filter(([key]) => typesPermits.includes(key as ActivityType))
              .map(([key, value]) => (
                <ListBox.Item
                  key={key}
                  id={key}
                  textValue={value}
                  onPress={() => {
                    if (type === key) {
                      handleChange(null);
                    } else {
                      handleChange(key as ActivityType);
                    }
                  }}
                >
                  {value}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </>
  );
};
