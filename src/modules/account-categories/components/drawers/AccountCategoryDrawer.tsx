"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Input,
  ComboBox,
  ListBox,
  Label,
  TextArea,
  TextField,
} from "@heroui/react";
import { Cancel01Icon, FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IAccountCategory } from "../../interfaces/category.interface";
import { createAccountCategory } from "../../actions/create";
import { updateAccountCategory } from "../../actions/update";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  category?: IAccountCategory | null;
  onSuccess?: () => void;
}

export const AccountCategoryDrawer = ({
  isOpen,
  onOpenChange,
  category,
  onSuccess,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"RECEIVABLE" | "PAYABLE">("PAYABLE");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setName(category.name);
        setDescription(category.description || "");
        setType(category.type);
        setCode(category.code || "");
      } else {
        setName("");
        setDescription("");
        setType("PAYABLE");
        setCode("");
      }
    }
  }, [isOpen, category]);

  const handleSubmit = async () => {
    if (!name || !type) {
      toast.error("Por favor complete los campos requeridos");
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        name,
        description: description || undefined,
        type,
        code: code.trim() || undefined,
      };

      const res = category
        ? await updateAccountCategory(category.id, data)
        : await createAccountCategory(data);

      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="w-full sm:max-w-md">
          <Drawer.CloseTrigger />
          <Drawer.Header className="border-b border-border">
            <Drawer.Heading className="text-lg font-bold">
              {category ? "Editar Categoría" : "Nueva Categoría"}
            </Drawer.Heading>
          </Drawer.Header>
          <Drawer.Body className="gap-6 pt-6">
            <TextField className="w-full" isRequired>
              <Label className="text-sm font-semibold">Nombre</Label>
              <Input
                placeholder="Ej. Mantenimiento, Sueldos, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="secondary"
              />
            </TextField>

            <TextField className="w-full">
              <Label className="text-sm font-semibold">Código / Serie</Label>
              <Input
                placeholder="Ej. MAT (Se genera automático si se deja vacío)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                variant="secondary"
              />
            </TextField>
            
            <ComboBox
              className="w-full"
              variant="secondary"
              menuTrigger="focus"
              selectedKey={type}
              onSelectionChange={(key) => {
                if (key) setType(key as "RECEIVABLE" | "PAYABLE");
              }}
              isRequired
            >
              <Label className="text-sm font-semibold">Tipo</Label>
              <ComboBox.InputGroup>
                <Input variant="secondary" placeholder="Seleccione el tipo" />
                <ComboBox.Trigger />
              </ComboBox.InputGroup>
              <ComboBox.Popover>
                <ListBox>
                  <ListBox.Item id="RECEIVABLE" textValue="Ingreso (Cobro)">
                    Ingreso (Cobro)
                  </ListBox.Item>
                  <ListBox.Item id="PAYABLE" textValue="Egreso (Pago)">
                    Egreso (Pago)
                  </ListBox.Item>
                </ListBox>
              </ComboBox.Popover>
            </ComboBox>

            <TextField className="w-full">
              <Label className="text-sm font-semibold">Descripción</Label>
              <TextArea
                placeholder="Detalles adicionales sobre esta categoría"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </TextField>
          </Drawer.Body>
          <Drawer.Footer className="border-t border-border">
            <Button
              variant="outline"
              onPress={() => onOpenChange(false)}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
              Cancelar
            </Button>
            <Button
              variant="primary"
              onPress={handleSubmit}
              isDisabled={isLoading}
            >
              {!isLoading && <HugeiconsIcon icon={FloppyDiskIcon} size={18} />}
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
